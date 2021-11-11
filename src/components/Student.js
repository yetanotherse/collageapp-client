import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tag, Divider, Breadcrumb, Spin, Skeleton, Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Meta } = Card;

const Student = (props) => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    let params = useParams();

    sessionStorage.setItem('selectedMenu', '2');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/student/${params.studentId}`);
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

    const getStudentDescription = (student) => {
        return (
            <div>
                {data.email}
                <Divider>College</Divider>
                <a href={`/college/${data.college._id}`}>{data.college.name}</a>
                <Divider>Skills</Divider>
                {student.skills.map(skill => (
                    <Tag color="blue" key={skill}>
                        {skill}
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
                    <Breadcrumb.Item>Student</Breadcrumb.Item>
                    <Breadcrumb.Item>{data.name}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <Card
                        style={{ width: '100%', marginTop: 16 }}
                    >
                        <Skeleton loading={loading} avatar active>
                            <Meta
                                avatar={<Avatar size={128} icon={<UserOutlined />} />}
                                title={data.name}
                                description={getStudentDescription(data)    }
                            />
                        </Skeleton>
                    </Card>
                </div>
            </div>
        );
}

export default Student;
