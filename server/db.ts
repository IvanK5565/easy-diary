import { Sequelize } from "sequelize";
import IServerContainer from "./di/IServerContainer";

function dbConnectionFactory({ config }: IServerContainer){
    const sequelize = new Sequelize(config.dbUrl);
    sequelize.sync();
    return sequelize;
}

export default dbConnectionFactory;
