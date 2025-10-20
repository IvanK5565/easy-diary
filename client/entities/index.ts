import { asClass } from "awilix";
import ClassEntity from "./ClassEntity";
import SubjectEntity from "./SubjectEntity";
import UserEntity from "./UserEntity";
import ScheduleEntity from "./ScheduleEntity";
import HomeworkEntity from "./HomeworkEntity";
import MarkEntity from "./MarkEntity";
import MessageEntity from "./MessageEntity";

export interface IEntityContainer{
  UserEntity: UserEntity,
  ClassEntity: ClassEntity,
  SubjectEntity: SubjectEntity,
  ScheduleEntity: ScheduleEntity,
  HomeworkEntity: HomeworkEntity,
  MarkEntity: MarkEntity,
  MessageEntity: MessageEntity,
}

const entities = {
  UserEntity: asClass(UserEntity).singleton(),
  ClassEntity: asClass(ClassEntity).singleton(),
  SubjectEntity: asClass(SubjectEntity).singleton(),
  ScheduleEntity: asClass(ScheduleEntity).singleton(),
  HomeworkEntity: asClass(HomeworkEntity).singleton(),
  MarkEntity: asClass(MarkEntity).singleton(),
  MessageEntity: asClass(MessageEntity).singleton(),
}


export { entities };