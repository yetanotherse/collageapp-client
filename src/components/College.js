import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Tag, Divider, Breadcrumb, Spin, Skeleton, Card, Avatar, List, Typography } from 'antd';
import { UserOutlined, BankOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Text } = Typography;

const College = (props) => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    let params = useParams();

    sessionStorage.setItem('selectedMenu', '2');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/college/${params.collegeId}`);
                const json = await response.json();
                setData(json);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log("error", error);
            }
        };
        fetchData();
    }, []);

    const getCollegeDescription = (college) => {
        return (
            <div>
                {college.city}, {college.state}, {college.country}
                <Divider>Courses Offered</Divider>
                {college.courses.map(course => (
                    <Tag color="blue" key={course}>
                        <a href={`/colleges/course/${course}`}>{course}</a>
                    </Tag>
                ))}
            </div>
        )
    }

    return loading ?
        <div className="spinner">
            <Spin size="large" />
        </div> :
        (
            <div className="College">
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><a href="/">Home</a></Breadcrumb.Item>
                    <Breadcrumb.Item>Colleges</Breadcrumb.Item>
                    <Breadcrumb.Item>{data.college.name}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <Card
                        style={{ width: '100%', marginTop: 16 }}
                    >
                        <Skeleton loading={loading} avatar active>
                            <Meta
                                avatar={<Avatar size={128} icon={<BankOutlined />} />}
                                title={data.college.name}
                                description={getCollegeDescription(data.college)}
                            />
                        </Skeleton>
                        <Row gutter={12}>
                            <Col span={12}>
                                <List
                                    header={<Text strong>Students List</Text>}
                                    bordered
                                    dataSource={data.college.students}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Avatar size="small" icon={<UserOutlined />} />}
                                                title={<a href={`/student/${item._id}`}>{item.name}</a>}
                                                description={item.email}
                                            />
                                        </List.Item>
                                    )}
                                    style={{ "marginTop": "20px" }}
                                />
                            </Col>
                            <Col span={12}>
                                <List
                                    header={<Text strong>Similar Colleges (Same State & Course(s))</Text>}
                                    bordered
                                    dataSource={data.related}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Avatar size="small" icon={<BankOutlined />} />}
                                                title={<a href={`/college/${item._id}`}>{item.name}</a>}
                                                description={`${item.city}, ${item.state}, ${item.country}`}
                                            />
                                        </List.Item>
                                    )}
                                    style={{ "marginTop": "20px" }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        );
}

export default College;
