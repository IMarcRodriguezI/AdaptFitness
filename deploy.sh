#!/bin/bash
# Local S3 Deployment Test Script
# This script builds your frontend and uploads it to S3

set -e

# Configuration
BUCKET_NAME="${S3_BUCKET_NAME:-}"
AWS_REGION="${AWS_REGION:-us-east-1}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Frontend Build & S3 Deploy Script${NC}"
echo "========================================"

# Check if bucket name is provided
if [ -z "$BUCKET_NAME" ]; then
    echo -e "${RED}❌ Error: S3_BUCKET_NAME is not set${NC}"
    echo "Usage: S3_BUCKET_NAME=my-bucket ./deploy.sh"
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    echo "Install from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured${NC}"
    echo "Run: aws configure"
    exit 1
fi

echo -e "${GREEN}✓ AWS CLI configured${NC}"

# Build the frontend
echo ""
echo -e "${YELLOW}📦 Building frontend...${NC}"
cd frontend
npm ci
npm run build
cd ..

if [ ! -d "frontend/build/client" ]; then
    echo -e "${RED}❌ Build failed: frontend/build/client directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"

# Upload to S3
echo ""
echo -e "${YELLOW}📤 Uploading to S3 (s3://${BUCKET_NAME}/)...${NC}"
aws s3 sync frontend/build/client s3://${BUCKET_NAME}/ \
    --region $AWS_REGION \
    --delete \
    --cache-control "public, max-age=3600" \
    --exclude "*.map"

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo "Your app is available at:"
echo "  S3 Website: http://${BUCKET_NAME}.s3-website-${AWS_REGION}.amazonaws.com"
echo ""
