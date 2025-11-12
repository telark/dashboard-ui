import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageContainer } from '../../components/shared';
import Header from '../../components/display/shared/sections/Header';
import { getAllPasskeys, deletePasskey, updatePasskey, createPasskey, registerStart } from '../../clients/auth';
import { registerPasskey } from '../../utils/auth/webauthn';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES, AUTH_INFO_MESSAGES } from '../../constants/auth';
import type { Passkey, UpdatePasskeyRequest } from '../../interfaces/auth';

const Passkeys: React.FC = () => {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPasskey, setEditingPasskey] = useState<Passkey | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  const loadPasskeys = async () => {
    setLoading(true);
    try {
      const data = await getAllPasskeys();
      setPasskeys(data);
    } catch (error) {
      message.error(AUTH_ERROR_MESSAGES.FETCH_PASSKEYS_FAILED);
      console.error('Failed to load passkeys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPasskeys();
  }, []);

  const handleDelete = async (credentialId: string) => {
    try {
      await deletePasskey(credentialId);
      message.success(AUTH_SUCCESS_MESSAGES.PASSKEY_DELETED);
      loadPasskeys();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.DELETE_PASSKEY_FAILED;
      message.error(errorMessage);
    }
  };

  const handleUpdate = async (values: { deviceName: string }) => {
    if (!editingPasskey) return;

    try {
      const updateRequest: UpdatePasskeyRequest = {
        deviceName: values.deviceName,
      };
      await updatePasskey(editingPasskey.credentialId, updateRequest);
      message.success(AUTH_SUCCESS_MESSAGES.PASSKEY_UPDATED);
      setIsEditModalVisible(false);
      setEditingPasskey(null);
      form.resetFields();
      loadPasskeys();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.UPDATE_PASSKEY_FAILED;
      message.error(errorMessage);
    }
  };

  const handleCreate = async (values: { deviceName: string }) => {
    try {
      // Step 1: Start registration - get challenge and options
      const registerStartResponse = await registerStart();

      // Extract options from nested structure if needed
      const options = registerStartResponse.options?.response || registerStartResponse;

      // Step 2: Create passkey with WebAuthn
      const credential = await registerPasskey({
        challenge: options.challenge!,
        rp: options.rp!,
        user: options.user!,
        pubKeyCredParams: options.pubKeyCredParams!,
        timeout: options.timeout,
        attestation: options.attestation,
        authenticatorSelection: options.authenticatorSelection,
      });

      // Step 3: Create passkey - verify attestation and store
      // Note: For authenticated users (already logged in), username is not needed
      const deviceType: 'platform' | 'cross-platform' = 'platform';
      await createPasskey(
        { credential },
        values.deviceName,
        deviceType,
        // Username not needed here - user is already authenticated via session token
      );

      message.success(AUTH_SUCCESS_MESSAGES.PASSKEY_CREATED);
      setIsCreateModalVisible(false);
      createForm.resetFields();
      loadPasskeys();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.CREATE_PASSKEY_FAILED;
      message.error(errorMessage);
    }
  };

  const openEditModal = (passkey: Passkey) => {
    setEditingPasskey(passkey);
    form.setFieldsValue({ deviceName: passkey.deviceName });
    setIsEditModalVisible(true);
  };

  const columns = [
    {
      title: 'Device Name',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: 'Device Type',
      dataIndex: 'deviceType',
      key: 'deviceType',
      render: (type: string) => type === 'platform' ? 'Platform' : 'Cross-Platform',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Last Used',
      dataIndex: 'lastUsedAt',
      key: 'lastUsedAt',
      render: (date: string | undefined) => date ? new Date(date).toLocaleString() : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Passkey) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Passkey"
            description="Are you sure you want to delete this passkey?"
            onConfirm={() => handleDelete(record.credentialId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Header
        subtitle="Manage your passkeys"
        primaryText="Add Passkey"
        onPrimary={() => setIsCreateModalVisible(true)}
        breadcrumbs={[{ label: 'Passkeys' }]}
        icon={<ReloadOutlined />}
      />

      <Table
        columns={columns}
        dataSource={passkeys}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Edit Passkey"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingPasskey(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            label="Device Name"
            name="deviceName"
            rules={[{ required: true, message: AUTH_ERROR_MESSAGES.MISSING_DEVICE_NAME }]}
          >
            <Input placeholder="Enter device name" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => {
                setIsEditModalVisible(false);
                setEditingPasskey(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add New Passkey"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Device Name"
            name="deviceName"
            rules={[{ required: true, message: AUTH_ERROR_MESSAGES.MISSING_DEVICE_NAME }]}
          >
            <Input placeholder="e.g. My Laptop, iPhone 13" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                Register Passkey
              </Button>
              <Button onClick={() => {
                setIsCreateModalVisible(false);
                createForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Passkeys;

