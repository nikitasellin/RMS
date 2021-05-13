#!/bin/bash
set -e

echo "Starting celery"
celery -A config worker --loglevel=INFO
