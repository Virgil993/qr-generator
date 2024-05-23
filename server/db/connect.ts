import { DataTypes, Sequelize } from "sequelize";
import pg from "pg";
import { CodeModel } from "../models/code";
import { TrackingModel } from "../models/tracking";

export function connectDb(): Sequelize {
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

export function initTables(db: Sequelize) {
  CodeModel.init(
    {
      codeId: {
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
      sourceIp: DataTypes.STRING(512),
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
}

export async function syncDb(db: Sequelize) {
  await db.sync();
}
