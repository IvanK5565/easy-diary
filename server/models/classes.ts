import { DataTypes } from "sequelize";
import IServerContainer from "@/server/di/IServerContainer";
import BaseModel from "./BaseModel";

export interface IClass {
  id: number;
  teacherId: string;
  title: string;
  year: string;
}

export class ClassesModel extends BaseModel {
  declare id: number;
  declare title: string;
  declare year: number;
}

export type ClassesModelType = typeof ClassesModel;

const ClassesModelFactory = (ctx: IServerContainer) => {
  ClassesModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: ctx.db,
      modelName: "ClassesModel",
      tableName: "classes",
      timestamps: false,
      underscored: true,
    },
  );
  return ClassesModel;
};
export default ClassesModelFactory;
