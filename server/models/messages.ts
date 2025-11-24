import { DataTypes } from "sequelize";
import IServerContainer from "@/server/di/IServerContainer";
import BaseModel from "./BaseModel";

export class MessagesModel extends BaseModel {
  declare id: number;
  declare senderId: number;
  declare receiverId: number;
  declare body: string;
}

export type MessagesModelType = typeof MessagesModel;

function MessagesModelFactory(ctx: IServerContainer) {
  MessagesModel.init(
    {
      //     id integer NOT NULL DEFAULT nextval('messages_id_seq'::regclass),
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      //     "senderId" integer NOT NULL,
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "UsersModel",
          key: "id",
        },
        field: "senderId",
      },
      //     "receiverId" integer NOT NULL,
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "UsersModel",
          key: "id",
        },
        field: "receiverId",
      },
      //     body character varying(100) COLLATE pg_catalog."default",
      body: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: ctx.db,
      modelName: "MessagesModel",
      tableName: "messages",
      timestamps: false,
      underscored: true,
    },
  );
  return MessagesModel;
}

export default MessagesModelFactory;
