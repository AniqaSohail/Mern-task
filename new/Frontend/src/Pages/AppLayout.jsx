import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  const handleLogout = () => {
    // Implement your logout functionality here
    console.log('Logging out...');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 100 }}>
        <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
          <Menu.Item key="1">
            <Link to="/create-task">Create Task</Link>
          </Menu.Item>
          {/* Add more menu items here */}
        </Menu>

        {/* Logout Button at the bottom of the sidebar */}
        <div style={{ position: 'absolute', bottom: '24px', width: '100%' }}>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ width: '100%' }}
          >
            Logout
          </Button>
        </div>
      </Sider>

      <Layout style={{ marginLeft: 200, minHeight: '100vh' }}> {/* Ensure content has space to the left */}
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
