import './App.css';
import { Typography, Row, Col, Card, Statistic } from 'antd';
import { Area, Chart, Interval, Line } from 'bizcharts';
import { useEffect, useRef, useState } from 'react';
import { getServiceList, getServiceMetrics } from './request';

function App() {

  const [services, updateServiceList] = useState([]);
  const [serviceMetrics, updateServiceMetrics] = useState({});
  const serviceMetricsRef = useRef();
  serviceMetricsRef.current = serviceMetrics;

  useEffect(() => {
    getServiceList().then(serviceList => updateServiceList(serviceList));
  }, []);

  useEffect(() => {
    const updateMetrices = () => {
      for (const service of services) {
        getServiceMetrics(service._id).then(serviceMetricsList => {
          updateServiceMetrics({
            ...serviceMetricsRef.current,
            [service._id]: serviceMetricsList,
          })
        });
      }
    };

    updateMetrices();
    const intervalId = setInterval(() => {
      updateMetrices();
    }, 10000);
    return () => {
      clearInterval(intervalId);
    }
  }, [services]);

  return (
    <div>
      <Row gutter={16} justify="space-around">
        <Col span={22}>
          <Typography.Title level={2}>
            Status Page
            </Typography.Title>
          <Row gutter={12} justify="space-around">
            {Object.keys(services).map(k => (
              <Col key={k} span={24}>
                <Card title={services[k].name}>
                  <Row justify="space-around">
                    <Col span={8}>
                      <Statistic
                        title="Uptime"
                        value={services[k].upTime}
                        suffix="%"
                        valueStyle={{
                          color: '#5b8c00'
                        }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Avg Response Time"
                        value={services[k].avgResponseTime}
                        suffix="ms"
                        valueStyle={{
                          color: '#0050b3'
                        }}
                      />
                    </Col>
                  </Row>
                  <Chart
                    autoFit
                    height={200}
                    data={serviceMetrics[services[k]._id]}
                  >
                    <Line
                      shape="smooth"
                      position="createdAt*time"
                    />
                    <Area position="createdAt*time" />
                  </Chart>
                  <Chart
                    autoFit
                    height={50}
                    data={serviceMetrics[services[k]._id]}
                  >
                    <Interval
                      position="failures*time"
                      color="#a8071a"
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
