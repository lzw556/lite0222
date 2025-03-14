import { lazy } from 'react';

export const Login = lazy(() => import('./login'));
export const Device = lazy(() => import('./device'));
export const DeviceDetail = lazy(() => import('./device/detail'));
export const ImportNetwork = lazy(() => import('./network/import'));
export const AlarmRecord = lazy(() => import('./alarm/record'));
export const Firmware = lazy(() => import('./firmware'));
export const User = lazy(() => import('./user'));
export const Me = lazy(() => import('./me'));
export const Role = lazy(() => import('./system/role'));
export const System = lazy(() => import('./system'));
export const Project = lazy(() => import('./project'));
export const Unauthorized = lazy(() => import('./403'));
export const NotFound = lazy(() => import('./404'));
export const ServerError = lazy(() => import('./500'));
export const ReportList = lazy(() => import('./report/list'));
export const Report = lazy(() => import('./report/detail'));
