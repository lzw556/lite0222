import * as React from 'react';
import { Button, Input, Popconfirm, Space, Tag, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { PageResult } from '../../../types/page';
import dayjs from '../../../utils/dayjsUtils';
import { RangeDatePicker, oneWeekNumberRange } from '../../../components/rangeDatePicker';
import { LightSelectFilter, Table, transformPagedresult } from '../../../components';
import { PagingAlarmRecordRequest, RemoveAlarmRecordRequest } from '../../../apis/alarm';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { Store, useStore } from '../../../hooks/store';
import { pickOptionsFromNumericEnum } from '../../../utils';
import { App, useAppType } from '../../../config';
import { getAlarmDetail } from '../alarm-group';
import { MONITORING_POINT } from '../../asset-common';
import { alarmLevelOptions, AlarmLevelTag } from '..';

enum Status {
  UnProcessd = 0,
  AutoProcessd = 2
}

export const FilterableAlarmRecordTable: React.FC<{
  sourceId?: number;
  storeKey?: 'alarmRecordList' | 'monitoringPointAlarmRecordList';
  showTitle?: boolean;
}> = ({ sourceId, storeKey = 'alarmRecordList', showTitle }) => {
  const [dataSource, setDataSource] = React.useState<PageResult<any[]>>();
  const [status, setStatus] = React.useState<Status[]>([]);
  const [store, setStore, gotoPage] = useStore(storeKey);
  const [range, setRange] = React.useState<[number, number]>(oneWeekNumberRange);
  const statusOptions = pickOptionsFromNumericEnum(Status, 'alarm.record').map(
    ({ label, value }) => ({ text: intl.get(label), value })
  );
  const [alarmName, setAlarmName] = React.useState<string | undefined>();
  const appType = useAppType();
  const [monitoringPointType, setMontoringPointType] = React.useState<number[]>([]);

  const fetchAlarmRecords = (
    alarmName: string | undefined,
    monitoringPointType: number[],
    status: Status[],
    store: Store['alarmRecordList'],
    range: [number, number],
    sourceId?: number
  ) => {
    const {
      pagedOptions: { index, size },
      alertLevels
    } = store;
    const filters: any = {};
    if (alarmName) {
      filters.monitoring_point_name_like = alarmName;
    }
    if (monitoringPointType.length > 0) {
      filters.monitoring_point_types = monitoringPointType.join(',');
    }
    if (alertLevels.length > 0) {
      filters.levels = alertLevels.join(',');
    }
    if (status && status.length > 0) {
      filters.status = status.join(',');
    }
    if (range) {
      const [from, to] = range;
      PagingAlarmRecordRequest(index, size, from, to, filters, sourceId).then((res) => {
        setDataSource({
          page: res.page,
          size: res.size,
          total: res.total,
          result: res.result
            .sort((prev: any, next: any) => prev.alarmRuleGroupId - next.alarmRuleGroupId)
            .filter((r: any) => r.status !== 1)
        });
      });
    }
  };

  React.useEffect(() => {
    fetchAlarmRecords(alarmName, monitoringPointType, status, store, range, sourceId);
  }, [alarmName, monitoringPointType, status, sourceId, store, range]);

  const onDelete = (id: number) => {
    RemoveAlarmRecordRequest(id).then((_) => {
      if (dataSource) {
        const { size, page, total } = dataSource;
        gotoPage({ size, total, index: page }, 'prev');
      }
    });
  };

  const columns: any = [
    {
      title: intl.get('ALARM_NAME'),
      dataIndex: 'alarmRuleGroupName',
      key: 'alarmRuleGroupName',
      width: 200,
      render: (name: string, record: any) => {
        return record.alarmRuleGroupId === 0 ? '已删除' : name;
      }
    },
    {
      title: intl.get('ALARM_LEVEL'),
      dataIndex: 'level',
      key: 'level',
      filters: alarmLevelOptions.map((o) => ({ ...o, text: intl.get(o.label) })),
      width: 120,
      render: (level: number) => <AlarmLevelTag level={level} />
    },
    {
      title: intl.get('ALARM_SOURCE'),
      dataIndex: 'source',
      key: 'source',
      render: (source: any) => {
        if (source) {
          return source.name;
        }
        return intl.get('UNKNOWN_SOURCE');
      }
    },
    {
      title: intl.get('ALARM_DETAIL'),
      dataIndex: 'metric',
      key: 'metric',
      render: (metric: any, record: any) => getAlarmDetail(record, metric)
    },
    {
      title: intl.get('ALARM_TIMESTAMP'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (createdAt: number) => {
        return dayjs.unix(createdAt).local().format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: intl.get('ALARM_DURATION'),
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
      render: (_: any, record: any) => {
        switch (record.status) {
          case 1:
          case 2:
            return dayjs
              .unix(record.createdAt)
              .local()
              .from(dayjs.unix(record.updatedAt).local(), true);
          default:
            return dayjs.unix(record.createdAt).local().fromNow(true);
        }
      }
    },
    {
      title: intl.get('ALARM_STATUS'),
      dataIndex: 'status',
      key: 'status',
      filters: statusOptions,
      width: 120,
      render: (status: Status) => {
        const text = statusOptions.find((option) => option.value === status)?.text;
        return <Tag color={status === Status.AutoProcessd ? 'success' : undefined}>{text}</Tag>;
      }
    },
    {
      title: intl.get('OPERATION'),
      key: 'action',
      width: 80,
      render: (_: any, record: any) => {
        return (
          <Space>
            <HasPermission value={Permission.AlarmRecordDelete}>
              <Popconfirm
                placement='left'
                title={intl.get('DELETE_ALARM_RECORD_PROMPT')}
                onConfirm={() => onDelete(record.id)}
                okText={intl.get('DELETE')}
                cancelText={intl.get('CANCEL')}
              >
                <Button type='text' size='small' icon={<DeleteOutlined />} danger />
              </Popconfirm>
            </HasPermission>
          </Space>
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <Table
      columns={columns}
      dataSource={ds}
      onChange={(paged, filters) => {
        const _filters = filters as { level: number[]; status: Status[] };
        setStore((prev) => ({ ...prev, alertLevels: _filters?.level ?? [] }));
        setStatus(_filters?.status ?? []);
      }}
      header={{
        title: showTitle && intl.get('ALARM_RECORDS'),
        toolbar: [
          <>
            <Input
              onBlur={(e) => setAlarmName(e.target.value)}
              prefix={<Typography.Text type='secondary'>{intl.get('ALARM_NAME')}</Typography.Text>}
            />
            <LightSelectFilter
              maxTagCount={2}
              mode='multiple'
              onChange={setMontoringPointType}
              options={App.getMonitoringPointTypes(appType).map(({ label, id }) => ({
                label: intl.get(label),
                value: id
              }))}
              prefix={intl.get('OBJECT_TYPE', { object: intl.get(MONITORING_POINT) })}
            />
            <RangeDatePicker onChange={setRange} />
          </>
        ]
      }}
      pagination={{
        ...paged,
        onChange: (index, size) => setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
      }}
      rowKey={(row) => row.id}
    />
  );
};
