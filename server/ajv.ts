import Ajv from "ajv";
import IContextContainer from "@/server/di/IServerContainer";
import addFormats from 'ajv-formats'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getAjv(context: IContextContainer){
  const ajv = new Ajv({ coerceTypes: true });
  addFormats(ajv);
  return ajv;
}