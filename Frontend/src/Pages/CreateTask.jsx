import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Input, Select, Tag, Form, Layout, Menu, Avatar, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, HomeOutlined, FileDoneOutlined, LogoutOutlined } from '@ant-design/icons';
import './create.css';
import { useNavigate } from 'react-router';

const { Option } = Select;
const { Sider, Content } = Layout;

const CreateTask = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();
  const [statusCounts, setStatusCounts] = useState({
    "To Do": 0,
    "In Progress": 0,
    "Completed": 0,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const apiUrl = import.meta.env.VITE_API_TASK_BASE_URL;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/todos/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedTasks = Array.isArray(response?.data?.data) ? response.data.data : [];
      setTasks(fetchedTasks);
      updateStatusCounts(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const updateStatusCounts = (tasks) => {
    const counts = {
      "To Do": 0,
      "In Progress": 0,
      "Completed": 0,
    };
    tasks.forEach(task => {
      if (counts[task.completed] !== undefined) {
        counts[task.completed]++;
      }
    });
    setStatusCounts(counts);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTask) {
        await axios.put(`${apiUrl}/todos/edit/${editingTask._id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Task updated successfully!');
      } else {
        await axios.post(`${apiUrl}/todos/add`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Task created successfully!');
      }
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      message.error('Something went wrong!');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
    form.setFieldsValue({
      title: task.title,
      description: task.description,
      completed: task.completed,
    });
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${apiUrl}/todos/delete/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Task deleted successfully!');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      message.error('Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const resetForm = () => {
    form.resetFields();
    setEditingTask(null);
    setShowForm(false);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'completed',
      key: 'completed',
      render: (completed) => (
        <Tag color={completed === 'Completed' ? 'green' : completed === 'In Progress' ? 'blue' : 'red'}>
          {completed}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, task) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(task)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(task._id)} danger />
        </div>
      ),
    },
  ];

  const pieData = {
    labels: ['To Do', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Task Status',
        data: [statusCounts["To Do"], statusCounts["In Progress"], statusCounts["Completed"]],
        backgroundColor: ['#f87171', '#60a5fa', '#4ade80'],
        borderColor: ['#f87171', '#60a5fa', '#4ade80'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} style={{ backgroundColor: '#f4f4f4', padding: '20px' }}>
        <div className="logo" style={{ padding: '20px', textAlign: 'center' }}>
          <Avatar size={64} icon={<HomeOutlined />} />
          <h3>Task Manager</h3>
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={['2']}>
          <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => navigate('/')}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<FileDoneOutlined />}>
            Tasks
          </Menu.Item>
          <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: '0 24px 24px' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setShowForm((prev) => !prev);
                if (showForm) resetForm();
              }}
            >
              {showForm ? 'Cancel' : editingTask ? 'Edit Task' : 'Create New Task'}
            </Button>
          </div>

          {/* Pie Chart Centered */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '250px' }}>
              <Pie data={pieData} />
            </div>
          </div>

          {showForm && (
            <div style={{
              maxWidth: '500px',
              margin: '0 auto',
              padding: '2rem',
              border: '1px solid #ccc',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#fff',
              marginBottom: '2rem',
            }}>
              <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                initialValues={{ completed: 'To Do' }}
              >
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: 'Please enter the title' }]}
                >
                  <Input placeholder="Enter task title" />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: 'Please enter the description' }]}
                >
                  <Input.TextArea placeholder="Enter task description" rows={3} />
                </Form.Item>

                <Form.Item
                  label="Status"
                  name="completed"
                  rules={[{ required: true, message: 'Please select a status' }]}
                >
                  <Select>
                    <Option value="To Do">To Do</Option>
                    <Option value="In Progress">In Progress</Option>
                    <Option value="Completed">Completed</Option>
                  </Select>
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
              </Form>
            </div>
          )}

          <Table
            dataSource={tasks}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreateTask;
