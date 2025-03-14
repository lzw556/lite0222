import React from 'react';
import { Col, Empty, Spin } from 'antd';
import { ChartMark, Card, Flex, Grid } from '../../../components';
import { RangeDatePicker } from '../../../components/rangeDatePicker';
import dayjs from '../../../utils/dayjsUtils';
import { TrendData } from '../../asset-common';
import { useDateRange, useTrendData } from './useTrend';
import { AnalysisContent } from './analysisContent';
import { Trend } from './trend';

export const Index = ({ id }: { id: number }) => {
  const { range, setRange } = useDateRange();
  const { loading, data } = useTrendData(id, range);

  return (
    <Grid>
      <Col span={24}>
        <Card>
          <Flex>
            <RangeDatePicker onChange={setRange} />
          </Flex>
        </Card>
      </Col>
      <Col span={24}>
        <Spin spinning={loading}>
          <Content data={data} id={id} key={JSON.stringify(data)} />
        </Spin>
      </Col>
    </Grid>
  );
};

function Content({ data, id }: { data: TrendData[]; id: number }) {
  const [selected, setSelected] = React.useState<number | undefined>(
    data.find((d) => !!d.selected)?.timestamp
  );
  const lines: string[] = [];
  if (selected) {
    lines.push(dayjs.unix(selected).local().format('YYYY-MM-DD HH:mm:ss'));
  }
  if (lines.length === 0) {
    return (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  } else {
    return (
      <Grid>
        <Col span={24}>
          <ChartMark.Context
            initial={{
              cursor: 'line',
              marks: lines.map((line) => ({ name: line, data: line }))
            }}
          >
            <Trend data={data} onClick={setSelected} />
          </ChartMark.Context>
        </Col>
        {selected && (
          <Col span={24}>
            <AnalysisContent id={id} timestamp={selected} key={selected} />
          </Col>
        )}
      </Grid>
    );
  }
}
