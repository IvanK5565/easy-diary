// CREATE TABLE IF NOT EXISTS public.marks
// (
//     CONSTRAINT marks_pkey PRIMARY KEY (id),
//     CONSTRAINT "scheduleInMark" FOREIGN KEY ("scheduleId")
//         REFERENCES public.schedule (id) MATCH SIMPLE
//         ON UPDATE NO ACTION
//         ON DELETE NO ACTION
// )

import { DataTypes } from "sequelize";
import IServerContainer from "@/server/di/IServerContainer";
import { MarkType } from "@/constants";
import BaseModel from "./BaseModel";

export class MarksModel extends BaseModel {
  declare id: number;
  declare scheduleId: number;
  declare studentId: number;
  declare value: number;
  declare type: MarkType;
}
const MarksTypeValues = Object.values(MarkType);

export type MarksModelType = typeof MarksModel;

function MarksModelFactory(ctx: IServerContainer) {
  MarksModel.init(
    {
      //     id integer NOT NULL DEFAULT nextval('marks_id_seq'::regclass),
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
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "studentId",
        references: {
          model: "UsersModel",
          key: "id",
        },
      },
      //     value integer NOT NULL,
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      //     type "markType" NOT NULL,
      type: {
        type: DataTypes.ENUM,
        values: MarksTypeValues,
        allowNull: false,
        validate: {
          isIn: {
            args: [MarksTypeValues],
            msg: `No role. Valid roles: ${MarksTypeValues}`,
          },
        },
      },
    },
    {
      sequelize: ctx.db,
      modelName: "MarksModel",
      tableName: "marks",
      timestamps: false,
      underscored: true,
    },
  );
  return MarksModel;
}

export default MarksModelFactory;
