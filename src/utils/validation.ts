import { validate, ValidationError } from "class-validator";

const formatValidationErrors = (
  errors: ValidationError[],
): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};

  for (const error of errors) {
    if (error.children && error.children.length > 0) {
      const nestedErrors = formatValidationErrors(error.children);
      for (const key in nestedErrors) {
        formattedErrors[`${error.property}.${key}`] = nestedErrors[key];
      }
    } else if (error.constraints) {
      // Take only the first error message instead of joining all
      const firstError = Object.values(error.constraints)[0];
      formattedErrors[error.property] = firstError;
    }
  }

  return formattedErrors;
};

export async function validateDTO(dto: object) {
  const errors = await validate(dto, {
    forbidNonWhitelisted: true,
    skipMissingProperties: false,
    skipNullProperties: false,
    skipUndefinedProperties: false,
    stopAtFirstError: true,
    whitelist: true,
  });
  return formatValidationErrors(errors);
}
