#!/bin/sh



echo "⏳ Waiting for PostgreSQL to be ready..."

if [ -z "$POSTGRES_HOST" ] || [ -z "$POSTGRES_PORT" ]; then
  echo "❌ ERROR: POSTGRES_HOST or POSTGRES_PORT environment variables are not set!"
  exit 1
fi

set +e

while true; do
  # Пробуємо підключитися, перенаправляючи помилки в порожнечу
  nc -z -w3 "$POSTGRES_HOST" "$POSTGRES_PORT" > /dev/null 2>&1
  
  
  if [ $? -eq 0 ]; then
    break
  fi

  echo "⚠️ Database server ($POSTGRES_HOST:$POSTGRES_PORT) is unavailable - sleeping 1s"
  sleep 1
done

set -e

echo "✅ Database is up and responding!"

cp prisma.config.mts prisma.config.ts

echo "🚀 Applying database migrations via Prisma 8 Graph..."
# --yes autoconfirm migrations in Docker
npx prisma db update --yes

rm prisma.config.ts

echo "🔥 Starting NestJS Application with Graceful Shutdown..."
# exec makes Node.js process PID 1 for proper SIGTERM
exec node dist/main
