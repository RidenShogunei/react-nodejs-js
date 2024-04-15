import { Routes, Route } from "react-router-dom";
import React from "react";
import { Layout } from "antd";
import Sider from "./components/sider/sider";
import Footerpart from "./components/footer/footer";
import styles from "./index.module.css";
import Doc from "../document/index";
import Sound from "../sound/index";
import Man from "../mangedoc/index";
import Wel from "./components/welcome/index"
const { Header, Content, Footer } = Layout;
const App = () => {
  return (
    <Layout className={styles.main}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className={styles.title}>数据存储系统</div>
      </Header>
      <Content>
        <div className={styles.content}>
          <div className={styles.sider}>
            <Sider></Sider>
          </div>
          <div className={styles.detile}>
            <Routes>
              <Route path="" element={<Wel />} />
              <Route path="document" element={<Doc />} />
              <Route path="sound" element={<Sound />} />
              <Route path="manage" element={<Man />} />
            </Routes>
          </div>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        <Footerpart></Footerpart>
      </Footer>
    </Layout>
  );
};
export default App;
