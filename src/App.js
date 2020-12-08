import './App.css';
import { Typography, Row, Col, Card, Statistic, Divider } from 'antd';
import { Area, Axis, Chart, Interval, Legend, Line, Point, registerShape } from 'bizcharts';
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
                    <Col span={5}>
                      <Statistic
                        title="Uptime"
                        value={services[k].upTime}
                        suffix="%"
                        valueStyle={{
                          color: '#5b8c00',
                        }}
                      />
                    </Col>
                    <Col span={5}>
                      <Statistic
                        title="Avg Response Time"
                        value={services[k].avgResponseTime}
                        suffix="ms"
                        valueStyle={{
                          color: '#0050b3'
                        }}
                      />
                    </Col>
                    <Col span={5}>
                      <Statistic
                        title="Failed Requests"
                        value={services[k].failures || 0}
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
                    scale={
                      {
                        t: {
                          min:0
                        },
                        f: {
                          max: 60
                        },
                      }
                    }
                    pure
                  >
                    <Axis name="f" grid={null} />
                    <Axis name="t" grid={null} />

                    <Line
                      shape="smooth"
                      position="c*t"
                      color="#91d5ff"
                    />                    
                    <Area position="c*t" color="#e6f7ff" />
                    <Interval
                      shape="smooth"
                      position="c*f"
                      color="#ff4d4f"
                    />
                  </Chart>
                  <Divider />
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
