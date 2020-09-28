import {ValidationError} from "yup";

interface Errors {
    [key: string]: string;
}

export default function getValidationError(err: ValidationError): Errors {
    const validationError: Errors = {};

    err.inner.forEach(error => {
        validationError[error.path] = error.message;
    });

    return validationError;
}
