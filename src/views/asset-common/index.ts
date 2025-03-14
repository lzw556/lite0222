import { AssetModel, AssetRow } from './types';
import { isWindRelated } from '../app-wind-turbine';
import { isArea, isCorrosionRelated, isVibrationRelated } from '../asset-variant';
import { isMonitoringPoint } from './monitoring-point';
import { getColorByValue, getLabelByValue } from './assetStatus';
import { resolveDescendant, resolveStatus } from './utils/statistics';

export * from '../home/tree';
export * from './components';
export * from './monitoring-point';
export * from './constants';
export * from './services';
export * from './types';

export const Asset = {
  Assert: {
    isArea,
    isWindRelated,
    isMonitoringPoint,
    isVibrationRelated,
    isCorrosionRelated
  },
  convert: (values?: AssetRow): AssetModel | null => {
    if (!values) return null;
    return {
      id: values.id,
      name: values.name,
      parent_id: values.parentId,
      type: values.type,
      attributes: values.attributes
    };
  },
  Statistics: {
    resolveDescendant,
    resolveStatus
  },
  Status: {
    getLabelByValue,
    getColorByValue
  }
};
