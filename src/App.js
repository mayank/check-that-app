import './App.css';
import { Typography, Row, Col, Card } from 'antd';
import { Chart, Interval } from 'bizcharts';
import { useEffect, useState } from 'react';
import { getServiceList, getServiceMetrics } from './request';

function App() {

  const [services, updateServiceList] = useState([]);
  const [serviceMetrics, updateServiceMetrics] = useState({});

  useEffect(() => {
    getServiceList().then(serviceList => updateServiceList(serviceList));
  }, []);

  useEffect(() => {
    for(const service of services) {
      getServiceMetrics(service._id).then(serviceMetricsList => {
        updateServiceMetrics({
          ...serviceMetrics,
          [service._id]: serviceMetricsList,
        })
      });
    }
  }, [services]);

  return (
    <div>
        <Row gutter={16} justify="space-around">
          <Col span={22}>
            <Typography.Title>
              Status Page
            </Typography.Title>
            <div style={{ display: 'none'}}>{JSON.stringify(serviceMetrics)}</div>
            <Row gutter={12} justify="space-around">
              {Object.keys(services).map(k => (
                <Col key={k} span={24}>
                  <Card title={services[k].name}>
                  <Chart
                    autoFit
                    height={200}
                    data={serviceMetrics[services[k]._id]}
                  >
                    <Interval
                      position="createdAt*time"
                    />
                  </Chart>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
      </Row>
    </div>
  );
}

export default App;
