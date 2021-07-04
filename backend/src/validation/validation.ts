import Joi from 'joi';

export const validateSignUp = (obj: Record<string, any>) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .max(30)
      .error(() => new Error('max character is 30'))
      .min(1)
      .error(() => new Error('min character is 1'))
      .required()
      .error(() => new Error('first name is required')),
    lastName: Joi.string()
      .max(30)
      .error(() => new Error('max character is 30'))
      .min(1)
      .error(() => new Error('min character is 1'))
      .required()
      .error(() => new Error('first name is required')),
    username: Joi.string()
      .max(30)
      .error(() => new Error('max character is 30'))
      .min(1)
      .error(() => new Error('min character is 1'))
      .required()
      .error(() => new Error('first name is required')),
    email: Joi.string()
      .email()
      .error(() => new Error('Email is invalid'))
      .required()
      .error(() => new Error('email is required')),
    password: Joi.string()
      .min(6)
      .error(() => new Error('min character is 6'))
      .required()
      .error(() => new Error('password is required')),
    passwordConfirm: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .error(() => new Error('passwords do not match')),
  });

  return schema.validate(obj);
};

export const validateLogin = (obj: Record<string, any>) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .error(() => new Error('Email is invalid'))
      .error(() => new Error('email is required')),
      username: Joi.string(),
      password: Joi.string()
      .min(6)
      .error(() => new Error('min character is 6'))
      .required()
      .error(() => new Error('password is required')),
  });

  return schema.validate(obj);
};

export const validateUpdatePassword = (obj: Record<string, any>) => {
  // prevPassword
  const schema = Joi.object({
    prevPassword: Joi.string()
      .min(6)
      .error(() => new Error('min character is 6'))
      .required()
      .error(() => new Error('prevPassword is required')),
    newPassword: Joi.string()
      .min(6)
      .error(() => new Error('min character is 6'))
      .required()
      .error(() => new Error('newPassword is required')),
    newPasswordConfirm: Joi.string()
      .required()
      .valid(Joi.ref('newPassword'))
      .error(() => new Error('passwords do not match')),
  });

  return schema.validate(obj);
};

export const validateResetPassword = (obj: Record<string, any>) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(6)
      .error(() => new Error('min character is 6'))
      .required()
      .error(() => new Error('password is required')),
    passwordConfirm: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .error(() => new Error('passwords do not match')),
  });

  return schema.validate(obj);
};
