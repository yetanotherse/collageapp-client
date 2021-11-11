import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

import Dashboard from './components/Dashboard';
import Colleges from './components/Colleges';
import College from './components/College';
import Student from './components/Student';

const { Header, Footer, Content } = Layout;

const App = () => {

    const [menu, setMenu] = useState('1');

    // for env vars
    require('dotenv').config();

    useEffect(() => {
        setMenu(sessionStorage.getItem('selectedMenu') || '1');
    }, []);

    return (
        <div className="App">
            <Layout className="layout">
                <Header>
                    <Menu theme="dark" mode="horizontal" selectedKeys={[menu]} defaultSelectedKeys={['1']}>
                        <Menu.Item key={1}>
                            <a href="/">Dashboard</a>
                        </Menu.Item>
                        <Menu.Item key={2}>
                            <a href="/colleges">Colleges List</a>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Router>
                        <Routes>
                            <Route exact path="/" element={<Dashboard />}/>
                            <Route path="/colleges" element={<Colleges />}/>
                            <Route path="/colleges/search/:query" element={<Colleges />}/>
                            <Route path="/colleges/course/:courseId" element={<Colleges />}/>
                            <Route path="/colleges/state/:stateId" element={<Colleges />}/>
                            <Route path="/college/:collegeId" element={<College />}/>
                            <Route path="/student/:studentId" element={<Student />}/>
                        </Routes>
                    </Router>
                </Content>
                <Footer style={{ textAlign: 'center' }}>College Data Directory</Footer>
            </Layout>
        </div>
    );
}

export default App;
