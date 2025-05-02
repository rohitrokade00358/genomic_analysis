import paramiko
import time
from django.shortcuts import render
from django.http import JsonResponse
from .forms import GeneInputForm

# HPC Credentials
HPC_HOST = "paramutkarsh.cdac.in"
HPC_PORT = 4422
HPC_USERNAME = "lab11_aicte"
# ssh-keygen -t rsa -b 4096 -f "C:/Users/rohit/.ssh/id_rsa"
# ssh-keygen → Command to generate an SSH key pair.
# -t rsa → Specifies RSA algorithm.
# -b 4096 → Generates a 4096-bit key (more secure than the default 2048-bit).
# -f "C:/Users/rohit/.ssh/id_rsa" → Saves the key at the specified location.
SSH_KEY_PATH = "C:/Users/rohit/.ssh/id_rsa"  # key path
REMOTE_SCRIPT_PATH = "/home/lab11_aicte/project1/run_model.sh"
OUTPUT_FILE_PATH = "/home/lab11_aicte/project1/output.txt"
def predict(request):
    if request.method == "POST":
        gene = request.POST.get("gene")
        sequence = request.POST.get("sequence")

        if not gene or not sequence:
            return JsonResponse({"error": "Gene and Sequence are required."}, status=400)

        print("Connecting to HPC...")

        # Establish SSH connection
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        try:
            ssh.connect(HPC_HOST, port=HPC_PORT, username=HPC_USERNAME, key_filename=SSH_KEY_PATH)
            print(" Connected to HPC!")

            # Remove old output file
            ssh.exec_command(f"rm -f {OUTPUT_FILE_PATH}")

            # Submit SLURM job
            cmd = f"sbatch {REMOTE_SCRIPT_PATH} '{gene}' '{sequence}'"
            stdin, stdout, stderr = ssh.exec_command(cmd)
            job_submission_output = stdout.read().decode().strip()
            print("Submitted Job:", job_submission_output)

            job_id = job_submission_output.split()[-1]  # Extract job ID

            # Wait for job to complete
            job_status_cmd = f"squeue -u {HPC_USERNAME} | grep {job_id}"
            print(" Waiting for job to complete...")

            max_retries = 30  # Wait up to 30 seconds
            for _ in range(max_retries):
                time.sleep(2)
                stdin, stdout, stderr = ssh.exec_command(job_status_cmd)
                job_status = stdout.read().decode().strip()

                if not job_status:  # Job is not in queue
                    break  # Exit loop when job is done

            print("Job Completed! Retrieving results...")

            # Retrieve result file
            sftp = ssh.open_sftp()
            try:
                with sftp.file(OUTPUT_FILE_PATH, "r") as f:
                    result_data = f.read().decode()
            except FileNotFoundError:
                print(" Prediction failed: No output file found.")
                return JsonResponse({"error": "Prediction failed. No output file found."}, status=500)
            finally:
                sftp.close()
            
            # Parse results
            result_lines = result_data.split("\n")
            result_dict = {line.split(":")[0]: line.split(":")[1].strip() for line in result_lines if ":" in line}

            print(" Results Retrieved!")
            print(result_dict)

            ssh.close()

            return JsonResponse(result_dict)

        except Exception as e:
            print(" HPC Connection Failed:", e)
            ssh.close()
            return JsonResponse({"error": f"Failed to connect to HPC: {str(e)}"}, status=500)

    return render(request, "predict.html")  # Load HTML page



def index(request):
    return render(request, 'index3.html')