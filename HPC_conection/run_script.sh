
#!/bin/bash
#SBATCH --job-name=user_script
#SBATCH --output=scripts/output_%j.txt  #   Dynamic output file
#SBATCH --error=scripts/error_%j.txt
#SBATCH --time=01:05:00
#SBATCH --mem=4GB
#SBATCH --cpus-per-task=4
#SBATCH --ntasks=1
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1

module purge
module load python/3.7.11

python3 /user_script.py > scripts/output_${SLURM_JOB_ID}.txt 2>