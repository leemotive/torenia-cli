import { Utils } from 'torenia';

const { dictionary } = Utils;

dictionary.put('gender', [
  { label: '男', value: 1, color: 'blue' },
  { label: '女', value: 0, color: 'red' },
]);

export default dictionary;
