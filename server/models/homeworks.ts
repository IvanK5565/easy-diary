// CREATE TABLE IF NOT EXISTS public.homeworks
// (
//     CONSTRAINT homeworks_pkey PRIMARY KEY (id),
//     CONSTRAINT "scheduleOfHomework" FOREIGN KEY ("scheduleId")
//         REFERENCES public.schedule (id) MATCH SIMPLE
//         ON UPDATE NO ACTION
//         ON DELETE NO ACTION,
//     CONSTRAINT "teacherOfHomework" FOREIGN KEY ("teacherId")
//         REFERENCES public.users (id) MATCH SIMPLE
//         ON UPDATE NO ACTION
//         ON DELETE NO ACTION
// )

import { DataTypes } from "sequelize";
import IServerContainer from "@/server/di/IServerContainer";
import BaseModel from "./BaseModel";

export class HomeworksModel extends BaseModel {
  declare id: number;
  declare scheduleId: number;
  declare teacherId: number;
  declare title: string;
  declare describe: string;
}

export type HomeworksModelType = typeof HomeworksModel;

function HomeworksModelFactory(ctx: IServerContainer) {
  HomeworksModel.init(
    {
      //     id integer NOT NULL DEFAULT nextval('homeworks_id_seq'::regclass),
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      //     "scheduleId" integer NOT NULL,
      scheduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "scheduleId",
        references: {
          model: "ScheduleModel",
          key: "id",
        },
      },
      //     "teacherId" integer NOT NULL,
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "teacherId",
        references: {
          model: "UsersModel",
          key: "id",
        },
      },
      //     title character varying(100) COLLATE pg_catalog."default" NOT NULL,
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      //     describe character varying(100) COLLATE pg_catalog."default",
      describe: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: ctx.db,
      modelName: "HomeworksModel",
      tableName: "homeworks",
      timestamps: false,
      underscored: true,
    },
  );
  return HomeworksModel;
}

export default HomeworksModelFactory;
