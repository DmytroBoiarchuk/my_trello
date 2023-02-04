export const validate = (value: string) => {
  if (value.trim().length === 0) {
    return true;
  }
  const valid = /^[A-Za-z0-9 _\-.?,`:"]*$/;
  return !valid.test(value);
};
