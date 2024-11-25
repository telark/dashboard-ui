import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Button, Tabs, Timeline, Switch, message } from "antd";
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
} from "@ant-design/icons";
import TimeAgo from "../Time/TimeAgo";

import { updateGrouperSyncSettings } from "../../clients/grouper"
import { HistoryRecord } from "../../interfaces/common";
import { DEFAULT_COLORS } from "../../config";
import PrimaryButton from "../Buttons/PrimaryButton";

// Interface for the history data

const GrouperDetails: React.FC = () => {
  const location = useLocation();
  const { state } = location;

  // Default values for state
  const {
    name = "Loading...",
    status = "Inactive",
    creationTime = "N/A",
    lastUpdateTime = "N/A",
    history = [],
    sync = { mode: "manual" },
  } = state || {};

   // State variables
  const [nameState, setNameState] = useState<string>(name);
  const [statusState, setStatusState] = useState<string>(status);
  const [syncState, setSyncState] = useState(sync);
  const [historyState, setHistoryData] = useState<HistoryRecord[]>(history);
  const [isAutoSync, setIsAutoSync] = useState(sync.mode === "auto");
  const [loading, setLoading] = useState(false);
  const [initialSyncMode, setInitialSyncMode] = useState(sync.mode);

  // Determine if Save button should be enabled
  const isSaveDisabled = !(isAutoSync !== (initialSyncMode === "auto"));

  // Handle Auto Sync Toggle Change
  const handleAutoSyncChange = (checked: boolean) => {
    setIsAutoSync(checked);
  };

  // Function to determine the color based on status for the timeline
  const getTimelineColor = (status: string) => {
    if (status === "Success") {
      return DEFAULT_COLORS.SUCCESS;
    } else if (status === "Error") {
      return DEFAULT_COLORS.ERROR;
    }
    return DEFAULT_COLORS.DEFAULT;
  };  

  const handleSave = async () => {
    setLoading(true);
    try {
      
      // Determine the mode on the current state
      const mode = isAutoSync ? "auto" : "manual";
  
      // Call the API function to update settings
      const response = await updateGrouperSyncSettings(name, mode);

      // Extract the new data from the response
      const { item } = response;
      const { fasid, cacid, config } = item;

      const updatedData = {
        name: fasid.source.name,
        status: cacid.status,
        history: config.history,
        sync: config.sync,
      };

      // Store per grouper using its name as a unique key
      localStorage.setItem(`grouper-${name}`, JSON.stringify(updatedData));

      // Update component state
      setNameState(updatedData.name);
      setStatusState(updatedData.status);
      setHistoryData(updatedData.history);
      setSyncState(updatedData.sync);
      setInitialSyncMode(updatedData.sync.mode); // Update initial mode
      setIsAutoSync(updatedData.sync.mode === "auto");
  
      // Show a success message
      message.success("Sync Settings Updated Successfully!");
    
    } catch (error) {
      // Handle errors
      console.error("Error updating sync settings:", error);
      message.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  // Check State Data from Local Storage to ensure the the data is fetched when there is updates
  useEffect(() => {
    const savedData = localStorage.getItem(`grouper-${name}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setNameState(parsedData.name);
      setStatusState(parsedData.status);
      setHistoryData(parsedData.history);
      setSyncState(parsedData.sync);
      setInitialSyncMode(parsedData.sync.mode);
      setIsAutoSync(parsedData.sync.mode === "auto");
    } else {
      // If no localStorage data, fall back to passed state
      setNameState(name);
      setStatusState(status);
      setHistoryData(history);
      setSyncState(sync);
      setInitialSyncMode(sync.mode);
      setIsAutoSync(sync.mode === "auto");
    }
  }, [name]);
  
  
  
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
                            {nameState || "Grouper Name"}
                          </td>
                          <td style={{ padding: "10px", borderBottom: "1px solid #f0f0f0" }}>
                          <TimeAgo date={creationTime} />
                          </td>
                          <td style={{ padding: "10px", borderBottom: "1px solid #f0f0f0" }}>
                          <TimeAgo date={lastUpdateTime} />
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
                                color: statusState === "Active" ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.DEFAULT,
                                borderColor: statusState === "Active" ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.DEFAULT,
                                borderRadius: "25px",
                                padding: "0 12px",
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                width: "80px", // Fixed width for the button
                                justifyContent: "center", // Center the text inside the button
                              }}
                            >
                              {statusState === "Active" ? (
                                <CheckCircleOutlined style={{ marginRight: "4px" }} />
                              ) : (
                                <CloseCircleOutlined style={{ marginRight: "4px" }} />
                              )}
                              {statusState}
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
                                  color: resource.status === "Active" ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.DEFAULT,
                                  borderColor: resource.status === "Active" ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.DEFAULT,
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
                    items={historyState.map((item: HistoryRecord, index: number) => ({
                      label: <TimeAgo date={item.creationTime} />,
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
                        backgroundColor: isAutoSync ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.SWITCH_OFF,
                        borderColor: isAutoSync ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.SWITCH_OFF,
                      }}
                    />
                  </div>
        
                  {/* Save Button */}
                  <PrimaryButton
                    onClick={handleSave}
                    loading={loading}
                    loadingLabel="saving..."
                    action="Save Settings"
                    icon={<CheckCircleOutlined />}
                    disabled={isSaveDisabled}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default GrouperDetails;
