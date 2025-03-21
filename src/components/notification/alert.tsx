import useSocket, { SocketTopic } from '../../socket';
import { notification, Space } from 'antd';
import { useEffect, useState } from 'react';
import { getProject } from '../../utils/session';
import intl from 'react-intl-universal';
import { translateMetricName } from '../../views/alarm/alarm-group';
import { getLabelByValue } from '../../views/alarm';

const AlertMessageNotification = () => {
  const { PubSub } = useSocket();
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState();

  useEffect(() => {
    PubSub.subscribe(SocketTopic.monitoringPointAlert, (msg: string, data: any) => {
      console.log(data);
      if (
        data &&
        data.monitoringPoint &&
        data.monitoringPoint.project &&
        data.monitoringPoint.project === getProject().id
      ) {
        setData(data);
      }
    });
    return () => {
      PubSub.unsubscribe(SocketTopic.monitoringPointAlert);
    };
  }, [PubSub]);

  useEffect(() => {
    const renderNotification = (record: any) => {
      const message = intl.get('leveled.alarm', {
        alarmLevel: intl.get(getLabelByValue(record.level))
      });
      switch (record.level) {
        case 1:
          api.info({
            key: `${record.monitoringPoint.id}-${record.level}`,
            message,
            description: <div>{renderDescription(record)}</div>
          });
          break;
        case 2:
          api.warning({
            key: `${record.monitoringPoint.id}-${record.level}`,
            message,
            description: <div>{renderDescription(record)}</div>
          });
          break;
        case 3:
          api.error({
            key: `${record.monitoringPoint.id}-${record.level}`,
            message,
            description: <div>{renderDescription(record)}</div>
          });
          break;
        default:
          api.success({
            key: `${record.monitoringPoint.id}-${record.level}`,
            message: intl.get('RETURN_TO_NORMAL'),
            description: <div>{renderDescription(record)}</div>
          });
          break;
      }
    };

    const renderDescription = (record: any) => {
      return (
        <>
          <p>{`${intl.get('ALARM_MONITORING_POINTS')}: ${record.monitoringPoint.name}`}</p>
          <p>{`${intl.get('ALARM_PROPERTIES')}: ${translateMetricName(record.metric.name)}`}</p>
          <p>{`${intl.get('ALARM_VALUE')}: ${record.value}${
            record.metric.unit
              ? intl.get(record.metric.unit).d(record.metric.unit)
              : record.metric.unit
          }`}</p>
        </>
      );
    };
    if (data) {
      renderNotification(data);
    }
  }, [data, api]);

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, padding: '8px' }}>
      <Space direction={'vertical'}>{contextHolder}</Space>
    </div>
  );
};

export default AlertMessageNotification;
