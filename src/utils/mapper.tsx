import { ApartmentOutlined } from '@ant-design/icons';

export const mapGroupersData = (data: any): any[] => {
  // Validate the response data
  if (data?.response_status !== 200 || !data.items?.items?.length) {
    throw new Error('Invalid data format from the API');
  }

  // Map the groupers data
  return data.items.items.map((item: any) => {
    const creationTimeRaw = item.fasid.source.creationTime;
    const parsedCreationTime = new Date(creationTimeRaw);
    const isValidDate = !isNaN(parsedCreationTime.getTime());

    return {
      title: item.fasid.source.name,
      status: item.cacid.status,
      numberOfWorkloads: item.cacid.workloads.length || 0,
      numberOfBridges: item.cacid.bridges?.length || 0,
      tags: [item.fasid.source.kind],
      creationTimeForTA: isValidDate ? parsedCreationTime : null,
      creationTime: isValidDate
        ? parsedCreationTime.toLocaleString()
        : 'Invalid Date',
      lastUpdateTime: isValidDate
        ? parsedCreationTime.toLocaleString()
        : 'Invalid Date',
      history: item.config?.history || [],
      sync: item.config?.sync || null,
      icon: <ApartmentOutlined style={{ fontSize: '15px', color: '#20C997' }} />,
    };
  });
};

