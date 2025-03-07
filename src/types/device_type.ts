import { PROPERTY_CATEGORIES } from '../constants/properties';

export enum DeviceType {
  Gateway = 0x1,
  GatewayLora = 0x5,
  Router = 0x101,
  SA = 0x20001,
  SA_S = 0x20101,
  SAS = 0x30001,
  DS4 = 0x30003,
  DS8 = 0x30004,
  DC110 = 0x40001,
  DC110C = 0x40003,
  DC210 = 0x40101,
  DC210C = 0x40102,
  DC110H = 0x40104,
  DC110HC = 0x40105,
  DC110L = 0x40201,
  SVT220520P = 0x50104,
  SVT520C = 0x50106,
  SVT210510P = 0x50107,
  SVT510C = 0x50108,
  SVT210K = 0x50109,
  SVT210S = 0x50202,
  SVT220S1 = 0x50203,
  SVT220S3 = 0x50204,
  SVT510L = 0x5010e,
  ST100 = 0x60001,
  ST101S = 0x60101,
  ST101L = 0x60201,
  PressureGuoDa = 0x1000001,
  PressureWoErKe = 0x1000002,
  SPT510 = 0x80002,
  SQ100 = 0x90001,
  SQ110C = 0x90003
}

export namespace DeviceType {
  export function toString(type: DeviceType) {
    switch (type) {
      case DeviceType.Gateway:
        return 'DEVICE_TYPE_GATEWAY';
      case DeviceType.GatewayLora:
        return 'DEVICE_TYPE_GATEWAY_LORA';
      case DeviceType.Router:
        return 'DEVICE_TYPE_RELAY';
      case DeviceType.SA:
        return 'DEVICE_TYPE_SA';
      case DeviceType.SA_S:
        return 'DEVICE_TYPE_SA_S';
      case DeviceType.SAS:
        return 'DEVICE_TYPE_SAS';
      case DeviceType.DS4:
        return 'DEVICE_TYPE_DS4';
      case DeviceType.DS8:
        return 'DEVICE_TYPE_DS8';
      case DeviceType.DC110:
        return 'DEVICE_TYPE_DC110';
      case DeviceType.DC110C:
        return 'DEVICE_TYPE_DC110C';
      case DeviceType.DC210:
        return 'DEVICE_TYPE_DC210';
      case DeviceType.DC210C:
        return 'DEVICE_TYPE_DC210C';
      case DeviceType.DC110H:
        return 'DEVICE_TYPE_DC110H';
      case DeviceType.DC110HC:
        return 'DEVICE_TYPE_DC110HC';
      case DeviceType.DC110L:
        return 'DEVICE_TYPE_DC110L';
      case DeviceType.SVT220520P:
        return 'DEVICE_TYPE_SVT220520P';
      case DeviceType.SVT520C:
        return 'DEVICE_TYPE_SVT520C';
      case DeviceType.SVT210510P:
        return 'DEVICE_TYPE_SVT210510P';
      case DeviceType.SVT510C:
        return 'DEVICE_TYPE_SVT510C';
      case DeviceType.SVT210K:
        return 'DEVICE_TYPE_SVT210K';
      case DeviceType.SVT210S:
        return 'DEVICE_TYPE_SVT210S';
      case DeviceType.SVT220S1:
        return 'DEVICE_TYPE_SVT220S1';
      case DeviceType.SVT220S3:
        return 'DEVICE_TYPE_SVT220S3';
      case DeviceType.SVT510L:
        return 'DEVICE_TYPE_SVT510L';
      case DeviceType.ST100:
        return 'DEVICE_TYPE_ST100';
      case DeviceType.ST101S:
        return 'DEVICE_TYPE_ST101S';
      case DeviceType.ST101L:
        return 'DEVICE_TYPE_ST101L';
      case DeviceType.PressureGuoDa:
        return 'DEVICE_TYPE_GUODA_PRESSURE';
      case DeviceType.PressureWoErKe:
        return 'DEVICE_TYPE_WOERKE_PRESSURE';
      case DeviceType.SPT510:
        return 'DEVICE_TYPE_SPT510';
      case DeviceType.SQ100:
        return 'DEVICE_TYPE_SQ100';
      case DeviceType.SQ110C:
        return 'DEVICE_TYPE_SQ110C';
      default:
        return 'DEVICE_TYPE_UNKNOWN';
    }
  }

