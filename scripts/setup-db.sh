#!/bin/bash

DB_NAME="cupping_room"
DB_USER="cupping_client"
DB_PASS="cupping123"
SQL_FILE="$(dirname "$0")/cupping_room.sql"

echo "Setting up The Cupping Room database..."

# create the database user (if it doesn't already exist)
psql -q postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
psql -q postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"

# create the database (if it doesn't already exist)
psql -q postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
psql -q postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# grant privileges
psql -q postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# check if tables already exist in the target database
TABLE_COUNT=$(psql -q -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")
if [ "$TABLE_COUNT" -eq 0 ]; then
    if [ -f "$SQL_FILE" ]; then
        # import the SQL dump
        PGPASSWORD=$DB_PASS psql -q -U "$DB_USER" -d "$DB_NAME" -f "$SQL_FILE"
    else
        # file not found
        echo "⚠️  $SQL_FILE not found. Skipping data import."
    fi
else
    echo "ℹ️  Database '$DB_NAME' already has tables. Skipping data import."
fi

echo "✅ Database setup complete!"
echo "You can now add this to your .env file:"
echo "DATABASE_URL=postgres://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
