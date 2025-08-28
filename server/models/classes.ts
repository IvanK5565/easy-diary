import { Model, DataTypes } from 'sequelize';
import IServerContainer from '@/server/di/IServerContainer';

export interface IClass{
    id: number;
    teacherId: string;
    title: string;
    year: string;
}

export class ClassesModel extends Model {
  declare id: number;
  // declare teacherId: number;
  declare title: string;
  declare year: number;
}
// const ClassStatusValues = Object.values(ClassStatus);

export type ClassesModelType = typeof ClassesModel;

const ClassesModelFactory = (ctx: IServerContainer) => {

  ClassesModel.init(
    {
//     id integer NOT NULL DEFAULT nextval('classes_id_seq'::regclass),
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // teacherId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Users',
      //     key: 'id',
      //   },
      //   field: 'teacherId'
      // },
//     title character varying(20)[] COLLATE pg_catalog."default" NOT NULL,
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
//     year integer NOT NULL,
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // status: {
      //   type: DataTypes.ENUM,
      //   values: ClassStatusValues,
      //   allowNull: false,
      //   validate: {
      //     isIn: [ClassStatusValues],
      //   },
      // },
    },
    {
      sequelize: ctx.db,
      modelName: 'ClassesModel',
      tableName: 'classes',
      timestamps: false,
      underscored: true,
    });
  return ClassesModel;
}
export default ClassesModelFactory;