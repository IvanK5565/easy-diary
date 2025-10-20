import { asClass } from "awilix";
import UsersController from "./UsersController";
import ClassesController from "./ClassesController";
import SubjectsController from "./SubjectsController";
import ScheduleController from "./ScheduleController";
import HomeworksController from "./HomeworksController";
import MarksController from "./MarksController";
import MessagesController from "./MessagesController";

export interface IControllerContainer {
  UsersController: UsersController;
  ClassesController: ClassesController;
  SubjectsController: SubjectsController;
  ScheduleController: ScheduleController;
  HomeworksController: HomeworksController;
  MarksController: MarksController;
  MessagesController: MessagesController;
}

const controllers = {
  UsersController: asClass(UsersController).singleton(),
  ClassesController: asClass(ClassesController).singleton(),
  SubjectsController: asClass(SubjectsController).singleton(),
  ScheduleController: asClass(ScheduleController).singleton(),
  HomeworksController: asClass(HomeworksController).singleton(),
  MarksController: asClass(MarksController).singleton(),
  MessagesController: asClass(MessagesController).singleton(),
};

export default controllers;
