import { DataTypes } from "sequelize";
import IServerContainer from "@/server/di/IServerContainer";
import BaseModel from "./BaseModel";

export class ScheduleModel extends BaseModel {
  declare id: number;
  declare classId: number;
  declare subjectId: number;
  declare day: number;
  declare queue: number;
  declare title: string;
}

export type ScheduleModelType = typeof ScheduleModel;

function ScheduleModelFactory(ctx: IServerContainer) {
  ScheduleModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SubjectsModel",
          key: "id",
        },
        field: "subjectId",
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ClassesModel",
          key: "id",
        },
        field: "classId",
      },
      day: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      queue: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: ctx.db,
      modelName: "ScheduleModel",
      tableName: "schedule",
      timestamps: false,
      underscored: true,
    },
  );
  return ScheduleModel;
}

export default ScheduleModelFactory;