  export function getGateways() {
    return [DeviceType.Gateway, DeviceType.GatewayLora];
  }

  export function getRouters() {
    return [DeviceType.Router];
  }

  export function sensors() {
    return [
      DeviceType.SA,
      DeviceType.SA_S,
      DeviceType.SAS,
      DeviceType.DS4,
      DeviceType.DS8,
      DeviceType.DC110,
      DeviceType.DC110C,
      DeviceType.DC210,
      DeviceType.DC210C,
      DeviceType.DC110H,
      DeviceType.DC110HC,
      DeviceType.DC110L,
      DeviceType.SVT220520P,
      DeviceType.SVT520C,
      DeviceType.SVT210510P,
      DeviceType.SVT510C,
      DeviceType.SVT210K,
      DeviceType.SVT210S,
      DeviceType.SVT220S1,
      DeviceType.SVT220S3,
      DeviceType.SVT510L,
      DeviceType.ST100,
      DeviceType.ST101S,
      DeviceType.ST101L,
      DeviceType.PressureGuoDa,
      DeviceType.PressureWoErKe,
      DeviceType.SPT510,
      DeviceType.SQ100,
      DeviceType.SQ110C
    ];
  }

  export function isMultiChannel(type: number): boolean;
  export function isMultiChannel(
    type: number,
    returnChannels: boolean
  ): { label: string; value: number }[];
  export function isMultiChannel(type: number, returnChannels: boolean = false) {
    const channels = [1, 2, 3, 4, 5, 6, 7, 8].map((v) => ({ label: v.toString(), value: v }));
    const is4Channel = type === DeviceType.DS4;
    const is8Channel = type === DeviceType.DS8;
    if (returnChannels) {
      if (is4Channel) return channels.filter((c) => c.value < 5);
      if (is8Channel) return channels;
      return [];
    }
    return is4Channel || is8Channel;
  }

  export function isWiredSensor(type: number) {
    return (
      type === DeviceType.SA_S ||
      (isMultiChannel(type) as boolean) ||
      type === DeviceType.SVT210S ||
      type === DeviceType.SVT220S1 ||
      type === DeviceType.SVT220S3 ||
      type === DeviceType.ST101S
    );
  }

  export function isWiredDevice(type: number) {
    return isGateway(type) || isWiredSensor(type);
  }

  export function isSPT(type: number) {
    return type === DeviceType.SPT510;
  }

  export function hasDeviceSettings(type: number) {
    return type !== DeviceType.Router;
  }

  export function isRootDevice(type: number) {
    return isGateway(type) || isMultiChannel(type) || isCat1(type);
  }

  export function isGateway(type: number) {
    return type === DeviceType.Gateway || type === DeviceType.GatewayLora;
  }

  export function isSensor(type: number) {
    return sensors().includes(type);
  }

  function isCat1(type: number) {
    return (
      type === DeviceType.DC110C ||
      type === DeviceType.DC210C ||
      type === DeviceType.DC110HC ||
      type === DeviceType.SVT520C ||
      type === DeviceType.SVT510C ||
      type === DeviceType.SQ110C
    );
  }

  export function canSupportingCalibrate(type: number) {
    return (
      type === DeviceType.SAS ||
      DeviceType.isMultiChannel(type) ||
      type === DeviceType.DC110 ||
      type === DeviceType.DC110C ||
      type === DeviceType.DC210 ||
      type === DeviceType.DC210C ||
      type === DeviceType.DC110H ||
      type === DeviceType.DC110HC ||
      type === DeviceType.DC110L ||
      type === DeviceType.PressureGuoDa ||
      type === DeviceType.PressureWoErKe ||
      type === DeviceType.SPT510 ||
      DeviceType.isVibration(type)
    );
  }

  export function hasGroupedSettings(type: number) {
    return (type === DeviceType.SAS || isMultiChannel(type)) && !isVibration(type);
  }

  export function getNonSensorDeviceTypes() {
    return [DeviceType.Gateway, DeviceType.GatewayLora, DeviceType.Router];
  }

