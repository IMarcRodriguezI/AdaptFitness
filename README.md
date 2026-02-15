# AdaptFitness
## Deployment

This project includes automated CI/CD deployment to AWS S3.

### Quick Start

1. **First Time Setup**: Follow the [CI/CD Setup Guide](CI_CD_SETUP.md) to configure AWS and GitHub Secrets
2. **Local Testing**: Use the deployment script to test locally:
   
   **Windows (PowerShell):**
   ```powershell
   $env:S3_BUCKET_NAME = "your-bucket-name"
   .\deploy.ps1
   ```
   
   **macOS/Linux:**
   ```bash
   export S3_BUCKET_NAME="your-bucket-name"
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Automatic Deployment**: Push to `main` branch and the workflow runs automatically

### Documentation

- [Complete CI/CD Setup Guide](CI_CD_SETUP.md) - AWS configuration, IAM setup, GitHub Secrets
- [GitHub Actions Workflow](.github/workflows/build-and-deploy.yml) - Automated build and deployment