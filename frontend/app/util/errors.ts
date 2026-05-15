export const getErrorMessage = (response: any) => {
  if (response.message) {
    if (Array.isArray(response.message)) {
      return formatErrorMassage(response.message[0]);
    }
    return formatErrorMassage(response.message);
  }
  return "Unknown error occured.";
};

const formatErrorMassage = (message: string) => {
  return message.charAt(0).toUpperCase() + message.slice(1);
};
