#!/bin/bash

# Database setup script for DriveIt Rideshare platform

echo "🚗 Setting up DriveIt database..."

# PostgreSQL bin path
PSQL="/Library/PostgreSQL/18/bin/psql"

# Check if PostgreSQL is running
if ! pgrep -x "postgres" > /dev/null; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

echo "✓ PostgreSQL is running"

# Create database user and database
$PSQL -U postgres -c "CREATE USER driveit WITH PASSWORD 'driveit_pass';" 2>/dev/null || echo "User 'driveit' already exists"
$PSQL -U postgres -c "CREATE DATABASE driveit_db OWNER driveit;" 2>/dev/null || echo "Database 'driveit_db' already exists"
$PSQL -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE driveit_db TO driveit;" 2>/dev/null

echo "✓ Database user and database created"

# Run Prisma migrations
echo "Running Prisma migrations..."
cd server
npx prisma db push

# Seed the database
echo "Seeding database with demo data..."
npx prisma db seed

echo "✅ Database setup complete!"
echo ""
echo "Demo accounts available:"
echo "  • rahul@driveit.in (Booker/Lister) - password: password123"
echo "  • ananya@driveit.in (Booker) - password: password123"
echo "  • support@driveit.in (Support) - password: password123"
echo "  • admin@driveit.in (Admin) - password: password123"
