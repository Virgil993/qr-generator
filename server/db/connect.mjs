import { DataTypes, Sequelize } from "sequelize";
import pg from "pg";
import { CodeModel } from "../models/code.mjs";
import { TrackModel } from "../build/models/track.js";

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
      url: DataTypes.STRING(1024),
      date: DataTypes.DATE,
    },

    {
      sequelize: db,

      modelName: "CodeModel",
      tableName: "codes",
    }
  );

  TrackModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      codeId: {
        type: DataTypes.STRING(1024),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },

    {
      sequelize: db,

      modelName: "TrackModel",
      tableName: "track",
    }
  );
}

export async function syncDb(db) {
  await db.sync();
}
