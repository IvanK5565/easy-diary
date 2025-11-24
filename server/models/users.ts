import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import IServerContainer from "../di/IServerContainer";
import { UserRole } from "@/constants";
import BaseModel from "./BaseModel";

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: UserRole;
}

export class UsersModel extends BaseModel {
  declare id: number;
  declare firstname: string;
  declare lastname: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;

  public verifyPassword(plainPassword: string) {
    return bcrypt.compare(plainPassword, this.password);
  }
}

export type UsersModelType = typeof UsersModel;

const UsersModelFactory = (ctx: IServerContainer) => {
  UsersModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "id",
      },
      firstname: {
        type: DataTypes.STRING,
        field: "firstname",
      },
      lastname: {
        type: DataTypes.STRING,
        field: "lastname",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true, // Validates email format
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [4, 100],
            msg: "Password must be at least 4 characters.",
          },
        },
      },
      role: {
        type: DataTypes.ENUM,
        values: Object.values(UserRole),
        allowNull: false,
        validate: {
          isIn: {
            args: [Object.values(UserRole)],
            msg: `No role. Valid roles: ${Object.values(UserRole)}`,
          },
        },
      },
    },
    {
      sequelize: ctx.db,
      modelName: "UsersModel",
      tableName: "users",
      timestamps: false,
      underscored: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    },
  );
  return UsersModel;
};

export default UsersModelFactory;
