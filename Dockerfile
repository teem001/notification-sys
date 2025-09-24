
FROM node:20-alpine AS builder

WORKDIR /src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build


FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
