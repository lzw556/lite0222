import React from 'react';
import intl from 'react-intl-universal';
import { Card, Chart, getBarPieOption, getOptions } from '../../../../components';
import { Asset, AssetRow } from '../../../asset-common';

export const MonitoringPointsStatistics = (props: { asset: AssetRow }) => {
  const { asset } = props;
  const { statistics } = asset;
  const statisticsData = Asset.Statistics.resolveStatus(
    statistics.monitoringPointNum,
    statistics.alarmNum
  ).map((s) => ({
    ...s,
    name: intl.get(s.name),
    itemStyle: { color: s.color }
  }));
  const options = getOptions({
    ...getBarPieOption(),
    title: {
      text: `${statistics.monitoringPointNum}`,
      subtext: '监测点总数',
      left: 'center',
      top: 105,
      textStyle: {
        fontSize: 30
      }
    },
    series: [
      {
        type: 'pie',
        name: '',
        radius: ['50%', '60%'],
        center: ['50%', '48%'],
        label: { show: false, formatter: '{b} {c}' },
        data: statisticsData
      }
    ]
  });

  return (
    <Card
      styles={{
        header: {
          border: 0,
          position: 'absolute',
          width: '100%',
          textAlign: 'center'
        },
        body: { height: '100%' }
      }}
      title='监测点统计'
    >
      <Chart options={options} />
    </Card>
  );
};
