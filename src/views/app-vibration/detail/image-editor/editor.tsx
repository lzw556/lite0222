import React from 'react';
import { useSize } from 'ahooks';
import { Card } from '../../../../components';
import { MonitoringPointRow } from '../../../asset-common';
import { Canvas } from './canvas';

export const Editor = ({ monitoringPoints }: { monitoringPoints: MonitoringPointRow[] }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const containerSize = useSize(ref);
  const size = containerSize
    ? { width: containerSize.width, height: containerSize.height }
    : { width: 900, height: 600 };

  return (
    <Card
      ref={ref}
      style={{ position: 'relative', height: '100%', minHeight: 600 }}
      styles={{ body: { padding: 0 } }}
    >
      <Canvas size={size}>{() => <></>}</Canvas>
    </Card>
  );
};
