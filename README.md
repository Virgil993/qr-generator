# QR Code Generator

This is a QR Code Generator app built with Genezio and React. This app allows users to generate QR codes for their URLs as well as track their QR codes.

## Prerequisites

- ✅ [NodeJs](https://nodejs.org) >= 18.0.0
- ✅ [npm](https://www.npmjs.com/)
- ✅ [genezio](https://genezio.com/)

### Postgres

1. Host a Postgres Database. Follow this [tutorial](https://genezio.com/docs/features/databases) to get a free tier postgres database.
2. If you created a postgres database using the Genezio dashboard then you can obtain the connection URL by going to the [databases dashboard](https://app.genez.io/databases/) and clicking on the `connect` button associated with your database.
3. Create a `server/.env` file and add the following environment variables:

```env
POSTGRES_URL=<your-postgres-url>
```

## Run the app

### Clone the repository

```bash
git clone https://github.com/Virgil993/qr-generator.git

cd qr-generator

git checkout functions-solution
```

### Enable Tracking

This project is using `express` for the backend. Run the following command in the root of your project.

```
genezio deploy --env server/.env
```

This command will deploy your `express` app to the Genezio platform.
To get the backend URL for the `express` go the the [Genezio dashboard](https://app.genez.io/dashboard) and click on the project you just deployed. Copy the `function-qr-code-app` URL. To allow the frontend to use the backend, add the following environment variables in the `.env` file in the `client` directory:

```env
VITE_TRACKING_URL="<function-qr-code-app-url>/track"
VITE_SERVER_API_URL= "<function-qr-code-app-url>"
```

### Test the app

- Start the backend locally. In the `server` directory run

```
npm install
```

For windows:

```bash
$env:NODE_ENV="dev"; node app.mjs
```

For unix:

```bash
NODE_ENV=dev node app.mjs
```

- Start the frontend locally. Open another terminal. In the `client` directory in the `.env` file change the `VITE_SERVER_API_URL` variable to `http://localhost:8080`.
  Run the following commands in the `client` directory

```
npm install
npm run dev
```

Now both the server and the client are running locally and you can test your app before deploying.

### Deploy the app

```bash
genezio deploy
```
