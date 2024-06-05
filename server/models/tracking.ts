import { Model } from "sequelize";

export class TrackingModel extends Model {
  codeId!: string;
  date!: Date;
}
