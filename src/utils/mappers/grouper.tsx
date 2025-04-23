import { ApartmentOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from "../../config";

export const mapGroupersData = (data: any): any[] => {
  if (data?.status !== 200 || !data.data?.items?.length) {
    throw new Error('Invalid data format from the API');
  }

  // Map the groupers data
  return data.data.items.map((item: any) => {
    return {
      name: item.fasid?.sourceName || 'Unknown',
      status: item.cacid?.status || 'Unknown',
      numberOfWorkloads: item.cacid?.workloads?.length || 0,
      numberOfBridges: item.cacid?.bridges?.length || 0,
      creationTime: item.fasid?.creationTime || '',
      lastUpdateTime: item.fasid?.lastUpdateTime || '',
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
    name: item.fasid.name,
    kind: item.fasid.type,
    status: item.cacid.status,
    numberOfWorkloads: item.cacid.workloads?.length || 0,
    numberOfBridges: item.cacid.bridges?.length || 0,
    creationTime: item.fasid.creationTime,
    lastUpdateTime: item.fasid.lastUpdateTime,
    history: item.config?.history || [],
    workloads: item.cacid?.workloads || [],
    bridges: item.cacid?.bridges || [],
    sync: item.config?.sync || null,
    // REMOVE the icon here — see the next issue 👇
  };
};