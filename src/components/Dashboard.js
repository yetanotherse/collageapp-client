import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Breadcrumb, Spin, Card } from 'antd';
import { Bar, Pie } from '@antv/g2plot';
import { useNavigate } from 'react-router-dom';
//import { ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [domReady, setDomReady] = useState(false);

    const byStateRef = useRef();
    const byCourseRef = useRef();

    sessionStorage.setItem('selectedMenu', '1');

    let navigate = useNavigate(); // for redirecting based on clicks

    useEffect(() => {
        const fetchAndRender = async () => {
            console.log('url', process.env.REACT_APP_API_BASE_URL);
            try {
                if (!domReady) { // need to ensure dom is ready for charts
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/stats/`);
                    const json = await response.json();
                    if (byStateRef.current && byCourseRef.current) {
                        setDomReady(true);
                        renderPieCharts(json);
                    }
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log("error", error);
            }
        };
        fetchAndRender();
    });

    //NOT in use - just for checking which looks better - apparantey pie/donut looks much better
    const renderBarCharts = (data) => {
        const byStateBar = new Bar('byState', {
            data: data.byState,
            xField: 'count',
            yField: '_id'
        });
        byStateBar.render();
        byStateBar.on('element:click', (e) => {
            console.log(e);
            navigate(`/colleges/state/${e.data.data._id}`);
        });
        const byCourseBar = new Bar('byCourse', {
            data: data.byCourse,
            xField: 'count',
            yField: '_id'
        });
        byCourseBar.render();
        byCourseBar.on('element:click', (e) => {
            console.log(e);
            navigate(`/colleges/course/${e.data.data._id}`);
        });
    }

    const renderPieCharts = (data) => {
        const byStatePie = new Pie('byState', {
            data: data.byState,
            angleField: 'count',
            colorField: '_id',
            appendPadding: 10,
            radius: 1,
            innerRadius: 0.6,
            label: {
                content: '{value}%',
                style: {
                    textAlign: 'center',
                    fontSize: 14,
                },
            },
            statistic: {
                title: false,
                content: {
                    content: '',
                },
            }
        });
        byStatePie.render();
        byStatePie.on('element:click', (e) => {
            navigate(`/colleges/state/${e.data.data._id}`);
        });
        const byCoursePie = new Pie('byCourse', {
            data: data.byCourse,
            xField: 'count',
            yField: '_id',
            angleField: 'count',
            colorField: '_id',
            appendPadding: 10,
            radius: 1,
            innerRadius: 0.6,
            label: {
                content: '{value}%',
                style: {
                    textAlign: 'center',
                    fontSize: 14,
                },
            },
            statistic: {
                title: false,
                content: {
                    content: '',
                },
            }
        });
        byCoursePie.render();
        byCoursePie.on('element:click', (e) => {
            navigate(`/colleges/course/${e.data.data._id}`);
        });
    }

    return loading ?
        <div className="spinner">
            <Spin size="large" />
        </div> :
        (
            <div className="Dashboard">
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><a href="/">Home</a></Breadcrumb.Item>
                    <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <Card
                        style={{ width: '100%', marginTop: 16 }}
                    >
                        <Card.Meta
                            title="Dashboard"
                        />
                        <Row gutter={12}>
                            <Col span={12}>
                                <Card
                                    style={{ width: '100%', marginTop: 16 }}
                                >
                                    <Card.Meta
                                        title="Colleges by States"
                                        description="Click on the pie to view the list of colleges for given state"
                                    />
                                    <div id="byState" ref={byStateRef}></div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    style={{ width: '100%', marginTop: 16 }}
                                >
                                    <Card.Meta
                                        title="Colleges by Courses"
                                        description="Click on the pie to view the list of colleges for given course"
                                    />
                                    <div id="byCourse" ref={byCourseRef}></div>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        );
}

export default Dashboard;
