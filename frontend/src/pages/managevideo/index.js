import React, { useEffect, useState } from "react";
import { Space, Table, Button, message } from "antd";
import api from "../../api/video"; // Assuming api is in the same directory
import Style from './index.module.css'
const App = () => {
    const [data, setData] = useState([]);

    const columns = [
        {
            title: "video_id",
            dataIndex: "video_id",
            key: "video_id",
        },
        {
            title: "File Name",
            dataIndex: "file_name",
            key: "file_name",
        },
        {
            title: "File Type",
            dataIndex: "file_type",
            width: '100px',
            key: "file_type",
        },
        {
            title: "file_size",
            dataIndex: "file_size",
            key: "file_size",
        },
        {
            title: "Upload Time",
            dataIndex: "upload_date",
            key: "upload_date",
        },
        {
            title: "Action",
            key: "action",
            render: (record) => (
                <Space size="middle">
                    <Button onClick={() => show(record.video_id)}>Look</Button>
                    <Button type="primary" onClick={() => downloadFile(record.video_id)}>Download</Button>
                    <Button danger onClick={() => deleteFile(record.video_id)}>Delete</Button>
                </Space>
            ),
        },
    ];
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        let uid = localStorage.getItem("uid");

        if (!uid) {
            console.error("No user is logged in.");
            return;
        }
        try {
            const response = await api.getVideo(uid);

            if (response.length === 0) {
                setData([]);
            } else {
                const dataWithKey = response.data.map(item => ({ ...item, key: item.video_id })); // Using video_id as key
                setData(dataWithKey);
            }

        } catch (error) {
            console.error("Error getting videouments: ", error);
            setData([]);
        }
    };
    const show = (video_id) => {
        console.log("videoid", video_id)
        let fileItem = data.find((video) => video.video_id === video_id);
        if (!fileItem) {
            message.error('文件不存在!');
            return;
        }
    
        let filePath = fileItem.file_path;
        const apiUrl = process.env.REACT_APP_API_URL;
        const mid = 'video'
        const fullPath = `${apiUrl}/${mid}/${filePath}`;
    
        const link = document.createElement('a');
        link.href = fullPath;
        link.target = '_blank'; // 使链接在新窗口或者新标签页打开
        document.body.appendChild(link);
        link.addEventListener('click', function () {
            message.success('开始下载文件');
        });
    
        link.click();
        document.body.removeChild(link);
    }
    const downloadFile = async (video_id) => {
        console.log("videoid", video_id);
        let fileItem = data.find((video) => video.video_id === video_id);
        if (!fileItem) {
            message.error('文件不存在!');
            return;
        }

        let filePath = fileItem.file_path;
        const apiUrl = process.env.REACT_APP_API_URL;
        const mid = 'video';
        const fullPath = `${apiUrl}/${mid}/${filePath}`;

        try {
            const response = await fetch(fullPath);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileItem.file_name || 'download';
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again         
        } catch (error) {
            message.error('文件下载失败');
        }
    };

    const deleteFile = async (video_id) => {
        try {
            await api.deleteVideo(video_id);
            fetchData(); // fetching the updated data after deletion
        } catch (error) {
            fetchData();
            console.error(error);
        }
    };

    return (
        <div className={Style.detile}>
            <Table columns={columns} dataSource={data} size="middle" bordered />
        </div>
    );
};

export default App;
