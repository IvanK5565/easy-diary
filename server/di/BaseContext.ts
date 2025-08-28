import IServerContainer from "./IServerContainer";

export default abstract class BaseContext {
    protected ctx: IServerContainer;

    constructor(ctx: IServerContainer){
        this.ctx = ctx;
    }
}