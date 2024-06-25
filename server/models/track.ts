import { Model } from "sequelize";

export class TrackModel extends Model {
  declare id: string;
  codeId!: string;
  date!: Date;
}
