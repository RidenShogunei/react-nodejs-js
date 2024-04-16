import React, { useEffect, useState } from "react";
import { Space, Table, Button, message } from "antd";
import api from "../../api/sound"; // Assuming api is in the same directory
import Style from './index.module.css'
const App = () => {
    const [data, setData] = useState([]);

    const columns = [
        {
            title: "audio_id",
            dataIndex: "audio_id",
            key: "audio_id",
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
                    <Button onClick={() => show(record.audio_id)}>Listen</Button>
                    <Button type="primary" onClick={() => downloadFile(record.audio_id)}>Download</Button>
                    <Button danger onClick={() => deleteFile(record.audio_id)}>Delete</Button>
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
            const response = await api.getAudio(uid);

            if (response.length === 0) {
                setData([]);
            } else {
                const dataWithKey = response.data.map(item => ({ ...item, key: item.audio_id })); // Using audio_id as key
                setData(dataWithKey);
            }

        } catch (error) {
            console.error("Error getting audiouments: ", error);
            setData([]);
        }
    };
    const show = (audio_id) => {
        console.log("audioid", audio_id)
        let fileItem = data.find((audio) => audio.audio_id === audio_id);
        if (!fileItem) {
            message.error('文件不存在!');
            return;
        }
    
        let filePath = fileItem.file_path;
        const apiUrl = process.env.REACT_APP_API_URL;
        const mid = 'audio'
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
    const downloadFile = async (audio_id) => {
        console.log("audioid", audio_id);
        let fileItem = data.find((audio) => audio.audio_id === audio_id);
        if (!fileItem) {
            message.error('文件不存在!');
            return;
        }

        let filePath = fileItem.file_path;
        const apiUrl = process.env.REACT_APP_API_URL;
        const mid = 'audio';
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

    const deleteFile = async (audio_id) => {
        try {
            await api.deleteAudio(audio_id);
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
