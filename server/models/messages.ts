// CREATE TABLE IF NOT EXISTS public.messages
// (
//     CONSTRAINT messages_pkey PRIMARY KEY (id),
//     CONSTRAINT "receiverOfMessage" FOREIGN KEY ("receiverId")
//         REFERENCES public.users (id) MATCH SIMPLE
//         ON UPDATE NO ACTION
//         ON DELETE NO ACTION,
//     CONSTRAINT "senderOfMessage" FOREIGN KEY ("senderId")
//         REFERENCES public.users (id) MATCH SIMPLE
//         ON UPDATE NO ACTION
//         ON DELETE NO ACTION
// )

import { Model, DataTypes } from 'sequelize';
import IServerContainer from '@/server/di/IServerContainer';

export class MessagesModel extends Model {
    declare id: number;
    declare senderId: number;
    declare receiverId: number;
    declare title: string;
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
                    key: 'id',
                },
            },
//     "receiverId" integer NOT NULL,
            receiverId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "UsersModel",
                    key: 'id',
                },
            },
//     title character varying(20) COLLATE pg_catalog."default",
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
//     body character varying(100) COLLATE pg_catalog."default",
            body: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize: ctx.db,
            modelName: 'MessagesModel',
            tableName: 'messages',
            timestamps: false,
            underscored: true,
        }
    );
    return MessagesModel;
}

export default MessagesModelFactory;