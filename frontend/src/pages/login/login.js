import React, {useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card ,message} from "antd";
import styles from './login.module.css';
import api from '../../api/login'
import { AuthContext } from "../../context/AuthContext";
const LoginForm = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [name, setname] = useState('');
  const [password, setpassword] = useState('');
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const rigester=()=>{
    message.success('欢迎进入注册界面')
    navigate('/rigester')
  }
  const submit = async () => {
    try {
      const result = await api.login(name, password);
      console.log("登录的结果", result)
      if (result.data && result.data !== 'fail') {
        message.success("登陆成功!!")
        setIsAuthenticated(true); 
        localStorage.setItem('uid', result.data)
        navigate('/home')
      } else {
        message.error("登录失败，账户名或密码错误")
      }
    } catch (error) {
      console.log('登录失败:', error);
      message.error("登录失败，发生了一些错误，稍后再试")
    }
  };

  return (
    <div className={styles.login}>
      <Card className={styles.card}>
        <div className={styles.title}>欢迎来到数据管理系统</div>
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles['login-form-button']}
              onClick={submit}
            >
              登录
            </Button>
          </Form.Item>

          <Form.Item>
            <Button              htmlType="submit"
              className={styles['login-form-button']}
              onClick={rigester}
            >
              注册 
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;