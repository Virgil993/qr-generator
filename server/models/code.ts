import { Model } from "sequelize";

export class CodeModel extends Model {
  codeId!: string;
  title!: string;
  ownerId!: string;
  codeText!: string;
  date!: Date;
}
