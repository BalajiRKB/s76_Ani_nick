FROM node:20-alpine
WORKDIR /app

RUN addgroup -S aninick && adduser -S aninick -G aninick

COPY package.json ./

# All packages in package.json are pinned to exact versions (no ^ or ~)
# so bare npm install satisfies Silver's pinned-package rule
RUN npm install --omit=dev

COPY . .

RUN rm -rf tests

USER aninick

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/nicknames || exit 1

CMD ["node", "server.js"]
