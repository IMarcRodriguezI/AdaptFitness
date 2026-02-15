# Local S3 Deployment Test Script (Windows)
# This script builds your frontend and uploads it to S3

param(
    [string]$BucketName = $env:S3_BUCKET_NAME,
    [string]$AwsRegion = "us-east-1"
)

# Colors for output
function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Error { Write-Host "❌ $args" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }
function Write-Step { Write-Host "📍 $args" -ForegroundColor Yellow }

Write-Host "🚀 Frontend Build & S3 Deploy Script" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow

# Check if bucket name is provided
if (-not $BucketName) {
    Write-Error "S3_BUCKET_NAME is not set"
    Write-Host "Usage: .\deploy.ps1 -BucketName 'my-bucket'" -ForegroundColor Yellow
    Write-Host "Or set environment variable: `$env:S3_BUCKET_NAME = 'my-bucket'" -ForegroundColor Yellow
    exit 1
}

# Check if AWS CLI is installed
try {
    $awsVersion = aws --version 2>&1
    Write-Success "AWS CLI found: $awsVersion"
} catch {
    Write-Error "AWS CLI is not installed"
    Write-Host "Install from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Check AWS credentials
try {
    aws sts get-caller-identity --region $AwsRegion | Out-Null
    Write-Success "AWS credentials are configured"
} catch {
    Write-Error "AWS credentials not configured"
    Write-Host "Run: aws configure" -ForegroundColor Yellow
    exit 1
}

# Build the frontend
Write-Host ""
Write-Step "Building frontend..."
Push-Location .\frontend
try {
    npm ci
    npm run build
    if (-not (Test-Path "build/client")) {
        throw "Build directory not found"
    }
    Write-Success "Build successful: build/client generated"
} catch {
    Write-Error "Build failed: $_"
    Pop-Location
    exit 1
}
Pop-Location

# Upload to S3
Write-Host ""
Write-Step "Uploading to S3 (s3://$BucketName/)..."

try {
    aws s3 sync "frontend/build/client" "s3://$BucketName/" `
        --region $AwsRegion `
        --delete `
        --cache-control "public, max-age=3600" `
        --exclude "*.map"
    
    Write-Host ""
    Write-Success "Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your app is available at:" -ForegroundColor Cyan
    Write-Host "  S3 Website: http://$BucketName.s3-website-$AwsRegion.amazonaws.com" -ForegroundColor Yellow
    Write-Host ""
} catch {
    Write-Error "Upload failed: $_"
    exit 1
}
