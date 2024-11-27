import { ApartmentOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from "../../config";

export const mapGroupersData = (data: any): any[] => {
  // Validate the response data
  if (data?.response_status !== 200 || !data.items?.items?.length) {
    throw new Error('Invalid data format from the API');
  }

  // Map the groupers data
  return data.items.items.map((item: any) => {
    return {
      name: item.fasid.source.name,
      status: item.cacid.status,
      numberOfWorkloads: item.cacid.workloads.length || 0,
      numberOfBridges: item.cacid.bridges?.length || 0,
      creationTime: item.fasid.source.creationTime,
      lastUpdateTime: item.fasid.source.lastUpdateTime,
      history: item.config?.history || [],
      workloads: item.cacid?.workloads || [],
      bridges: item.cacid?.bridges || [],
      sync: item.config?.sync || null,
      icon: <ApartmentOutlined style={{ fontSize: '15px', color: DEFAULT_COLORS.SUCCESS }} />,
    };
  });
};

export const mapSingleGrouperData = (item: any): any => {
  if (!item || !item.fasid || !item.cacid || !item.config) {
    throw new Error("Missing expected data in the response.");
  }

  return {
    name: item.fasid.source.name,
    status: item.cacid.status,
    numberOfWorkloads: item.cacid.workloads?.length || 0,
    numberOfBridges: item.cacid.bridges?.length || 0,
    creationTime: item.fasid.source.creationTime,
    lastUpdateTime: item.fasid.source.lastUpdateTime,
    history: item.config?.history || [],  // Default to empty array if undefined
    workloads: item.cacid?.workloads || [],  // Default to empty array if undefined
    bridges: item.cacid?.bridges || [],  // Default to empty array if undefined
    sync: item.config?.sync || null,  // Default to null if undefined
    icon: <ApartmentOutlined style={{ fontSize: '15px', color: DEFAULT_COLORS.SUCCESS }} />,
  };
};


