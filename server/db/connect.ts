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
export function initTables(db: Sequelize) {
  CodeModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: DataTypes.STRING(512),
      ownerId: DataTypes.STRING(512),
      url: DataTypes.STRING(1024),
      date: DataTypes.DATE,
    },

    {
      sequelize: db,

      modelName: "CodeModel",
      tableName: "codes",
    }
  );

  ActiveSessionModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      token: DataTypes.STRING(512),
      userId: DataTypes.STRING(512),
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize: db,
      modelName: "ActiveSessionModel",
      tableName: "active_sessions",
    }
  );

  UserModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING(512),
      email: DataTypes.STRING(512),
      password: DataTypes.STRING(512),
    },
    {
      sequelize: db,
      modelName: "UserModel",
      tableName: "users",
    }
  );
}

// This function synchronizes the database
export async function syncDb(db: Sequelize) {
  await db.sync();
}
