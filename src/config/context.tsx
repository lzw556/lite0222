import React from 'react';
import { Spin } from 'antd';
import request from '../utils/request';
import * as Corrosion from './corrosion';
import * as CorrosionWirelessHart from './corrosion-wireless-hart';
import * as Hydro from './hydro';
import * as Wind from './wind';
import * as WindPro from './windpro';
import * as Vibration from './vibration';
import * as General from './general';
import { getProject } from '../utils/session';
import { ProjectType } from '../project';

type AppType =
  | 'windTurbine'
  | 'general'
  | 'hydroTurbine'
  | 'corrosion'
  | 'corrosionWirelessHART'
  | 'windTurbinePro'
  | 'vibration'
  | 'towerBolt'
  | 'railBolt'
  | 'bridgeBolt'
  | 'temperature'
  | 'pressure'
  | 'bolt';

type ContextProps = { type: AppType; analysisEnabled?: boolean };

const AppContext = React.createContext<ContextProps>({ type: 'windTurbine' });

const useAppContext = () => React.useContext(AppContext);

export function AppProvider({ children }: { children?: JSX.Element }) {
  const [loading, setLoading] = React.useState(true);
  const [config, setConfig] = React.useState<ContextProps>();
  React.useEffect(() => {
    request
      .get<ContextProps>('webConfig')
      .then((res) => {
        if (res.data.code === 200) {
          setConfig(res.data.data);
          // setConfig({type:'vibration'});
        } else {
          throw Error(`API: webConfig occur errors`);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Spin spinning={loading}>
      {config && <AppContext.Provider value={config}>{children}</AppContext.Provider>}
    </Spin>
  );
}

//util methods

export function useAppConfig() {
  return useAppContext().type;
}

export function useAppType() {
  let appType = useAppContext().type;
  const projectType = getProject().type;
  if (appType === 'general') {
    if (projectType === ProjectType.WindPowerBoltMonitoring) {
      appType = 'windTurbinePro';
    } else if (projectType === ProjectType.HydroPowerBoltMonitoring) {
      appType = 'hydroTurbine';
    } else if (projectType === ProjectType.TowerBoltMonitoring) {
      appType = 'towerBolt';
    } else if (projectType === ProjectType.RailBoltMonitoring) {
      appType = 'railBolt';
    } else if (projectType === ProjectType.BridgeBoltMonitoring) {
      appType = 'bridgeBolt';
    } else if (projectType === ProjectType.CorrosionMonitoring) {
      appType = 'corrosion';
    } else if (projectType === ProjectType.VibrationMonitoring) {
      appType = 'vibration';
    } else if (projectType === ProjectType.TemperatureMonitoring) {
      appType = 'temperature';
    } else if (projectType === ProjectType.PressureMonitoring) {
      appType = 'pressure';
    } else if (projectType === ProjectType.BoltMonitoring) {
      appType = 'bolt';
    }
  }
  return appType;
}

export function useAppVibrationEnabled() {
  return !!useAppContext().analysisEnabled;
}

export const App = {
  getSiteName: (type: AppType) => get(type).siteName,
  getMonitoringPointTypes: (type: AppType) => get(type).monitoringPointTypes,
  getDeviceTypes: (type: AppType) => get(type).deviceTypes,
  isWindLike: (type: AppType) =>
    type === 'windTurbine' || type === 'windTurbinePro' || type === 'hydroTurbine'
};

function get(type: AppType) {
  switch (type) {
    case 'corrosion':
      return {
        siteName: Corrosion.SITE_NAME,
        monitoringPointTypes: Corrosion.MONITORING_POINTS,
        deviceTypes: Corrosion.SENSORS
      };
    case 'corrosionWirelessHART':
      return {
        siteName: CorrosionWirelessHart.SITE_NAME,
        monitoringPointTypes: CorrosionWirelessHart.MONITORING_POINTS,
        deviceTypes: CorrosionWirelessHart.SENSORS
      };
    case 'hydroTurbine':
      return {
        siteName: Hydro.SITE_NAME,
        monitoringPointTypes: Hydro.MONITORING_POINTS,
        deviceTypes: Hydro.SENSORS
      };
    case 'windTurbine':
      return {
        siteName: Wind.SITE_NAME,
        monitoringPointTypes: Wind.MONITORING_POINTS,
        deviceTypes: Wind.SENSORS
      };
    case 'windTurbinePro':
      return {
        siteName: WindPro.SITE_NAME,
        monitoringPointTypes: WindPro.MONITORING_POINTS,
        deviceTypes: WindPro.SENSORS
      };
    case 'vibration':
      return {
        siteName: Vibration.SITE_NAME,
        monitoringPointTypes: Vibration.MONITORING_POINTS,
        deviceTypes: Vibration.SENSORS
      };
    default:
      return {
        siteName: General.SITE_NAME,
        monitoringPointTypes: General.MONITORING_POINTS,
        deviceTypes: General.SENSORS
      };
  }
}
