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
      tags: [item.fasid.source.kind],
      creationTime: item.fasid.source.creationTime,
      lastUpdateTime: item.fasid.source.lastUpdateTime,
      history: item.config?.history || [],
      sync: item.config?.sync || null,
      icon: <ApartmentOutlined style={{ fontSize: '15px', color: DEFAULT_COLORS.SUCCESS }} />,
    };
  });
};

