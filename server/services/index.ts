import { asClass, NameAndRegistrationPair } from "awilix";
import UsersService from "./UsersService";
import ClassesService from "./ClassesService";
import ScheduleService from "./ScheduleService";
import SubjectsService from "./SubjectsService";
import HomeworksService from "./HomeworksService";
import MarksService from "./MarksService";

export interface IServicesContainer {
  UsersService: UsersService;
  ClassesService: ClassesService;
  ScheduleService: ScheduleService;
  SubjectsService: SubjectsService;
  HomeworksService: HomeworksService;
  MarksService: MarksService;
}

const services: NameAndRegistrationPair<IServicesContainer> = {
    UsersService: asClass(UsersService).singleton(),
    ClassesService: asClass(ClassesService).singleton(),
    ScheduleService: asClass(ScheduleService).singleton(),
    SubjectsService: asClass(SubjectsService).singleton(),
    HomeworksService: asClass(HomeworksService).singleton(),
    MarksService: asClass(MarksService).singleton(),
}

export default services;