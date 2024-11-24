import React, { useState } from "react";
import { Card, Button, Tabs, Timeline, Switch, Select, Input, Modal, message } from "antd";
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
  FileOutlined,
  AppstoreOutlined,
  EyeOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { updateSyncSettings } from "../../clients/grouper"

const { Option } = Select;

// Interface for the history data
interface HistoryItem {
  creationTime: string;
  event: string;
  status: string;
}

const Details: React.FC = () => {
  const location = useLocation();
  const { state } = location; // Retrieve the dynamic data passed via state from GrouperCard

  // Default values for state
  const {
    title,
    status,
    creationTime,
    lastUpdateTime,
    history = [], // Default to empty array for history data if not provided
    sync = { mode: "manual", settings: { period: 1 } }, // Default sync settings
  } = state || {
    title: "Loading...",
    status: "Inactive",
    numberOfWorkloads: 0,
    numberOfBridges: 0,
    creationTime: "N/A",
    history: [], // Default empty array for history
    sync: { mode: "manual", settings: { period: 1 } }, // Default sync
  };

  // Set initial state based on sync.mode
  const [isAutoSync, setIsAutoSync] = useState(sync.mode === "auto"); // Default to true if sync.mode is 'auto'
  const [syncPeriod, setSyncPeriod] = useState(sync.settings.period.toString()); // Initialize from sync.settings
  const [customSyncPeriod, setCustomSyncPeriod] = useState(0); // Custom period for sync
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility
  

  // Function to determine the color based on status for the timeline
  const getTimelineColor = (status: string) => {
    if (status === "Success") {
      return "#20C997"; // Green for Success
    } else if (status === "Error") {
      return "#FF4D4F"; // Red for Error
    }
    return "#999"; // Default gray color for other statuses (if any)
  };

  const getStatusStyle = (status: "Active" | "Inactive") => {
    return status === "Active"
      ? { color: "#20C997", borderColor: "#20C997", icon: <CheckCircleOutlined style={{ marginRight: "4px" }} /> }
      : { color: "#999", borderColor: "#999", icon: <CloseCircleOutlined style={{ marginRight: "4px" }} /> };
  };

  const statusStyle = getStatusStyle(status);

  // Handle Auto Sync Toggle Change
  const handleAutoSyncChange = (checked: boolean) => {
    setIsAutoSync(checked);
    if (checked) {
      setSyncPeriod("1"); // Reset to default when Auto Sync is enabled
    }
  };

  // Handle Custom Sync Period Input Change
  const handleCustomSyncChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomSyncPeriod(parseInt(value));
    }
  };

  // Handle Sync Period Change
  const handleSyncPeriodChange = (value: string) => {
    if (value === "custom") {
      setModalVisible(true);
    } else {
      setSyncPeriod(value);
    }
  };

  // Handle Modal OK (Save custom sync period)
  const handleOk = () => {
    if (customSyncPeriod > 0) {
      setSyncPeriod(customSyncPeriod.toString());
      setModalVisible(false);
    } else {
      message.error("Please enter a valid custom period.");
    }
  };

  // Handle Modal Cancel (Close the modal without saving)
  const handleCancel = () => {
    setModalVisible(false);
  };

  // Track initial values of sync mode and period
  const [initialSyncMode, setInitialSyncMode] = useState(sync.mode);
  const [initialSyncPeriod, setInitialSyncPeriod] = useState(sync.settings.period.toString());

  // Compare current settings to initial settings to determine if Save button should be enabled
  const isSaveDisabled = !(isAutoSync !== (initialSyncMode === "auto") || syncPeriod !== initialSyncPeriod);
  

  const [loading, setLoading] = useState(false); // Loading state for the save button

  const handleSave = async () => {
    setLoading(true);
    try {
      // Use the current state of `isAutoSync` and `syncPeriod` (user's inputs)
      const mode = isAutoSync ? "auto" : "manual";
      const period = syncPeriod;  // This will reflect the current user-selected period
  
      const response = await updateSyncSettings(
        title,
        mode,
        period
      );
  
      message.success("Sync settings updated successfully!");
    } catch (error) {
      message.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };
  

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
                  {/* Section 1: General Information */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3>General Information</h3>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "center",
                        tableLayout: "fixed",
                        marginBottom: "-10px" // Ensures columns have fixed width
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ padding: "10px", fontWeight: "bold" }}>
                            <ApartmentOutlined style={{ marginRight: "8px" }} />
                            Name
                          </th>
                          <th style={{ padding: "10px", fontWeight: "bold" }}>
                            <ClockCircleOutlined style={{ marginRight: "8px" }} />
                            Creation Date
                          </th>
                          <th style={{ padding: "10px", fontWeight: "bold" }}>
                            <ClockCircleOutlined style={{ marginRight: "8px" }} />
                            Last Modification
                          </th>
                          <th style={{ padding: "10px", fontWeight: "bold" }}>
                            <SyncOutlined style={{ marginRight: "8px"  }} />
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: "10px", borderBottom: "1px solid #f0f0f0" }}>
                            {title || "Grouper Name"}
                          </td>
                          <td style={{ padding: "10px", borderBottom: "1px solid #f0f0f0" }}>
                            {creationTime || "2023-10-01"}
                          </td>
                          <td style={{ padding: "10px", borderBottom: "1px solid #f0f0f0" }}>
                           {lastUpdateTime || "2023-10-01"}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #f0f0f0",
                              display: "flex",
                              justifyContent: "center", // Center the content horizontally
                              alignItems: "center", // Center the content vertically
                            }}
                          >
                            <Button
                              type="default"
                              style={{
                                color: status === "Active" ? "#20C997" : "#999",
                                borderColor: status === "Active" ? "#20C997" : "#999",
                                borderRadius: "25px",
                                padding: "0 12px",
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                width: "80px", // Fixed width for the button
                                justifyContent: "center", // Center the text inside the button
                              }}
                            >
                              {status === "Active" ? (
                                <CheckCircleOutlined style={{ marginRight: "4px" }} />
                              ) : (
                                <CloseCircleOutlined style={{ marginRight: "4px" }} />
                              )}
                              {status}
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
            
                  {/* Section 2: Resources */}
                  <div>
                    <h3>Resources</h3>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "center",
                        tableLayout: "fixed", // Ensures columns have fixed width
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ padding: "10px", fontWeight: "bold" }}>
                            <AppstoreOutlined style={{ marginRight: "8px" }} />
                            Resource Name
                          </th>
                          <th style={{ padding: "10px", fontWeight: "bold" }}>
                            <FileOutlined style={{ marginRight: "8px" }} />
                            Kind
                          </th>
                          <th style={{ padding: "10px", fontWeight: "bold" }}>
                            <SyncOutlined style={{ marginRight: "8px" }} />
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Resource 1", kind: "Deployment", status: "Active" },
                          { name: "Resource 2", kind: "Service", status: "Inactive" },
                        ].map((resource, index) => (
                          <tr key={index}>
                            <td style={{ padding: "10px", borderBottom: "1px solid #f0f0f0" }}>
                              {resource.name}
                            </td>
                            <td style={{ padding: "10px", borderBottom: "1px solid #f0f0f0" }}>
                              {resource.kind}
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                borderBottom: "1px solid #f0f0f0",
                                display: "flex",
                                justifyContent: "center", // Center the content horizontally
                                alignItems: "center", // Center the content vertically
                              }}
                            >
                              <Button
                                type="default"
                                style={{
                                  color: resource.status === "Active" ? "#20C997" : "#999",
                                  borderColor: resource.status === "Active" ? "#20C997" : "#999",
                                  borderRadius: "25px",
                                  padding: "0 12px",
                                  fontSize: "12px",
                                  display: "flex",
                                  alignItems: "center",
                                  width: "80px", // Fixed width for the button
                                  justifyContent: "center", // Center the text inside the button
                                }}
                              >
                                {resource.status === "Active" ? (
                                  <CheckCircleOutlined style={{ marginRight: "4px" }} />
                                ) : (
                                  <CloseCircleOutlined style={{ marginRight: "4px" }} />
                                )}
                                {resource.status}
                              </Button>
                            </td>
                            <td style={{ padding: "10px", borderBottom: "1px solid #f0f0f0" }}>
                              <Button
                                icon={<EyeOutlined />}
                                type="link"
                                onClick={() => console.log("View details for", resource.name)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                <div
                  style={{
                    padding: "5px",
                    display: "flex", // Use flexbox for centering
                    justifyContent: "center", // Center horizontally
                    alignItems: "flex-start", // Align timeline at the top to leave space for its content
                    minHeight: "6OOpx", // Ensure there's enough space for vertical centering
                  }}
                >
                  <Timeline
                    pending="Recording..."
                    mode="left"
                    style={{
                      width: "100%", // Ensure full width up to the container
                      maxWidth: "800px", // Adjust max width if needed (ensure it doesn't stretch too much)
                    }}
                    items={history.map((item: HistoryItem, index: number) => ({
                      label: item.creationTime,
                      color: getTimelineColor(item.status),
                      children: <strong>{item.event}</strong>,
                    }))}
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <strong>Auto Sync:</strong>
                    <Switch
                      checked={isAutoSync}
                      onChange={handleAutoSyncChange}
                      checkedChildren="On"
                      unCheckedChildren="Off"
                      style={{
                        marginLeft: "10px",
                        backgroundColor: isAutoSync ? "#20C997" : "#d9d9d9",
                        borderColor: isAutoSync ? "#20C997" : "#d9d9d9",
                      }}
                    />
                  </div>
        
                  <p>
                    <strong>Sync Period (In Minutes):</strong>
                    <Select
                      value={syncPeriod}
                      onChange={handleSyncPeriodChange}
                      style={{ width: "200px", marginLeft: "10px" }}
                      disabled={!isAutoSync}
                    >
                      <Option value="1">1 Minute</Option>
                      <Option value="2">2 Minutes</Option>
                      <Option value="5">5 Minutes</Option>
                      <Option value="60">1 Hour</Option>
                      <Option value="custom">Custom</Option>
                    </Select>
                  </p>
        
                  {/* Save Button */}
                  <Button
                    type="primary"
                    icon={loading ? <LoadingOutlined /> : <CheckCircleOutlined />}
                    loading={loading}
                    onClick={handleSave}
                    disabled={isSaveDisabled} // Disable button if no changes
                    style={{ marginTop: "20px" }}
                  >
                    {loading ? "Saving..." : "Save Settings"}
                  </Button>
        
                  <Modal
                    title="Custom Sync Period"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <Input
                      value={customSyncPeriod}
                      onChange={handleCustomSyncChange}
                      placeholder="Enter custom period in minutes"
                      type="number"
                      min="1"
                    />
                  </Modal>
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
