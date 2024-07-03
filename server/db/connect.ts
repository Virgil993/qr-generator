import { DataTypes, Sequelize } from "sequelize";
import pg from "pg";
import { CodeModel } from "../models/code";
import { ActiveSessionModel } from "../models/activeSession";
import { UserModel } from "../models/user";

// This function creates a new Sequelize instance and returns it
export function connectDb() {
  const sequelize = new Sequelize(process.env.POSTGRES_URL || "", {
    dialect: "postgres",
    dialectModule: pg,
    define: {
      timestamps: false, // This disables the created_at and updated_at columns
    },
    dialectOptions: {
      ssl: {
        require: true, // Use SSL with the 'require' option
      },
    },
  });
  return sequelize;
}

// This function initializes the tables in the database
// TODO 1: Implement the initTables function and initialize the models
export function initTables(db: Sequelize) {}

// This function synchronizes the database
export async function syncDb(db: Sequelize) {
  await db.sync();
}
