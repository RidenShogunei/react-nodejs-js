import React from "react";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import styles from './login.module.css';
import api from '../../api/login'
const LoginForm = () => {
  const [name, setname] = useState('');
  const [password, setpassword] = useState('');
  const [realname, setrealname] = useState('');
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const goback = () => {
    message.success('返回登录界面')
    navigate('/')
  }
  const submit = async () => {
    try {
      const result = await api.register(name, password, realname);
      console.log("注册的结果", result)
      if (result.data && result.data !== 'fail') {
        message.success("注册成功!!")
        localStorage.setItem('uid', result.uid)
        navigate('/home')
      } else {
        message.error(result.message)
      }
    } catch (error) {
      console.log('注册失败:', error);
      message.error("登录失败，发生了一些错误，稍后再试")
    }
  };

  return (
    <div className={styles.login}>
      <Card className={styles.card}>
        <div className={styles.title}>欢迎来到登录</div>
        <Form
          name="normal_login"
          className={styles['login-form']}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "请输入你的名字!" }]}
          >
            <Input
              placeholder="请输入你的名字!"
              value={name} onChange={e => setname(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="password"
            name="password"
            rules={[{ required: true, message: "请输入你的密码!" }]}
          >
            <Input placeholder="请输入你的密码!" value={password} onChange={e => setpassword(e.target.value)} />
          </Form.Item>


          <Form.Item
            label="realname"
            name="realname"
            rules={[{ required: true, message: "请输入你的真名!" }]}
          >
            <Input placeholder="请输入你的真名!" value={realname} onChange={e => setrealname(e.target.value)} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles['login-form-button']}
              onClick={submit}
            >
              注册
            </Button>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit"
              className={styles['login-form-button']}
              onClick={goback}
            >
              返回
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;