import './App.css';
import { Typography, Row, Col, Card } from 'antd';
import { Chart, Line } from 'bizcharts';
import { useEffect, useState } from 'react';
import { getServiceList } from './request';

function App() {

  const data = [
    { month: '2020-01-01', acc: 1.23 },
    { month: '2020-01-02', acc: 0.46 },
    { month: '2020-01-03', acc: 2.11 },
    { month: '2020-01-04', acc: 3.3 },
    { month: '2020-01-05', acc: 5.23 },
  ];

  const [services, updateServiceList] = useState([]);

  useEffect(() => {
    getServiceList().then(serviceList => updateServiceList(serviceList));
  }, []);

  return (
    <div>
        <Row gutter={16} justify="space-around">
          <Col span={22}>
            <Typography.Title>
              Status Page
            </Typography.Title>
            {Object.keys(services).map(k => (
              <Col key={k}>
                <Card title={services[k].name}></Card>
              </Col>
            ))}
            <Chart
              scale={{ value: { min: 0 } }}
              padding={[ 10, 20, 50, 40 ]}
              autoFit
              height={500}
              data={data}
            >
              <Line
                shape="smooth"
                position="month*acc"
                color="l (270) 0:rgba(255, 146, 255, 1) .5:rgba(100, 268, 255, 1) 1:rgba(215, 0, 255, 1)"
              />
            </Chart>
          </Col>
      </Row>
    </div>
  );
}

export default App;
