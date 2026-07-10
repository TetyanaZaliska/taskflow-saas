export const formatDate = (isoDate: string, fullDate?: boolean) => {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
  };

  if (fullDate === true) {
    options.timeStyle = "short";
  }

  return new Intl.DateTimeFormat("en-US", options).format(date);
};
