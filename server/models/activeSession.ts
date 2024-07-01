// server/models/activeSession.ts
import { Model } from "sequelize";

export class ActiveSessionModel extends Model {
  declare id: string;
  token!: string;
  userId!: string;
  date!: Date;
}
