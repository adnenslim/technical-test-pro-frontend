export const parseIds = (data) => {
  return Object.keys(data).reduce((acc, key) => {
    if (key.endsWith('Id')) {
      acc[key] = Number(data[key]);
    } else {
      acc[key] = data[key];
    }
    return acc;
  }, {});
};
