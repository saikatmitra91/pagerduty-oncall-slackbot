FROM node:14-alpine as base

FROM base as build
ENV NODE_ENV=production
WORKDIR /app
COPY package.json yarn.*lock .
RUN yarn install

COPY . .
RUN yarn build


FROM base as prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json .
COPY --from=build /app/.env .

CMD ["yarn", "start"]