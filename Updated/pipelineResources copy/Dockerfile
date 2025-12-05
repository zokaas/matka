ARG IMAGE=node:22-slim

FROM ${IMAGE} AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG APP_TO_BUILD
ENV APP_TO_BUILD=${APP_TO_BUILD}
RUN corepack enable

FROM base AS build
ARG APP_TO_BUILD
WORKDIR /usr/src/app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpx nx build kyc; \
    pnpm deploy --filter=${APP_TO_BUILD} /prod/app;

FROM base AS runner
ARG PORT=5000
ENV PORT=${PORT}
ARG CURRENT_ENV='development'
ENV CURRENT_ENV=${CURRENT_ENV}
ARG APP_ENV='development'
ENV APP_ENV=${APP_ENV}
WORKDIR /prod/app
COPY --from=build /prod/app .

CMD [ "pnpm", "start" ]

EXPOSE ${PORT}