from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import pyfaidx
import gc
import os
import re
import matplotlib.pyplot as plt

# Enable eager execution for TensorFlow 1.x compatibility
tf.compat.v1.enable_eager_execution()

# Configuration
MODEL_URL = 'https://tfhub.dev/deepmind/enformer/1'
TARGET_TRACKS = {'CAGE_HEK293': 4828, 'DNase_HepG2': 5111}

class Enformer:
    def __init__(self, tfhub_url):
        self._model = hub.load(tfhub_url).model

    def predict_on_batch(self, inputs):
        return self._model.predict_on_batch(inputs)['human'][0]

    @tf.function
    def contribution_input_grad(self, input_sequence, target_mask):
        input_sequence = input_sequence[tf.newaxis]
        with tf.GradientTape() as tape:
            tape.watch(input_sequence)
            prediction = tf.reduce_sum(target_mask * self._model.predict_on_batch(input_sequence)['human'][0])
        return tf.squeeze(tape.gradient(prediction, input_sequence) * input_sequence)

def one_hot_encode_dna(sequence):
    """One-hot encode a DNA sequence using NumPy"""
    char_to_index = {'A': 0, 'C': 1, 'G': 2, 'T': 3}
    one_hot = np.zeros((len(sequence), 4), dtype=np.float32)
    for i, base in enumerate(sequence):
        if base in char_to_index:
            one_hot[i, char_to_index[base]] = 1.0
        else:
            one_hot[i, :] = 0.0  # Handle invalid base by assigning zeros
    return one_hot

def plot_tracks(predictions, interval):
    """Plot expression tracks for a single interval"""
    plt.figure(figsize=(10, 4))
    for track_name, track_idx in TARGET_TRACKS.items():
        plt.plot(predictions[:, track_idx], label=track_name)
    plt.title(f'Gene Expression - {interval}')
    plt.xlabel("Position")
    plt.ylabel("Signal")
    plt.legend()
    
    # Save the image
    img_path = f"media/expression_{interval}.png"
    plt.savefig(img_path)
    plt.close()
    return img_path

def process_interval(fasta_path, interval):
    """Process the input FASTA file and generate gene expression visualization"""
    chrom, positions = interval.split(':')
    start, end = map(int, positions.split('-'))
    seq_start = max(0, (start + end) // 2 - 393216 // 2)
    seq_end = seq_start + 393216

    # Modify the FASTA file to use `chr1`
    output_file = fasta_path.replace(".fa", "_modified.fa")
    with open(fasta_path, "r") as infile, open(output_file, "w") as outfile:
        for line in infile:
            outfile.write(re.sub(r">chr\d+", ">chr1", line))

    # Load the modified FASTA file
    fasta_extractor = pyfaidx.Faidx(output_file, rebuild=True)

    # Fetch sequence
    try:
        sequence = str(fasta_extractor.fetch(chrom, seq_start + 1, seq_end)).upper()
    except:
        sequence = 'N' * 393216

    # Perform one-hot encoding using the custom function
    sequence_one_hot = one_hot_encode_dna(sequence)

    # Instantiate the Enformer model and make predictions
    predictor = Enformer(MODEL_URL)
    predictions = predictor.predict_on_batch(sequence_one_hot[np.newaxis])

    # Generate and save the visualization
    img_path = plot_tracks(predictions, interval)

    del sequence, sequence_one_hot, predictions, fasta_extractor
    gc.collect()

    return img_path

@api_view(["POST"])
def process_ml_model(request):
    """API to handle file upload and process ML model"""
    if "file" not in request.FILES:
        return Response({"error": "No file uploaded"}, status=400)

    fasta_file = request.FILES["file"]
    file_extension = fasta_file.name.split(".")[-1].lower()

    if file_extension not in ["fasta", "fa"]:
        return Response({"error": "Unsupported file format. Please upload a .fasta or .fa file."}, status=400)

    # Ensure the upload directory exists
    upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
    os.makedirs(upload_dir, exist_ok=True)

    fasta_path = os.path.join(upload_dir, fasta_file.name)
    
    with open(fasta_path, "wb") as f:
        for chunk in fasta_file.chunks():
            f.write(chunk)

    # Define interval for processing
    interval = 'chr1:40000000-48056433'

    # Run ML processing
    img_path = process_interval(fasta_path, interval)

    return Response({"image_url": f"http://127.0.0.1:8000/{img_path}"})