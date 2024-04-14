import React, { useState } from "react";
import { Button, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
function getItem(label, key, icon, children, type, path) {
  return {
    key,
    icon,
    children,
    label,
    type,
    path,
  };
}
const items = [
  getItem("文件存储", "1", <PieChartOutlined />, null, null, "document"),
  getItem("音频存储", "2", <DesktopOutlined />, null, null, "sound"),
  getItem("视频存储", "3", <ContainerOutlined />, null, null, "/video-storage"),
  getItem("数据管理", "sub1", <MailOutlined />, [
    getItem("文件管理", "5", null, null, null, "/data-management/file"),
    getItem("音频管理", "6", null, null, null, "/data-management/audio"),
    getItem("视频管理", "7", null, null, null, "/data-management/video"),
    getItem("总体管理", "8", null, null, null, "/data-management/all"),
  ]),
  getItem("个人中心", "sub2", <AppstoreOutlined />, [
    getItem("数据展示", "9", null, null, null, "/personal-center/data-display"),
    getItem(
      "个人信息",
      "10",
      null,
      null,
      null,
      "/personal-center/personal-info"
    ),
  ]),
];
const Sider = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const handleMenuItemClick = (path) => {
    navigate(path);
  };
  return (
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
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
      >
        {items.map((submenu) =>
          submenu.children ? (
            <Menu.SubMenu
              key={submenu.key}
              title={submenu.label}
              icon={submenu.icon}
            >
              {submenu.children.map((item) => (
                <Menu.Item
                  key={item.key}
                  onClick={() => handleMenuItemClick(item.path)}
                >
                  {item.label}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item
              key={submenu.key}
              icon={submenu.icon}
              onClick={() => handleMenuItemClick(submenu.path)}
            >
              {submenu.label}
            </Menu.Item>
          )
        )}
      </Menu>
    </div>
  );
};

export default Sider;
