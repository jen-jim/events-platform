#!/bin/bash

DB_NAME="cupping_room"
DB_USER="cupping_client"
DB_PASS="cupping123"
SQL_FILE="$(dirname "$0")/cupping_room.sql"

echo "☕ Setting up The Cupping Room database..."

# Create the database user (if it doesn't already exist)
echo "→ Creating PostgreSQL user..."
psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
psql postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"

# Create the database (if it doesn't already exist)
echo "→ Creating database..."
psql postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
psql postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# Grant privileges
echo "→ Granting privileges..."
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Import data
if [ -f "$SQL_FILE" ]; then
    echo "→ Importing data from $SQL_FILE..."
    PGPASSWORD=$DB_PASS psql -U $DB_USER -d $DB_NAME -f $SQL_FILE
else
    echo "⚠️  $SQL_FILE not found. Skipping data import."
fi

echo "✅ Database setup complete!"
echo "You can now add this to your .env file:"
echo "DATABASE_URL=postgres://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
