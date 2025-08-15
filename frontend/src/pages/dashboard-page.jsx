// src/pages/DashboardPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../services/api"

const { Option } = Select;

const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [search, setSearch] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [form] = Form.useForm();

    // Fetch tasks from API
    const fetchTasks = useCallback(async (pageNum = page, searchQuery = search) => {
        setLoading(true);
        try {
            const res = await api.get("/tasks", {
                params: { page: pageNum, limit: pageSize, search: searchQuery },
                withCredentials: true,
            });
            const data = res.data.data;
            const tasksWithKeys = data.tasks.map((t) => ({ ...t, key: t._id }));
            setTasks(tasksWithKeys);
            setTotalTasks(data.pagination.totalTasks);
        } catch (err) {
            message.error("Failed to fetch tasks.");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => {
        fetchTasks(page, search);
    }, [page, pageSize, search, fetchTasks]);

    // Open modal for create/edit
    const openModal = (task = null) => {
        setEditingTask(task);
        if (task) {
            form.setFieldsValue({
                title: task.title,
                description: task.description,
                status: task.status,
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    // Save task (create or update)
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingTask) {
                await api.patch(`/tasks/${editingTask._id}`, values, { withCredentials: true });
                message.success("Task updated successfully");
            } else {
                await api.post("/tasks", values, { withCredentials: true });
                message.success("Task created successfully");
            }
            setIsModalVisible(false);
            fetchTasks();
        } catch (err) {
            message.error("Failed to save task");
        }
    };

    // Delete task
    const handleDelete = async (id) => {
        try {
            await api.delete(`/tasks/${id}`, { withCredentials: true });
            message.success("Task deleted successfully");
            fetchTasks();
        } catch (err) {
            message.error("Failed to delete task");
        }
    };

    // Table columns
    const columns = [
        {
            title: "Sr. No.",
            dataIndex: "srNo",
            render: (_, __, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status) => {
                const colors = {
                    active: "blue",
                    "in-progress": "orange",
                    done: "green",
                };
                return <Tag color={colors[status] || "default"}>{status}</Tag>;
            },
        },
        {
            title: "Actions",
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => openModal(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
                <Input.Search
                    placeholder="Search tasks"
                    onSearch={(value) => setSearch(value)}
                    style={{ width: 300 }}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openModal()}
                >
                    Add Task
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={tasks}
                loading={loading}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: totalTasks,
                    onChange: (p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                    },
                }}
            />

            <Modal
                title={editingTask ? "Edit Task" : "Add Task"}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: "Please enter task title" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please enter task description" }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Please select task status" }]}
                    >
                        <Select>
                            <Option value="todo">To-do</Option>
                            <Option value="in-progress">In Progress</Option>
                            <Option value="done">Done</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DashboardPage;
