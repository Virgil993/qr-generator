import express from "express";
import dotenv from "dotenv";
import serverless from "serverless-http";
import { connectDb, initTables } from "./db/connect.mjs";

import authRoutes from "./routes/authRoutes.mjs";
import codeRoutes from "./routes/codeRoutes.mjs";
import trackRoutes from "./routes/trackRoutes.mjs";

dotenv.config();

const app = express();
const port = 8088;

// Database connection
const db = connectDb();
initTables(db);

// This function should be run only once to create the tables
// It should not be run in production as it has a chance to modify the database
// syncDb(db);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/codes", codeRoutes);
app.use("/track", trackRoutes);

// Define your routes here

if (process.env.NODE_ENV === "dev") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export const handler = serverless(app);
