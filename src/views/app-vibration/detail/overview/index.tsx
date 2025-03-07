import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Card, Grid } from '../../../../components';
import { AssetRow, MonitoringPointsTable } from '../../../asset-common';
import { SettingsDetail } from '../../../asset-variant';
import { AlarmTrend } from '../../../home/alarmTrend';
import { PositionImage } from './positionImage';
import { MonitoringPointsStatistics } from './monitoringPointsStatistics';
import { useSize } from 'ahooks';

export const Index = (props: { asset: AssetRow }) => {
  const { asset } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const render = () => {
    if (size && size.width > 1400) {
      return (
        <Col span={24}>
          <Grid wrap={false}>
            <Col flex='320px'>
              <Grid>
                <Col span={24}>
                  <MonitoringPointsStatistics {...props} />
                </Col>
                <Col span={24}>
                  <AlarmTrend id={asset.id} title={intl.get('ALARM_TREND')} />
                </Col>
              </Grid>
            </Col>
            <Col flex='auto'>
              <PositionImage />
            </Col>
            <Col flex='300px'>
              <Card style={{ height: '100%' }} title={intl.get('BASIC_INFORMATION')}>
                <SettingsDetail settings={asset.attributes} type={asset.type} />
              </Card>
            </Col>
          </Grid>
        </Col>
      );
    } else {
      return (
        <>
          <Col span={24}>
            <PositionImage />
          </Col>
          <Col span={24}>
            <Grid>
              <Col span={8}>
                <MonitoringPointsStatistics {...props} />
              </Col>
              <Col span={8}>
                <AlarmTrend id={asset.id} title={intl.get('ALARM_TREND')} />
              </Col>
              <Col span={8}>
                <Card style={{ height: '100%' }} title={intl.get('BASIC_INFORMATION')}>
                  <SettingsDetail settings={asset.attributes} type={asset.type} />
                </Card>
              </Col>
            </Grid>
          </Col>
        </>
      );
    }
  };

  return (
    <Grid ref={ref}>
      {render()}
      <Col span={24}>
        <MonitoringPointsTable asset={asset} enableSettingColumnsCount={false} more={false} />
      </Col>
    </Grid>
  );
};
