import React from 'react';
import { Row, RowProps } from 'antd';
import { Space } from '../common';

export const Grid = React.forwardRef(function Grid(
  props: RowProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { gutter = [Space, Space], ...rest } = props;
  return <Row {...rest} gutter={gutter} ref={ref} />;
});
