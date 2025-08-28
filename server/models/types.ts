import type { Model } from "sequelize";
import type { ScheduleModel } from "./schedule";
import type { ClassesModel } from "./classes";
import type { HomeworksModel } from "./homeworks";
import type { MarksModel } from "./marks";
import type { MessagesModel } from "./messages";
import type { StudentClassModel } from "./studentClass";
import type { SubjectsModel } from "./subjects";
import type { UsersModel } from "./users";
import type { ClassesModelType } from "./classes";
import type { HomeworksModelType } from "./homeworks";
import type { MarksModelType } from "./marks";
import type { MessagesModelType } from "./messages";
import type { ScheduleModelType } from "./schedule";
import type { StudentClassModelType } from "./studentClass";
import type { SubjectsModelType } from "./subjects";
import type { UsersModelType } from "./users";

export default interface IModelsContainer {
  UsersModel: UsersModelType;
  ClassesModel: ClassesModelType;
  SubjectsModel: SubjectsModelType;
  HomeworksModel: HomeworksModelType;
  MarksModel: MarksModelType;
  MessagesModel: MessagesModelType;
  ScheduleModel: ScheduleModelType;
  StudentClassModel: StudentClassModelType;
}

export type RawModel<M extends Model> = Omit<M, keyof Model>;

export type ISchedule = Omit<ScheduleModel, keyof Model>;
export type IClass = Omit<ClassesModel, keyof Model>;
export type IHomework = Omit<HomeworksModel, keyof Model>;
export type IMark = Omit<MarksModel, keyof Model>;
export type IMessage = Omit<MessagesModel, keyof Model>;
export type IStudentClass = Omit<StudentClassModel, keyof Model>;
export type ISubject = Omit<SubjectsModel, keyof Model>;
export type IUser = Omit<UsersModel, keyof Model | 'verifyPassword'>;
