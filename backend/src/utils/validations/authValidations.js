const validator = require("validator");

const validateSignUpData = (firstname, lastname, email, password) => {
  if (!firstname || !lastname || !email || !password) {
    return { isValid: false, message: "All fields are required" };
  }

  if (firstname.length < 2 || firstname.length > 22) {
    return {
      isValid: false,
      message: "First name must be between 2 and 22 characters",
    };
  }
  if (lastname.length < 2 || lastname.length > 22) {
    return {
      isValid: false,
      message: "Last name must be between 2 and 22 characters",
    };
  }

  if (!validator.isAlpha(firstname) || !validator.isAlpha(lastname)) {
    //alphabet characters only!
    return {
      isValid: false,
      message: "Names must only contain Characters",
    };
  }

  if (!validator.isEmail(email) && !validator.isLowerCase(email)) {
    return { isValid: false, message: "Email is not valid" };
  }

  if (!validator.isStrongPassword(password, { minLength: 8, minSymbols: 1 })) {
    return {
      isValid: false,
      message:
        "Password must be at least 8 characters long and include at least one symbol",
    };
  }

  return { isValid: true };
};

const validateLoginData = (email, password) => {
  if (!validator.isEmail(email) || !validator.isStrongPassword(password)) {
    return { isValid: false, message: "Enter valid email and password" };
  }

  return { isValid: true };
};

const validateForgotPasswordData = (email) => {
  if (!validator.isEmail(email)) {
    return { isValid: false, message: "Enter valid email" };
  }

  return { isValid: true };
};
const validateResetPasswordData = (password) => {
  if (!validator.isStrongPassword(password, { minLength: 8, minSymbols: 1 })) {
    return {
      isValid: false,
      message:
        "Password must be at least 8 characters long and include at least one symbol",
    };
  }

  return { isValid: true };
};
module.exports = {
  validateSignUpData,
  validateLoginData,
  validateForgotPasswordData,
  validateResetPasswordData,
};
