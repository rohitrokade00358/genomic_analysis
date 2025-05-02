import paramiko

HPC_HOST = "paramutkarsh.cdac.in"
HPC_PORT = 4422
HPC_USERNAME = "lab11_aicte"
SSH_KEY_PATH = "C:/Users/rohit/.ssh/id_rsa"

def test_ssh_connection():
    print("🔹 Attempting to connect to HPC...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        ssh.connect(HPC_HOST, port=HPC_PORT, username=HPC_USERNAME, key_filename=SSH_KEY_PATH)
        print("✅ Successfully connected to HPC!")
        stdin, stdout, stderr = ssh.exec_command("hostname")
        print("🔹 HPC Response:", stdout.read().decode().strip())
        ssh.close()
    except Exception as e:
        print(f"❌ SSH Connection Failed: {str(e)}")

test_ssh_connection()
