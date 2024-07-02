import express from "express";
import dotenv from "dotenv";
import serverless from "serverless-http";
import cors from "cors";
import { connectDb, initTables, syncDb } from "./db/connect";

import authRoutes from "./routes/authRoutes";
import codeRoutes from "./routes/codeRoutes";

dotenv.config();

const app = express();
const port = 8080;

// Database connection
const db = connectDb();
initTables(db);

// This function should be run only once to create the tables
// It should not be run in production as it has a chance to modify the database
syncDb(db);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/codes", codeRoutes);

// You don't need to listen to the port when using serverless functions in production
if (process.env.NODE_ENV === "dev") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export const handler = serverless(app);
