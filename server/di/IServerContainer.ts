import type { IRoles, IRules } from "@/acl/types";
import type { Sequelize } from "sequelize";
import type IModelsContainer from "../models/types";
import type { IServicesContainer } from "../services";
import type { AuthOptions } from "next-auth";
import type { IControllerContainer } from "../controllers";
import type { Mutex } from "../Mutex";
import type Ajv from "ajv";
import type { GSSPFactory } from "@/types";

export default interface IServerContainer
  extends IModelsContainer,
    IServicesContainer,
    IControllerContainer {
  config: {
    dev: boolean;
    baseUrl?: string;
    apiUrl?: string;
    dbUrl: string;
  };
  db: Sequelize;
  roles: IRoles;
  rules: IRules;
  authOptions: AuthOptions;
  mutex: Mutex;
  ajv: Ajv;
  getServerSideProps: GSSPFactory;
}
