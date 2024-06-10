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
```

### Postgres

1. Host a Postgres Database. Follow this [tutorial](https://genezio.com/docs/features/databases) to get a free tier postgres database.
2. If you created a postgres database using the Genezio dashboard then you can obtain the connection URL by going to the [databases dashboard](https://app.genez.io/databases/) and clicking on the `connect` button associated with your database.
3. Create a `server/.env` file and add the following environment variables:

```env
POSTGRES_URL=<your-postgres-url>
```

### Enable Authentification

This project uses the authentification service provided by Genezio. To enable it on this project run this command in the root of the project.

```
genezio deploy --env server/.env
```

After you succesfully ran the command, you can go in the [Genezio dashboard](https://app.genez.io/dashboard) and click on the project you just deployed.

Click on the authentification button and choose PostgreSQL. Now you can select to create a new Postgres database or use an existing one, click enable and now you should have a postgres database up and running as well as your authentification service ready to be used.

After you create your database, you should be able to see the two providers:

- Email
- Google

Click on the edit button next to the Email provider and enable it. And that's it, the Email Auth service is now enabled on this project.

Follow this tutorial[https://genezio.com/docs/tutorials/create-react-app-genezio-google-oauth/] to learn how to enable the Google OAUTH provider.

After aquiring the `Google ID` and the `Google Secret` of your application, click on the edit button next to the Google provider and enable it.

To use the Auth Service in your frontend, go to the `.env` file in the `client` directory and add the following environment variables:

```env
VITE_AUTH_TOKEN = "<token>"
VITE_AUTH_REGION="<region>"
VITE_GOOGLE_CLIENT_ID="<client_id>"
```

Both the token and the region can be found in the [Genezio dashboard](https://app.genez.io/dashboard) under the authentification service on the project you just deployed.

### Enable Tracking

This app allows you to track the number of times a QR code is scanned. To enable tracking in the frontend, go the the [Genezio dashboard](https://app.genez.io/dashboard) and click on the project you just deployed. Go to test interface and click on the `trackCode` function to view the webhook url. Then, simply copy the url and add it to the `.env` file in the `client` directory.

```env
VITE_TRACKING_URL = "<webhook-url>"
```

### Test the app

To test the app locally you can run the following command:

```
genezio local
```

This command will start both the backend and the frontend and you should be able to test the features of your app before deploying to production.

### Deploy the app

```bash
genezio deploy
```
