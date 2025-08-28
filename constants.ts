export enum UserRole {
    Student = 'student',
    Teacher = 'teacher',
    Admin = 'admin',
}

export enum MarkType {
  HW = "hw",
  IN_CLASS = "in-class",
  TEST = "test",
}

export enum ClassStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export const DEFAULT_PER_PAGE = 10;

export const DAYS = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export const SUNDAY = 6;

export const SALT_ROUNDS = 10

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * DAY;
export const YEAR = DAY * 365;
export const LAEPYEAR = YEAR + 1;

export const DEFAULT_LIMIT = 1000;
export const DEFAULT_PAGE = 1;

export const decimalPattern = "^\\d+$";