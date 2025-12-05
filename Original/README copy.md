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

## Environment variables

client-side enviromental variables are prefixed with "PUBLIC\_"
you can change the prefix in vite.config.ts (update .env as well)

Use **PUBLIC_APP_ENV** instead of **MODE** in your app’s logic if you need environment-specific behavior.
You should only use **import.meta.env.MODE** when you need to differentiate between Vite’s predefined modes (development, production, test).

```javascript
import { getEnv, getPublicEnv } from "~/environment";
```

Example for accessing in client-side:
in a component:

```javascript
useEffect(() => {
    // Log import.meta.env to check the environment variables
    console.log("Client-side import.meta.env:", import.meta.env);
    const publicEnvVar = getPublicEnv(import.meta.env).PUBLIC_APP_ENV;
    console.log("public env", publicEnvVar);
}, []);
```

Example for accessing env variables in server-side:
in a loader():

```javascript
const envVariable = getEnv(process.env).ENV_VARIABLE_NAME;
```

