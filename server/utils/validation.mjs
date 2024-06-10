export const isPasswordValid = (password) => {
  if (password.toString().length < 8) {
    throw new Error(
      "Password not valid. Please provide a password that contains at least 8 characters."
    );
  }

  if (password.toString().match(/^[0-9]+$/)) {
    throw new Error(
      "Password not valid. Please provide a password that not contains only numbers."
    );
  }

  if (password.toString().match(/^[a-zA-Z0-9]*$/)) {
    throw new Error(
      "Password not valid. Please provide a password that contains at least one special character."
    );
  }

  if (!password.toString().match(/[A-Z]/)) {
    throw new Error(
      "Password not valid. Please provide a password that contains at least one uppercase letter."
    );
  }
};
