/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from "sequelize";

export function setOpFields(
  source: Record<string, string>,
  fields: string[],
  op: keyof typeof Op,
) {
  const dest: Record<string, any> = {};
  fields
    .filter((f) => f in source)
    .forEach((f) => {
      dest[f] = {
        [Op[op]]: source[f],
      };
    });
  return dest;
}

export function setManyOpFields(
  source: Record<string, string | number>,
  ...issues: [fields: string | string[], op: keyof typeof Op][]
) {
  const dest: Record<string, any> = {};
  issues.forEach(([fields, op]) => {
    (Array.isArray(fields) ? fields : [fields])
      .filter((f) => f in source)
      .forEach((f) => {
        dest[f] = {
          [Op[op]]: source[f],
        };
      });
  });

  return dest;
}
