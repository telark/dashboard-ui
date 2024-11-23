import React, { useState } from "react";
import { Card, Typography, Button, Tabs, Timeline } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  HistoryOutlined,
  SaveOutlined,
  ClockCircleOutlined,
  FileOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const Details: React.FC = () => {
  const { namespace } = useParams<{ namespace: string }>();

  const [syncPeriod, setSyncPeriod] = useState("Every 24 hours"); // Mock sync period

  const getStatusStyle = (status: "Active" | "Inactive") => {
    return status === "Active"
      ? { color: "#20C997", borderColor: "#20C997", icon: <CheckCircleOutlined style={{ marginRight: "4px"}} /> }
      : { color: "#999", borderColor: "#999", icon: <CloseCircleOutlined style={{ marginRight: "4px"}} /> };
  };

  const statusStyle = getStatusStyle("Active"); // Mock status for now

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start", // Align to the top of the page
        minHeight: "100vh", // Ensure full viewport height
        padding: "16px",
      }}
    >
      <Card
        style={{
          width: "75%", // Fixed width
          marginTop: "50px", // Fixed distance from top
          borderRadius: "12px",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        {/* Status Button */}
        <div style={{ position: "absolute", top: "16px", right: "16px" }}>
          <Button
            type="default"
            style={{
              color: statusStyle.color,
              borderColor: statusStyle.borderColor,
              borderRadius: "25px",
              padding: "0 12px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              marginTop: "12px" 
            }}
          >
            {statusStyle.icon} Active
          </Button>
        </div>

        {/* Tabs Section */}
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: (
                <span>
                  <InfoCircleOutlined style={{ marginRight: "8px" }} />
                  General
                </span>
              ),
              children: (
                <div style={{ padding: "5px" }}>
                  <p>
                    <InfoCircleOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                    <strong>Name:</strong> {namespace || "Namespace Name"}
                  </p>
                  <p>
                    <ClockCircleOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                    <strong>Creation Date:</strong> 2023-10-01
                  </p>
                  <p>
                    <ClockCircleOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                    <strong>Last Modification:</strong> 2023-11-01
                  </p>
                  <p>
                    <AppstoreOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                    <strong>Number of Workloads:</strong> 5
                  </p>
                  <p>
                    <FileOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                    <strong>Number of Bridges:</strong> 2
                  </p>
                </div>
              ),
            },
            {
              key: "2",
              label: (
                <span>
                  <HistoryOutlined style={{ marginRight: "8px" }} />
                  History
                </span>
              ),
              children: (
                <div style={{ padding: "5px" }}>
                  <Timeline
                    pending="Recording..."
                    style={{ marginTop: "16px" }}
                    mode="left"
                    items={[
                    {
                      label: '2015-09-01',
                      children: 'Create a services',
                    },
                    {
                      label: '2015-09-01 09:12:11',
                      children: 'Solve initial network problems',
                    },
                    {
                      children: 'Technical testing',
                    },
                    {
                      label: '2015-09-01 09:12:11',
                      children: 'Network problems being solved',
                    },
                  ]}
                  />
                </div>
              ),
            },
            {
              key: "3",
              label: (
                <span>
                  <SettingOutlined style={{ marginRight: "8px" }} />
                  Settings
                </span>
              ),
              children: (
                <div style={{ padding: "5px" }}>
                  <p>
                    <strong>Sync Period:</strong> {syncPeriod}
                  </p>
                  <Button
                    type="default"
                    icon={<SyncOutlined />}
                    onClick={() => setSyncPeriod("Every 12 hours")}
                  >
                    Change to Every 12 hours
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Details;
