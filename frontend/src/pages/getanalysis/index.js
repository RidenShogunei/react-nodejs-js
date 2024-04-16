import React, { useEffect, useState } from 'react';
import api from '../../api/getanalysis';
import ReactEcharts from 'echarts-for-react';
import style from './index.module.css'
const UserAnalysis = () => {
  const [barOption, setBarOption] = useState({});
  const [pieOption, setPieOption] = useState({});
  const userId = localStorage.getItem('uid');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getanalysis(userId);
        const data = res;

        const barChartOption = {
          title: {
            text: '用户数据统计（KB）'
          },
          tooltip: {},
          legend: {
            data:['存储大小(KB)',]
          },
          xAxis: {
            data: ["文件", "音频", "视频", "总大小"]
          },
          yAxis: {},
          series: [{
            name: '存储大小',
            type: 'bar',
            data: [data.fileSizeKB, data.audioSizeKB, data.videoSizeKB, data.totalSizeKB]
          }]
        };

        const pieChartOption = {
            title : {
                text: '内存占用比（KB）',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series : [
                {
                    name: '存储大小',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:data.fileSizeKB, name:'文件'},
                        {value:data.audioSizeKB, name:'音频'},
                        {value:data.videoSizeKB, name:'视频'}
                    ]
                }
            ]
        };

        setBarOption(barChartOption);
        setPieOption(pieChartOption);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={style.detile}>
      <ReactEcharts
        option={barOption}
        style={{height: '500px', width: '500px'}}
      />
      <ReactEcharts
        option={pieOption}
        style={{height: '500px', width: '500px'}}
      />
    </div>
  );
};

export default UserAnalysis;