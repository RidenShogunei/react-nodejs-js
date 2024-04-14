import React, { useState } from 'react';
import { Button, Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import Footerpart from './components/footer/footer'
import styles from './index.module.css';
const { Header, Content, Footer } = Layout;
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem('文件存储', '1', <PieChartOutlined />),
  getItem('音频存储', '2', <DesktopOutlined />),
  getItem('视频存储', '3', <ContainerOutlined />),
  getItem('数据管理', 'sub1', <MailOutlined />, [
    getItem('文件管理', '5'),
    getItem('音频管理', '6'),
    getItem('视频管理', '7'),
    getItem('总体管理', '8'),
  ]),
  getItem('个人中心', 'sub2', <AppstoreOutlined />, [
    getItem('数据展示', '9'),
    getItem('个人信息', '10'),
  ]),
];
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout className={styles.main}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <div className={styles.title}>数据存储系统</div>
      </Header>
      <Content >
        <div className={styles.content}>
          <div
            style={{
              width: 256,
            }}
          >
            <Button
              type="primary"
              onClick={toggleCollapsed}
              style={{
                marginBottom: 16,
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              theme="dark"
              inlineCollapsed={collapsed}
              items={items}
            />
          </div>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        <Footerpart></Footerpart>
      </Footer>
    </Layout>
  );
};
export default App;