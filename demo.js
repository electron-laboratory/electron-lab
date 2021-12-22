const arrayToObject = (originObject, originArray) => {
  const result = {};
  originArray.forEach(item => {
    if (originObject[item]) {
      result[item] = originObject[item];
    } else {
      result[item] = '*';
    }
  });
  return result;
};
console.log(arrayToObject({ antd: '^4' }, ['antd', 'react', 'lodash']));
