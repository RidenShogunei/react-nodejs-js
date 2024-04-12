import React from "react";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import "./login.css"; 

const LoginForm = () => {
  const [name, setname] = useState('');
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const submit = () => {
    if(name==="陈瑾旭"||name==="游客"||name==="郑闽乐"||name==="周翔"||name==="王斯阳"||name==="饶稷"||name==="王科琦"||name==="雷翔"){
        navigate('/home'); // 这里假设你主页面的路由是 "/home"
    } else {
      alert('禁止访问！！！')
    }
  };

  return (
    <div className="login">
      <div className="title">欢迎来到简单爬虫系统</div>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "请输入你的名字!" }]}
        >
          <Input placeholder="请输入你的名字!" value={name} onChange={e => setname(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            onClick={submit}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;