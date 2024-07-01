// server/models/code.ts
import { Model } from "sequelize";

export class CodeModel extends Model {
  declare id: string;
  title!: string;
  ownerId!: string;
  url!: string;
  date!: Date;
}
