import React from 'react';
import { Space, Tabs } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, LightSelectFilter } from '../../../components';
import { Property, useProperties } from './useTrend';
import { TimeDomain } from './timeDomain';
import { useOriginalDomain } from './useOriginalDomain';
import { Frequency } from './frequency';
import { TimeDomainData, useTimeDomain } from './useTimeDomain';
import { TimeEnvelope } from './timeEnvelope';
import { Envelope } from './envelope';
import { Power } from './power';
import { Cepstrum } from './cepstrum';
import { Zoom } from './zoom';
import { Axis, useAxis } from './useAxis';
import { Cross } from './cross';
import { TimeFrequency } from './timeFrequency';

export type AnalysisCommonProps = {
  id: number;
  timestamp: number;
  axis: Axis;
  property: Property;
  timeDomain?: { loading: boolean; data?: TimeDomainData };
  originalDomain?: OriginalDomainResponse;
};

export type OriginalDomainResponse = {
  frequency: number;
  fullScale: number;
  number: number;
  range: number;
  values: number[];
  xAxis: number[];
};

export const AnalysisContent = (props: Omit<AnalysisCommonProps, 'axis' | 'property'>) => {
  const [activeKey, setActiveKey] = React.useState('time-domain');
  const { property, properties, setProperties } = useProperties(
    activeKey === 'time-envelope' || activeKey === 'envelope' ? 'acceleration' : undefined
  );
  const { axis, axies, setAxies } = useAxis();
  const timeDomain = useTimeDomain({ ...props, axis, property });
  const originalDomain = useOriginalDomain(props.id, props.timestamp, axis.value);

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      items={[
        {
          key: 'time-domain',
          label: 'time.domain',
          children: (
            <ChartMark.Context>
              <TimeDomain {...{ ...props, axis, property, timeDomain }} />
            </ChartMark.Context>
          )
        },
        {
          key: 'frequency',
          label: 'spectrum',
          children: (
            <ChartMark.Context>
              <Frequency {...{ ...props, axis, property, timeDomain, originalDomain }} />
            </ChartMark.Context>
          )
        },
        {
          key: 'time-envelope',
          label: 'time.envelope',
          children: (
            <ChartMark.Context>
              <TimeEnvelope {...{ ...props, axis, property, originalDomain }} />
            </ChartMark.Context>
          )
        },
        {
          key: 'envelope',
          label: 'envelope.spectrum',
          children: (
            <ChartMark.Context>
              <Envelope {...{ ...props, axis, property, timeDomain, originalDomain }} />
            </ChartMark.Context>
          )
        },
        {
          key: 'power',
          label: 'power.spectrum',
          children: (
            <ChartMark.Context>
              <Power {...{ ...props, axis, property, originalDomain }} />
            </ChartMark.Context>
          )
        },
        {
          key: 'cross',
          label: 'cross.spectrum',
          children: (
            <ChartMark.Context>
              <Cross {...{ ...props, axis, property, originalDomain }} />
            </ChartMark.Context>
          )
        },
        {
          key: 'zoom',
          label: 'zoom.fft',
          children: (
            <ChartMark.Context>
              <Zoom {...{ ...props, axis, property, originalDomain }} />
            </ChartMark.Context>
          )
        },
        {
          key: 'cepstrum',
          label: 'cepstrum',
          children: (
            <ChartMark.Context>
              <Cepstrum {...{ ...props, axis, property, originalDomain }} />
            </ChartMark.Context>
          )
        },
        {
          key: 'time-frequency',
          label: 'stft',
          children: (
            <ChartMark.Context>
              <TimeFrequency {...{ ...props, axis, property, originalDomain }} />
            </ChartMark.Context>
          )
        }
      ].map((item) => ({ ...item, label: intl.get(item.label) }))}
      tabBarExtraContent={
        <Space>
          <LightSelectFilter
            allowClear={false}
            options={properties.map((p) => ({ ...p, label: intl.get(p.label) }))}
            onChange={(value) =>
              setProperties((prev) => prev.map((p) => ({ ...p, selected: p.value === value })))
            }
            value={property.value}
          />
          <LightSelectFilter
            allowClear={false}
            options={axies.map((a) => ({ ...a, label: intl.get(a.label) }))}
            onChange={(value) =>
              setAxies((prev) => prev.map((a) => ({ ...a, selected: a.value === value })))
            }
            value={axis.value}
          />
        </Space>
      }
    />
  );
};
