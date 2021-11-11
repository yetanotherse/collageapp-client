import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb, Spin, Table, Tag, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Column } = Table;

const App = () => {
    const [ loading, setLoading ] = useState(true);
    const [colleges, setColleges] = useState({});

    let params = useParams();
    let navigate = useNavigate();

    sessionStorage.setItem('selectedMenu', '2');

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(params, 'params');
                if (Object.keys(params).length) {
                    if (Object.keys(params)[0].indexOf('course') !== -1) {
                        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/colleges/course/${params.courseId}`);
                        const json = await response.json();
                        setColleges(json);
                    } else if (Object.keys(params)[0].indexOf('state') !== -1) {
                        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/colleges/state/${params.stateId}`);
                        const json = await response.json();
                        setColleges(json);
                    } else if (Object.keys(params)[0].indexOf('query') !== -1) {
                        console.log('search', Object.keys(params));
                        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/colleges/search/${params.query}`);
                        const json = await response.json();
                        setColleges(json);
                    }
                } else {
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}`);
                    const json = await response.json();
                    setColleges(json);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log("error", error);
            }
        };
        fetchData();
    });

    const handleSubmit = (evt) => {
        navigate(`/colleges/search/${evt.target.value}`);
    }

    return loading ?
        <div className="spinner">
            <Spin size="large" />
        </div> :
        (
            <div className="Colleges">
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><a href="/">Home</a></Breadcrumb.Item>
                    <Breadcrumb.Item>Colleges</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <div className="search-form">
                        <Input
                            size="large"
                            placeholder="Search by college name (press enter to search)"
                            prefix={<SearchOutlined />}
                            onPressEnter={handleSubmit}
                        />
                    </div>
                    <Table dataSource={colleges}>
                        <Column
                            title="Name"
                            dataIndex="name"
                            key="name"
                            render={(text, record) => (
                                <Space size="middle">
                                    <a href={`/college/${record._id}`}>{record.name}</a>
                                </Space>
                            )}
                        />
                    <Column title="Year Founded" dataIndex="year_founded" key="year_founded" responsive={['md']} />
                        <Column title="City" dataIndex="city" key="city" />
                        <Column
                            title="State"
                            dataIndex="state"
                            key="state"
                            render={(text, record) => (
                                <Space size="middle">
                                    <a href={`/colleges/state/${record.state}`}>{record.state}</a>
                                </Space>
                            )}
                        />
                        <Column title="Country" dataIndex="country" key="country" />
                        <Column
                            title="Courses Offered"
                            dataIndex="courses"
                            key="courses"
                            render={courses => (
                                <>
                                {courses.map(course => (
                                    <Tag color="blue" key={course}>
                                        <a href={`/colleges/course/${course}`}>{course}</a>
                                    </Tag>
                                ))}
                                </>
                            )}
                            responsive={['md']}
                        />
                    </Table>
                </div>
            </div>
        );
}

export default App;
