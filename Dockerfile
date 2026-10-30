FROM node:24-alpine AS frontend-build

WORKDIR /build

COPY Frontend/package*.json ./
RUN npm ci

COPY Frontend/ ./
RUN npm run build


FROM node:24-alpine

WORKDIR /app/Backend

COPY Backend/package*.json ./
RUN npm ci --omit=dev

COPY Backend/ ./

COPY --from=frontend-build /build/dist /app/Frontend/dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "app.mjs"]