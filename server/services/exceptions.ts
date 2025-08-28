import CustomError from "../CustomError";

const LAYER = "services"
enum CAUSES{
    INVALID = "Invalid data in model",
    NOT_FOUND = "Model not found",
}

class ModelValidationError extends CustomError{
    constructor(cause?: string) {
        super(LAYER, cause ?? CAUSES.INVALID);
    }
}

class ModelNotFoundError extends CustomError{
    constructor(cause?: string) {
        super(LAYER, cause ?? CAUSES.INVALID);
    }
}

class DestroyModelError extends CustomError{
    constructor(cause?: string) {
        super(LAYER, cause ?? CAUSES.NOT_FOUND);
    }
}

export {
    ModelValidationError,
    ModelNotFoundError,
    DestroyModelError,
}