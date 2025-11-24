// CREATE TABLE IF NOT EXISTS public."studentClass"
// (
//     id integer NOT NULL DEFAULT nextval('"studentClass_id_seq"'::regclass),
//     "studentId" integer NOT NULL,
//     "classId" integer NOT NULL,
//     CONSTRAINT "studentClass_pkey" PRIMARY KEY (id),
//     CONSTRAINT "classByStudent" FOREIGN KEY ("classId")
//         REFERENCES public.classes (id) MATCH SIMPLE
//         ON UPDATE NO ACTION
//         ON DELETE NO ACTION,
//     CONSTRAINT "studentByClass" FOREIGN KEY ("studentId")
//         REFERENCES public.users (id) MATCH SIMPLE
//         ON UPDATE NO ACTION
//         ON DELETE NO ACTION
// )

import { DataTypes } from "sequelize";
import IServerContainer from "@/server/di/IServerContainer";
import BaseModel from "./BaseModel";

export class StudentClassModel extends BaseModel {
  declare id: number;
  declare classId: number;
  declare studentId: number;
}

export type StudentClassModelType = typeof StudentClassModel;

const StudentClassModelFactory = (ctx: IServerContainer) => {
  StudentClassModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "classId",
        references: {
          model: "ClassesModel",
          key: "id",
        },
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "studentId",
        references: {
          model: "UsersModel",
          key: "id",
        },
      },
    },
    {
      sequelize: ctx.db,
      modelName: "StudentClassModel",
      tableName: "studentClass",
      timestamps: false,
      underscored: true,
    },
  );
  return StudentClassModel;
};

export default StudentClassModelFactory;
