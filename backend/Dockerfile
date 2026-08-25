### --- STAGE 1: Build ---

FROM node:20-alpine AS builder
WORKDIR /app

### Copy dependency files and Prisma schema

COPY package*.json ./
COPY prisma ./prisma/

### Install all dependencies

RUN npm ci

### Copy whole backend code

COPY . .

### Generate Prisma Client and build NestJS to production-code (folder dist)

RUN npx prisma generate
RUN npm run build

### --- STAGE 2: Run ---

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

### Copy only manifest files

COPY package*.json ./

### Install ONLY production dependencies (without trash for development)

RUN npm ci --only=production

### Copy generated Prisma Client from stage 1

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

### Copy built NestJS code and Prisma migrations 

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# push db if not exist
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 5000
CMD ["./entrypoint.sh"]