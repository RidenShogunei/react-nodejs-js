import React, { useRef, useState } from 'react';
import { Button, Card, message } from 'antd';
import { VideoCameraOutlined, UploadOutlined } from '@ant-design/icons';
import style from './index.module.css'
import api from '../../api/video'; // 你的视频文件API模块

const Video = () => {
    const [recording, setRecording] = useState(false);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const videoChunksRef = useRef([]);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const fileName = `${year}${month}${day}_${hours}${minutes}${seconds}.webm`;

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then(stream => {
                mediaRecorderRef.current = new MediaRecorder(stream);
                videoChunksRef.current = [];
                videoRef.current.srcObject = stream;
                mediaRecorderRef.current.addEventListener("dataavailable", event => {
                    console.log("dataavailable event has been triggered");
                    videoChunksRef.current.push(event.data);
                });
                mediaRecorderRef.current.start(10);
                setRecording(true);
            }).catch(err => {
                message.error('获取音频/视频流失败');
                console.log(err);
            });
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        console.log("video data", videoChunksRef.current, videoBlob)
    };

    // 上传文件
    const uploadVideo = async () => {
        const uid = localStorage.getItem('uid'); // 请替换为实际的uid
        const file = new File(videoChunksRef.current, fileName, { type: 'video/webm' });
        const response = await api.sendVideo(uid, file);
        if (response.error) {
            message.error('上传失败');
        } else {
            message.success('上传成功');
        }
    };

    const handleButtonClick = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <>
            <div className={style.main}>
                <Card>
                    <video ref={videoRef} autoPlay muted className={style.show}/>
                    <div className={style.bot}>
                        <Button
                            type="primary"
                            icon={<VideoCameraOutlined />}
                            onClick={handleButtonClick}
                        >
                            {recording ? "停止录制" : "开始录制"}
                        </Button>
                        <Button
                            icon={<UploadOutlined />}
                            onClick={uploadVideo}
                        >
                            上传视频
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Video;