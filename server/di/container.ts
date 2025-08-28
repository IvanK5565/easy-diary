import config from "@/config";
import { asClass, asFunction, asValue, createContainer } from "awilix";
import dbConnectionFactory from "../db";
import { roles, rules } from "@/acl/config.acl";
import IServerContainer from "./IServerContainer";
import models, { associateModels } from "../models";
import services from "../services";
import { authOptionsFactory } from "../authOptions";
import { Mutex } from "../Mutex";
import { getAjv } from "../ajv";
import controllers from "../controllers";
import getServerSidePropsContainer from "../controllers/getServerSideProps";

const container = createContainer<IServerContainer>({
    injectionMode: 'PROXY',
})

container.register({
    ...models,
    ...services,
    ...controllers,
    config: asValue(config),
    db: asFunction(dbConnectionFactory).singleton(),
    roles: asValue(roles),
    rules: asValue(rules),
    authOptions: asFunction(authOptionsFactory).singleton(),
    mutex: asClass(Mutex).singleton(),
    ajv: asFunction(getAjv).singleton(),
    getServerSideProps: asFunction(getServerSidePropsContainer).singleton(),
})

associateModels(container);

// container.resolve('UsersController');

export default container;