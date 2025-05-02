import time
import paramiko
from django.shortcuts import render, redirect
from .forms import ScriptForm

#  HPC Credentials
HPC_HOST = ""
HPC_PORT = ""
HPC_USERNAME = ""
SSH_KEY_PATH = r""  # Update this path

#  Remote Paths on HPC
REMOTE_SCRIPT_PATH = "/home/user_script.py"
REMOTE_SLURM_PATH = "/home/run_script.sh"
REMOTE_OUTPUT_PATH = "/home/output_{job_id}.txt"

def submit_script(request):
    """Handles user script submission, uploads it to HPC, and submits a Slurm job."""
    if request.method == "POST":
        form = ScriptForm(request.POST)
        if form.is_valid():
            script_content = form.cleaned_data["code"]

            # 🔹 Connect to HPC
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(HPC_HOST, port=HPC_PORT, username=HPC_USERNAME, key_filename=SSH_KEY_PATH)
            print("Connected to HPC!")

            # Upload user script
            sftp = ssh.open_sftp()
            with sftp.file(REMOTE_SCRIPT_PATH, "w") as script_file:
                script_file.write(script_content)
            sftp.close()
            print("Script uploaded to HPC!")

            # 🔹 Submit Slurm Job
            stdin, stdout, stderr = ssh.exec_command(f"sbatch {REMOTE_SLURM_PATH}")
            job_submission_output = stdout.read().decode().strip()
            print(f"Job Submission Output: {job_submission_output}")

            # Extract job ID
            if "Submitted batch job" in job_submission_output:
                job_id = job_submission_output.split()[-1]
                print(f" Job Submitted: {job_id}")
            else:
                job_id = None
                print("Failed to retrieve job ID")

            ssh.close()

            # Redirect to status page
            if job_id:
                return redirect("check_status", job_id=job_id)
            else:
                return render(request, "index.html", {"form": form, "error": "Job submission failed."})

    else:
        form = ScriptForm()
    return render(request, "index.html", {"form": form})


def check_status(request, job_id):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HPC_HOST, port=HPC_PORT, username=HPC_USERNAME, key_filename=SSH_KEY_PATH)

    # Check job status
    stdin, stdout, stderr = ssh.exec_command(f"squeue --job {job_id}")
    job_status = stdout.read().decode().strip()

    if str(job_id) in job_status:
        status = "Running"
    else:
        status = "Completed"

    #  Wait for output file to be written
    time.sleep(5)

    #  Retrieve output file
    output_path = REMOTE_OUTPUT_PATH.format(job_id=job_id)
    sftp = ssh.open_sftp()
    try:
        with sftp.file(output_path, "r") as output_file:
            output = output_file.read().decode()
            print(f"Output retrieved for Job {job_id}: {output}")
        
    except FileNotFoundError:
        output = "No output file found."
    
    sftp.close()
    ssh.close()

    return render(request, "status.html", {"job_id": job_id, "status": status, "output": output})