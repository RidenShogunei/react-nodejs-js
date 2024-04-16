import React, { useRef, useState } from 'react';
import { Button, Card, message, Upload } from 'antd';
import { AudioOutlined, UploadOutlined } from '@ant-design/icons';
import style from './index.module.css'
import AudioAnalyser from 'react-audio-analyser'; 
import api from '../../api/sound'; //你的音频文件API模块

const Sound = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = () => {
      navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
              mediaRecorderRef.current = new MediaRecorder(stream);
              audioChunksRef.current = [];

              mediaRecorderRef.current.addEventListener("dataavailable", event => {
                  audioChunksRef.current.push(event.data);
              });

              mediaRecorderRef.current.start();
              setRecording(true);
          }).catch(err => { 
              message.error('获取音频流失败');
              console.log(err);
          });
  };

  const stopRecording = () => {
      mediaRecorderRef.current.stop();
      setRecording(false);
      const audioBlob = new Blob(audioChunksRef.current);
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
  };

  // 上传文件
  const uploadAudio = async () => {
      const uid = "your_uid_here"; // 请替换为实际的uid
      const file = new File(audioChunksRef.current, "example.wav", { type: 'audio/wav' });
      const response = await api.sendAudio(uid, file);
      if(response.error) {
          message.error('上传失败');
      } else {
          message.success('上传成功');
      }
  };

  const props = {
      beforeUpload: file => {
          const isWav = file.type === 'audio/wav';
          if (!isWav) {
              message.error('您只能上传WAV文件!');
          }
          return isWav;
      },
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
                <Button
                    type="primary"
                    icon={<AudioOutlined />}
                    onClick={handleButtonClick}
                >
                    {recording ? "停止录音" : "开始录音"}
                </Button>
                {audioURL && (
                    <AudioAnalyser
                        audioSrc={audioURL}
                        visualSetting="sinewave" // 使用正弦波形状
                        width={500}
                        height={200}
                    />
                )}
                <Upload {...props}>
                    <Button
                        icon={<UploadOutlined />}
                        onClick={uploadAudio}
                    >
                        上传音频
                    </Button>
                </Upload>
            </Card>
        </div>
    </>
);
};

export default Sound;