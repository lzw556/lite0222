import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Card, Grid } from '../../../../components';
import { AssetRow, MonitoringPointsTable } from '../../../asset-common';
import { SettingsDetail } from '../../../asset-variant';
import { AlarmTrend } from '../../../home/alarmTrend';
import { Editor } from '../image-editor/editor';
import { MonitoringPointsStatistics } from './monitoringPointsStatistics';

export const Index = (props: { asset: AssetRow }) => {
  const { asset } = props;

  return (
    <Grid>
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
            <Editor monitoringPoints={asset.monitoringPoints ?? []} />
          </Col>
          <Col flex='300px'>
            <Card style={{ height: '100%' }} title={intl.get('BASIC_INFORMATION')}>
              <SettingsDetail settings={asset.attributes} type={asset.type} />
            </Card>
          </Col>
        </Grid>
      </Col>
      <Col span={24}>
        <MonitoringPointsTable asset={asset} enableSettingColumnsCount={false} more={false} />
      </Col>
    </Grid>
  );
};
