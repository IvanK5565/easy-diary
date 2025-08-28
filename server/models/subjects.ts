// CREATE TABLE IF NOT EXISTS public.subjects
// (
//     id integer NOT NULL DEFAULT nextval('subjects_id_seq'::regclass),
//     title character varying(20) COLLATE pg_catalog."default" NOT NULL,
//     "description" character varying(100) COLLATE pg_catalog."default",
//     "group" character varying(20) COLLATE pg_catalog."default",
//     CONSTRAINT subjects_pkey PRIMARY KEY (id)
// )

import { Model, DataTypes } from "sequelize";
import IServerContainer from "@/server/di/IServerContainer";

export interface ISubject {
  id?: number;
  title: string;
  description: string;
  group: string;
}

export class SubjectsModel extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare group: string;
}

export type SubjectsModelType = typeof SubjectsModel;

function SubjectsModelFactory(ctx: IServerContainer) {
  SubjectsModel.init(
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
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      group: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: ctx.db,
      modelName: "SubjectsModel",
      tableName: "subjects",
      timestamps: false,
      underscored: true,
    },
  );
  return SubjectsModel;
}

export default SubjectsModelFactory;
