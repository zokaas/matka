# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/future/vite) for details on supported features.

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

-   `build/server`
-   `build/client`

## Port: 4874

## Development environment

https://kyc.858251697328.aws.opr-finance.com/

## Production environment

https://kyc.039067103537.aws.opr-finance.com/

https://kyc.opr-finance.com/

## Test in isolation

Set testMode: 1 in the configuration for the environment where the app will be tested.

Start FL application in opr.se (production) / localhost / test

Send application

Get from local storage applicationUuid,
id (session id)

Get applicationId: https://production-public-api2.opr-finance.com/api/b2b/se/v1/front-page/application/{applicationUuid}

Paste to the url:
localhost: localhost:5001?appid={applicationId}&uuid={applicationUuid}&id={id}
test: https://kyc.858251697328.aws.opr-finance.com?appid={applicationId}&uuid={applicationUuid}&id={id}
production https://kyc.opr-finance.com?appid={applicationId}&uuid={applicationUuid}&id={id}
