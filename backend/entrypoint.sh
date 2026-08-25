#!/bin/sh

# 1. Wait for 3 seconds, to PostgreSQL get up in memory
sleep 3

echo "🚀 Running automatic database migrations..."
npx prisma db push

echo "🔥 Starting NestJS Application..."
node dist/main
