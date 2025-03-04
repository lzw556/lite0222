import React from 'react';
import AntIcon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { ReactComponent as SVG } from './corrosion.svg';

export const Icon = (props: Partial<CustomIconComponentProps>) => {
  return <AntIcon component={() => <SVG {...props} />} />;
};
