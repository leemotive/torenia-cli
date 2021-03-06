import { Utils } from 'torenia';
const { render } = Utils;

export default () => {
  return [
    {
      title: '姓名',
      dataIndex: 'username',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: render.tag('gender'),
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
  ];
};
