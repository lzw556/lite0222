import React from 'react';
import { TabsProps } from 'antd';
import { useSize } from 'ahooks';
import intl from 'react-intl-universal';
import { Card, Tabs } from '../../../../components';
import { FilterableAlarmRecordTable } from '../../../alarm';
import usePermission, { Permission } from '../../../../permission/permission';
import {
  AssetNavigator,
  DynamicData,
  MonitoringPointRow,
  TabBarExtraLeftContent
} from '../../../asset-common';
import { Analysis } from '../../analysis';
import { Monitor } from './monitor';
import { History } from './history';
import { Settings } from './settings';
import { ThicknessWaveData, WaveformData } from './waveformData';

export const Index = (props: { monitoringPoint: MonitoringPointRow; onSuccess: () => void }) => {
  const { monitoringPoint, onSuccess } = props;
  const { hasPermission } = usePermission();
  const { alertLevel, id, type } = monitoringPoint;

  const items: TabsProps['items'] = [
    {
      key: 'real.time.data',
      label: intl.get('real.time.data'),
      children: <Monitor {...monitoringPoint} key={id} />
    },
    {
      key: 'history',
      label: intl.get('HISTORY_DATA'),
      children: <History {...monitoringPoint} key={id} />
    }
  ];

  items.push({
    key: 'waveformData',
    label: intl.get('WAVEFORM_DATA'),
    children: (
      <DynamicData<ThicknessWaveData>
        children={(values) => <WaveformData {...{ values }} />}
        dataType='waveform'
        id={id}
        key={id}
      />
    )
  });

  items.push({
    key: 'analysis',
    label: intl.get('intelligent.analysis'),
    children: <Analysis {...monitoringPoint} key={id} />
  });

  items.push({
    key: 'alerts',
    label: intl.get('ALARM_RECORDS'),
    children: (
      <FilterableAlarmRecordTable
        sourceId={id}
        storeKey='monitoringPointAlarmRecordList'
        key={id}
      />
    )
  });
  if (hasPermission(Permission.MeasurementEdit)) {
    items.push({
      key: 'settings',
      label: intl.get('SETTINGS'),
      children: (
        <Card>
          <Settings point={monitoringPoint} onUpdateSuccess={onSuccess} />
        </Card>
      )
    });
  }

  const ref = React.useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  return (
    <Tabs
      items={items}
      noStyle={true}
      tabBarExtraContent={{
        left: (
          <TabBarExtraLeftContent alertLevel={alertLevel}>
            <AssetNavigator id={id} containerDomWidth={size?.width} type={type} />
          </TabBarExtraLeftContent>
        )
      }}
      tabListRef={ref}
      tabsRighted={true}
    />
  );
};
