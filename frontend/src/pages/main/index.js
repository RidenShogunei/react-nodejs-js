import React, { useState } from "react";
import { Select, Input, Button, Layout } from "antd";
import axios from "axios";
import "./index.css";
function MainPage() {
  const ICP = "沪ICP备202405831号";
  const [engine, setEngine] = useState("baidu");
  const [query, setQuery] = useState("");
  const [amount, setamount] = useState("");
  const { Header, Content, Footer } = Layout;
  const handleEngineChange = (value) => setEngine(value);
  const handleQueryChange = (e) => setQuery(e.target.value);
  const handleAmountChang = (num) => setamount(num.target.value);
  const handleSearch = async () => {
    try {
      const result = await axios.post("/search", { engine, query });
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="search">
      <Layout>
        <Header style={{ display: "flex", alignItems: "center" }}>
          <div className="demo-logo" />
        </Header>
        <Content style={{ padding: "0 48px" }}>
          <div
            style={{
              background: "#f0f2f5",
              minHeight: 280,
              padding: 24,
              borderRadius: 4,
            }}
          >
            <div className="input">
              <Select
                defaultValue="word"
                style={{ width: 120 }}
                onChange={handleEngineChange}
              >
                <Select.Option value="word">文字</Select.Option>
                <Select.Option value="picture">图片</Select.Option>
                <Select.Option value="video">视频</Select.Option>
              </Select>
              <Input type="text" value={query} onChange={handleQueryChange} />
              <Input
                type="number"
                value={amount}
                onChange={handleAmountChang}
              />
              <Button type="primary" onClick={handleSearch}>
                搜索
              </Button>
            </div>
            <div className="show"></div>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
          >
            {ICP}
          </a>
        </Footer>
      </Layout>
    </div>
  );
}

export default MainPage;
