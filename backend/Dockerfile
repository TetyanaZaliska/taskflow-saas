### --- STAGE 1: Build ---

FROM node:25-alpine AS builder
WORKDIR /app

### Copy dependency files 

COPY package*.json ./

### Install all dependencies

RUN npm ci

#Copy Prisma schema

COPY src/prisma ./src/prisma
COPY prisma.config.mts ./ 
RUN cp prisma.config.mts prisma.config.ts
RUN npx prisma contract emit
RUN rm prisma.config.ts

### Copy whole backend code

COPY . .

### Generate Prisma Client and build NestJS to production-code (folder dist)

RUN npm run build

### --- STAGE 2: Run ---

FROM node:25-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

### Copy only manifest files

COPY package*.json ./

### Install ONLY production dependencies (without trash for development)

RUN npm ci --omit=dev

### Copy built NestJS code and Prisma 

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./src/prisma
COPY --from=builder /app/prisma.config.mts ./prisma.config.mts

COPY --from=builder /app/node_modules/@prisma/orm-postgres ./node_modules/@prisma/orm-postgres

# push db if not exist
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 5000
CMD ["./entrypoint.sh"]