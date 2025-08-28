import { asFunction, AwilixContainer } from "awilix";
import type IServerContainer from "../di/IServerContainer";
import UsersModelFactory from "./users";
import ClassesModelFactory from "./classes";
import SubjectsModelFactory from "./subjects";
import HomeworksModelFactory from "./homeworks";
import MarksModelFactory from "./marks";
import MessagesModelFactory from "./messages";
import ScheduleModelFactory from "./schedule";
import StudentClassModelFactory from "./studentClass";

const models = {
    UsersModel: asFunction(UsersModelFactory).singleton(),
    ClassesModel: asFunction(ClassesModelFactory).singleton(),
    SubjectsModel: asFunction(SubjectsModelFactory).singleton(),
    HomeworksModel: asFunction(HomeworksModelFactory).singleton(),
    MarksModel: asFunction(MarksModelFactory).singleton(),
    MessagesModel: asFunction(MessagesModelFactory).singleton(),
    ScheduleModel: asFunction(ScheduleModelFactory).singleton(),
    StudentClassModel: asFunction(StudentClassModelFactory).singleton(),
};
export default models;

export function associateModels(container: AwilixContainer<IServerContainer>) {
    // Associations

    const Users = container.resolve('UsersModel');
    const Classes = container.resolve('ClassesModel');
    const Subjects = container.resolve('SubjectsModel');
    const StudentClass = container.resolve('StudentClassModel');
    const Messages = container.resolve('MessagesModel');
    const Schedule = container.resolve('ScheduleModel');
    const Marks = container.resolve('MarksModel');
    const Homeworks = container.resolve('HomeworksModel');

    // many to many - students in classses
    Users.belongsToMany(Classes, { through: StudentClass, foreignKey: 'studentId', as: 'studentClasses' });
    Classes.belongsToMany(Users, { through: StudentClass, foreignKey: 'classId', as: 'studentsInClass' });
    
    
    // one to many - teacher has classses
    // Users.hasMany(Classes, { foreignKey: 'teacherId', as: 'classes' }); // Assuming `teacherId` exists in Classes table
    // Classes.belongsTo(Users, { foreignKey: 'teacherId', as: 'teacher' });

    // one to many - user has sended messages
    Users.hasMany(Messages, { foreignKey: 'senderId', as: 'sendedMessages' });
    Messages.belongsTo(Users, { foreignKey: 'senderId', as: 'sender' });

    // one to many - user has received messages
    Users.hasMany(Messages, { foreignKey: 'receiverId', as: 'receivedMessages' });
    Messages.belongsTo(Users, { foreignKey: 'receiverId', as: 'receiver' });

    // one to many - subject has schedule
    Subjects.hasMany(Schedule, { foreignKey: 'subjectId', as: 'scheduleBySubject' });
    Schedule.belongsTo(Subjects, { foreignKey: 'subjectId', as: 'subjectInSchedule' });

    // one to many - class has schedule
    Classes.hasMany(Schedule, { foreignKey: 'classId', as: 'scheduleBySubject' });
    Schedule.belongsTo(Classes, { foreignKey: 'classId', as: 'classInSchedule' });

    // one to many - schedule has marks
    Schedule.hasMany(Marks, { foreignKey: 'scheduleId', as: 'marksBySchedule' });
    Marks.belongsTo(Schedule, { foreignKey: 'scheduleId', as: 'scheduleByMark' });
    
    // one to many - student has homeworks
    Users.hasMany(Marks, { foreignKey: 'studentId', as: 'marksByStudent' });
    Marks.belongsTo(Users, { foreignKey: 'studentId', as: 'studentsByMark' });

    // one to many - schedule has homeworks
    Schedule.hasMany(Homeworks, { foreignKey: 'scheduleId', as: 'homeworksBySchedule' });
    Homeworks.belongsTo(Schedule, { foreignKey: 'scheduleId', as: 'scheduleByHomework' });
    
    // one to many - teacher has homeworks
    Users.hasMany(Homeworks, { foreignKey: 'teacherId', as: 'homeworksByTeacher' });
    Homeworks.belongsTo(Users, { foreignKey: 'teacherId', as: 'teacherByHomework' });
}