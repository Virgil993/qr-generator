# QR Code Generator

This is a QR Code Generator app built with Genezio and React. This app allows users to generate QR codes for their URLs as well as track their QR codes.

## Prerequisites

- ✅ [NodeJs](https://nodejs.org) >= 18.0.0
- ✅ [npm](https://www.npmjs.com/)
- ✅ [genezio](https://genezio.com/)

## Run the app

### Clone the repository

```bash
git clone https://github.com/Virgil993/qr-generator.git

cd qr-generator

git checkout base-solution
```

### Postgres

1. Host a Postgres Database. Follow this [tutorial](https://genezio.com/docs/features/databases) to get a free tier postgres database.
2. If you created a postgres database using the Genezio dashboard then you can obtain the connection URL by going to the [databases dashboard](https://app.genez.io/databases/) and clicking on the `connect` button associated with your database.
3. Create a `server/.env` file and add the following environment variables:

```env
POSTGRES_URL=<your-postgres-url>
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

### Deploy the backend

```bash
genezio deploy --backend --env server/.env
```

### Deploy the frontend

Using the Function URL provided in the terminal after your backend deployment, modify the `client/.env` file with the appropiate URL

```env
VITE_SERVER_API_URL= "https://<uuid>.<region>.cloud.genez.io"
```

Next deploy the frontend with the following command

```bash
genezio deploy --frontend
```
