// server/models/user.ts
import { Model } from "sequelize";

export class UserModel extends Model {
  declare id: string;
  name!: string;
  email!: string;
  password!: string;
}
