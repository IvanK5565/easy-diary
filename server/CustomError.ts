export default class CustomError extends Error {
    // public message: string; // from super
    public layer: string;
    
    constructor(layer:string, m: string | undefined){
        super(m);
        this.layer = layer;
    }
}