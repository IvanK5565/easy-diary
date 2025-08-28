export interface IEntitiesDto<T> {
    items: T | T[];
    count?: number;
}