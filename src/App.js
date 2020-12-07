import './App.css';
import { Typography, Row, Col, Card, Statistic, Divider } from 'antd';
import { Area, Chart, Interval, Line, registerShape } from 'bizcharts';
import { useEffect, useRef, useState } from 'react';
import { getServiceList, getServiceMetrics } from './request';


registerShape('interval', 'border-radius', {
  draw(cfg, container) {
    const { points } = cfg;
    let path = [];
    path.push(['M', points[0].x, points[0].y]);
    path.push(['L', points[1].x, points[1].y]);
    path.push(['L', points[2].x, points[2].y]);
    path.push(['L', points[3].x, points[3].y]);
    path.push('Z');
    path = this.parsePath(path);

    const group = container.addGroup();
    group.addShape('rect', {
      attrs: {
        x: path[1][1],
        y: path[1][2],
        width: path[2][1] - path[1][1],
        height: path[0][2] - path[1][2],
        fill: cfg.color,
        radius: (path[2][1] - path[1][1]) / 2,
      },
    });

    return group;
  },
});

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
    }, 1000 * 60);
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
                    scale={{value:{min: 0}}}
                  >
                    <Line
                      shape="smooth"
                      position="createdAt*time"
                    />
                    <Area position="createdAt*time" />
                  </Chart>
                  <Divider />
                  <Chart
                    autoFit
                    height={100}
                    data={serviceMetrics[services[k]._id]}
                    scale={{
                      expected: {
                        min:0,
                        max:1,
                        sync: "value"
                      },
                      actual: {
                        sync: 'value',
                      }
                    }}
                  >
                    <Interval
                      position="failures*createdAt"
                      color="#ddd"
                      shape={['expected*createdAt'], (val) => 0}
                    />
                    <Interval
                      position="failures*createdAt"
                      color="#a8071a"
                      shape={['actual*createdAt'], (val) => val > 0 ? 1: 0}
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
