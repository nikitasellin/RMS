#!/bin/bash
set -e

echo "Starting PostgreSQL..."
while ! nc -z $PG_HOST 5432; do
  sleep 1
done
echo "Done"

echo "Making migrations..."
python manage.py makemigrations
python manage.py migrate
echo "Done"

if [ ! -d "media" ]; then
  echo "First run!"
  echo "Creating admin user..."
  python manage.py create_administrator --email $ADMIN_USER --password $ADMIN_PASSWORD --first_name Nikita --last_name Selin --middle_name=A.
  echo "Filling cities..."
  python manage.py cities_light
  echo "Creating groups..."
  python manage.py create_groups
  echo "Creating accounts..."
  python manage.py create_users
  echo "Creating customers..."
  python manage.py create_customers
  echo "Creating sites..."
  python manage.py create_sites
  echo "Creating directions..."
  python manage.py create_directions
  echo "Creating execution variants..."
  python manage.py create_execution_variants
  echo "Creating tasks..."
  python manage.py create_tasks
  echo "Preparing media..."
  mkdir -p media
  # @TODO! Add static images.
  #  cp static/images/* media/ -r
  echo "All done"
fi

echo "Starting backend app..."
python manage.py runserver 0.0.0.0:8000
