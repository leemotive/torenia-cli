import React, { Component } from 'react';
import { Form } from 'torenia';

class Ad extends Component {
  constructor(props) {
    super(props);
  }
  get formConfig() {
    return {
      fields: [
        { name: 'username', label: '用户名' },
        {
          name: 'age',
          label: '年龄',
          dependency: getFieldValue => getFieldValue('username') == 1,
        },
        {
          name: 'password',
          label: '密码',
          dependency: { $or: { username: 1, age: 2 } },
        },
      ],
      defaultValue: {
        username: 1,
        age: 2,
      },
      itemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 15 },
      },
      onSubmit: () => {},
    };
  }

  render() {
    return (
      <div>
        <Form {...this.formConfig} />
      </div>
    );
  }
}

export default Ad;
