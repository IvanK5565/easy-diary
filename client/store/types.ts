import { UserRole, ClassStatus, MarkType } from "@/constants";
import { GRANT } from "@/acl/types";

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: UserRole;
}
export interface ISubject {
  id: number;
  title: string;
  description?: string;
  group?: string;
}
export interface IClass {
  id: number;
  title: string;
  year: number;
  status: ClassStatus;
  studentsInClass?: number[];
}
export interface ISchedule {
  id: number;
  classId: number;
  day: number;
  queue: number;
  title: string;
  subjectId: number;

  marks: number[];
  homeworks: number[];
}
export interface IHomework {
  id: number;
  teacherId: number;
  scheduleId: number;
  title: string;
  description: string;
}
export interface IMark {
  id: number;
  scheduleId: number;
  value: number;
  type: MarkType;
}
export interface IMessage {
  id: number;
  senderId: number;
  receiverId: number;
  body: string;
}
/** Normalizeed */
export type Entities = {
  users: Record<number, IUser>;
  classes: Record<number, IClass>;
  subjects: Record<number, ISubject>;
  schedule: Record<number, ISchedule>;
  homeworks: Record<number, IHomework>;
  marks: Record<number, IMark>;
  messages: Record<number, IMessage>;
};
export type EntitiesState = {
  entities: Entities;
};

export type EntitiesAction = {
  // type: "ADD"|"DELETE"|'DELETE_ALL';
  type: string;
  payload?: Partial<Entities>;
};

/******** */

/******* Experiment ********/

type TEntity<T> = {
  count?: number;
  [id: number]: T;
};

export type _Entities = {
  users: TEntity<IUser>;
  classes: TEntity<IClass>;
  subjects: TEntity<ISubject>;
};

export interface ISortParams {
  field: string;
  dir: Sort;
}
export interface IFilterParams {
  [field: string]: string;
}

export interface IPagerParams {
  pageName: string;
  sort?: ISortParams;
  filter?: IFilterParams; //object;    // object with filtering key/values
  page: number; // page number
  perPage: number; // count items on one page
  force?: boolean; // reload data in the redux and pager
  count?: number; // count by filter, if 0 need to recalculate, if > 0 count doesn't need to calculate
  entityName?: string;
}

export enum Sort {
  ASC = 1,
  DESC = -1,
  none = 0,
}

export interface IOptions {
  label: string;
  value: string | number | boolean;
  group?: string;
}

export interface TPaginationInfo {
  [key: string]: IPaginationInfo;
}

// In-redux entity
export interface IPaginationInfo {
  entityName: string;
  pageName: string;
  currentPage: number;
  count: number;
  perPage: number;
  filter?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  sort?: ISortParams;
  pages?: {
    [key: number]: [number];
  };
  touched?: number[];
  fetching?: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IMenuData {
  icon?: any; //ReactIcon
  label: string;
  component?: any;
  url?: string;
  hide?: boolean;
  resources?: string[];
  items?: IMenu;
  grant?: GRANT;
  data?: any; // save any data within menu item
  route?: string;
  order?: number;
  handler?: any;
  onClick?: () => void;
  group?: string;
}

export interface IMenu {
  [key: string]: IMenuData;
}
