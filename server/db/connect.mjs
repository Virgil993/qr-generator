import { DataTypes, Sequelize } from "sequelize";
import pg from "pg";
import { CodeModel } from "../models/code.mjs";
import { TrackingModel } from "../models/tracking.mjs";
import { ActiveSessionModel } from "../models/activeSession.mjs";
import { UserModel } from "../models/user.mjs";

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

export function initTables(db) {
  CodeModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: DataTypes.STRING(512),
      ownerId: DataTypes.STRING(512),
      codeText: DataTypes.STRING(1024),
      date: DataTypes.DATE,
    },

    {
      sequelize: db,

      modelName: "CodeModel",
      tableName: "codes",
    }
  );

  TrackingModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      codeId: DataTypes.STRING(512),
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize: db,
      modelName: "TrackingModel",
      tableName: "tracking",
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

export async function syncDb(db) {
  await db.sync();
}
