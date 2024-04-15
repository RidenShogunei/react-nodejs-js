import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import api from "../../api/document"; // 引入你写的api
import styles from './index.module.css'
const { Dragger } = Upload;

const App = () => {
  const [fileList, setFileList] = useState([]);

  const onChange = async ({ file, fileList }) => {
    setFileList(fileList);
    if (file.status === "uploading") {
    } else if (file.status === "done") {
    }
  };
  const handleUpload = async ({ file, onSuccess, onError }) => {
    const uid = localStorage.getItem("uid");

    const response = await api.sendDocument(uid, file);
    // 文件上传成功，调用api
    console.log("上传", file);
    if (response.error) {
      console.error("上传文件时发生错误：", response.error);
      message.error(`上传文件时发生错误：${response.error}`);
      onError(new Error(response.error));
    } else {
      message.success(`${file.name} 文件上传成功.`);
      onSuccess(null, response);
    }
  };
  const onDrop = (e) => {
    console.log("Dropped files", e.dataTransfer.files);
  };
  const onError = (error) => {
    console.error("上传文件时发生错误：", error);
    message.error(`上传文件时发生错误：${error}`);
  };
  return (
    <div className={styles.detile}>
    <Dragger
      name="file"
      multiple={true}
      fileList={fileList}
      onChange={onChange}
      onDrop={onDrop}
      onError={onError}
      action="#" // 从"/api/document"文件中找到这个URL，并填到这里来
      customRequest={handleUpload} 
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或将文件拖拽到这个区域来上传</p>
      <p className="ant-upload-hint">
        支持单个或批量上传. 严禁上传公司数据及其他禁止的文件.
      </p>
    </Dragger>
    </div>
  );
};

export default App;
