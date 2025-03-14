import React from 'react';
import { TabsProps } from 'antd';
import { useSize } from 'ahooks';
import intl from 'react-intl-universal';
import { Card, Tabs } from '../../../../components';
import { FilterableAlarmRecordTable } from '../../../alarm';
import usePermission, { Permission } from '../../../../permission/permission';
import { MonitoringPointTypeValue } from '../../../../config';
import {
  AssetNavigator,
  DynamicData,
  MonitoringPointRow,
  Point,
  TabBarExtraLeftContent
} from '../../../asset-common';
import { Monitor } from './monitor';
import { History } from './history';
import { Preload } from './dynamic/preload';
import { Angle } from './dynamic/angle';
import { AngleBase } from './dynamic/angleBase';
import { PreloadWaveform } from './preloadWaveform';
import { Settings } from './settings';
import { AngleDynamicData, PreloadDynamicData, PreloadWaveData } from './dynamic/types';

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
  if (Point.Assert.isPreload(type)) {
    items.push({
      key: 'dynamicData',
      label: intl.get('DYNAMIC_DATA'),
      children: (
        <DynamicData<PreloadDynamicData>
          children={(values) => <Preload {...{ values }} />}
          dataType='raw'
          id={id}
          key={id}
        />
      )
    });
  } else if (type === MonitoringPointTypeValue.TopInclination) {
    items.push({
      key: 'dynamicData',
      label: intl.get('DYNAMIC_DATA'),
      children: (
        <DynamicData<AngleDynamicData>
          children={(values) => <Angle {...{ values, monitoringPoint }} />}
          dataType='raw'
          id={id}
          key={id}
        />
      )
    });
  } else if (type === MonitoringPointTypeValue.BaseInclination) {
    items.push({
      key: 'dynamicData',
      label: intl.get('DYNAMIC_DATA'),
      children: (
        <DynamicData<AngleDynamicData>
          children={(values) => <AngleBase {...{ values, monitoringPoint }} />}
          dataType='raw'
          id={id}
          key={id}
        />
      )
    });
  }
  if (Point.Assert.isPreload(type)) {
    items.push({
      key: 'waveformData',
      label: intl.get('WAVEFORM_DATA'),
      children: (
        <DynamicData<PreloadWaveData>
          children={(values) => <PreloadWaveform {...{ values }} />}
          dataType='waveform'
          id={id}
          key={id}
        />
      )
    });
  }
  items.push({
    key: 'alerts',
    label: intl.get('ALARM_RECORDS'),
    children: (
      <FilterableAlarmRecordTable
        sourceId={monitoringPoint.id}
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
