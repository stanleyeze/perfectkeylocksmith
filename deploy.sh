#!/bin/bash
# Perfect Key Locksmith - Deploy to S3
# Usage: ./deploy.sh

set -e

BUCKET="perfectkeylocksmith.com"
REGION="us-east-1"

echo "🚀 Deploying to S3..."
echo ""

# Sync files to S3 (excludes git files, scripts)
aws s3 sync . s3://$BUCKET \
    --exclude ".git/*" \
    --exclude ".gitignore" \
    --exclude "*.sh" \
    --exclude ".DS_Store" \
    --exclude "node_modules/*" \
    --delete

echo ""
echo "✅ Deployed to https://$BUCKET"
echo ""

# Optional: Invalidate CloudFront cache (uncomment if using CloudFront)
# DISTRIBUTION_ID="YOUR_DISTRIBUTION_ID"
# aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
# echo "✅ CloudFront cache invalidated"