  export function isVibration(type: DeviceType | undefined) {
    switch (type) {
      case DeviceType.SVT220520P:
      case DeviceType.SVT520C:
      case DeviceType.SVT210510P:
      case DeviceType.SVT510C:
      case DeviceType.SVT210K:
      case DeviceType.SVT210S:
      case DeviceType.SVT220S1:
      case DeviceType.SVT220S3:
      case DeviceType.SVT510L:
        return true;
    }
    return false;
  }

  export function vibrationSensors() {
    return [
      DeviceType.SVT220520P,
      DeviceType.SVT520C,
      DeviceType.SVT210510P,
      DeviceType.SVT510C,
      DeviceType.SVT210K,
      DeviceType.SVT210S,
      DeviceType.SVT220S1,
      DeviceType.SVT220S3,
      DeviceType.SVT510L
    ];
  }

  export function isSVTLora(type: number) {
    return type === DeviceType.SVT510L;
  }
}

export const SENSOR_DISPLAY_PROPERTIES = {
  [DeviceType.SA]: PROPERTY_CATEGORIES.SA,
  [DeviceType.SA_S]: PROPERTY_CATEGORIES.SA,
  [DeviceType.SAS]: PROPERTY_CATEGORIES.SAS,
  [DeviceType.DS4]: PROPERTY_CATEGORIES.DS,
  [DeviceType.DS8]: PROPERTY_CATEGORIES.DS,
  [DeviceType.DC110]: PROPERTY_CATEGORIES.DC_NORMAL,
  [DeviceType.DC110C]: PROPERTY_CATEGORIES.DC_NORMAL,
  [DeviceType.DC210]: PROPERTY_CATEGORIES.DC_HIGH,
  [DeviceType.DC210C]: PROPERTY_CATEGORIES.DC_HIGH,
  [DeviceType.DC110H]: PROPERTY_CATEGORIES.DC_HIGH,
  [DeviceType.DC110HC]: PROPERTY_CATEGORIES.DC_HIGH,
  [DeviceType.DC110L]: PROPERTY_CATEGORIES.DC_NORMAL,
  [DeviceType.SVT220520P]: PROPERTY_CATEGORIES.SVT220520P,
  [DeviceType.SVT520C]: PROPERTY_CATEGORIES.SVT220520P,
  [DeviceType.SVT210510P]: PROPERTY_CATEGORIES.SVT210510P,
  [DeviceType.SVT510C]: PROPERTY_CATEGORIES.SVT210510P,
  [DeviceType.SVT210K]: PROPERTY_CATEGORIES.SVT210K,
  [DeviceType.SVT210S]: PROPERTY_CATEGORIES.SVT220S1S3,
  [DeviceType.SVT220S1]: PROPERTY_CATEGORIES.SVT220S1S3,
  [DeviceType.SVT220S3]: PROPERTY_CATEGORIES.SVT220S1S3,
  [DeviceType.SVT510L]: PROPERTY_CATEGORIES.SVT220S1S3,
  [DeviceType.ST100]: PROPERTY_CATEGORIES.ST,
  [DeviceType.ST101S]: PROPERTY_CATEGORIES.ST,
  [DeviceType.ST101L]: PROPERTY_CATEGORIES.ST,
  [DeviceType.SPT510]: PROPERTY_CATEGORIES.SPT,
  [DeviceType.SQ100]: PROPERTY_CATEGORIES.SQ,
  [DeviceType.SQ110C]: PROPERTY_CATEGORIES.SQ
};

const SVT_SENSOR_TYPES = [16842753, 16842758, 16842759];

export const SVT_DEVICE_TYPE_SENSOR_TYPE_MAPPING = {
  [DeviceType.SVT220520P]: SVT_SENSOR_TYPES[1],
  [DeviceType.SVT520C]: SVT_SENSOR_TYPES[1],
  [DeviceType.SVT210510P]: SVT_SENSOR_TYPES[0],
  [DeviceType.SVT510C]: SVT_SENSOR_TYPES[0],
  [DeviceType.SVT210K]: SVT_SENSOR_TYPES[0],
  [DeviceType.SVT210S]: SVT_SENSOR_TYPES[0],
  [DeviceType.SVT220S1]: SVT_SENSOR_TYPES[2],
  [DeviceType.SVT220S3]: SVT_SENSOR_TYPES[1],
  [DeviceType.SVT510L]: SVT_SENSOR_TYPES[1]
};
