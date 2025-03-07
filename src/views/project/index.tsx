import { useEffect, useState } from 'react';
import { Button, Modal, Popconfirm, Space, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Card, Table, transformPagedresult } from '../../components';
import { PageResult } from '../../types/page';
import {
  DeleteProjectRequest,
  GenProjectAccessTokenRequest,
  PagingProjectsRequest
} from '../../apis/project';
import { Project } from '../../types/project';
import HasPermission from '../../permission';
import usePermission, { Permission } from '../../permission/permission';
import { Store, useStore } from '../../hooks/store';
import { store as reduxStore } from '../../store';
import { useProjectTypeOptions } from '../../project';
import EditProjectModal from './editProjectModal';
import AllocUserDrawer from './allocUserDrawer';

const ProjectPage = () => {
  const [open, setVisible] = useState(false);
  const [allocVisible, setAllocVisible] = useState(false);
  const [dataSource, setDataSource] = useState<PageResult<any>>();
  const [project, setProject] = useState<Project>();
  const { hasPermissions } = usePermission();
  const [store, setStore, gotoPage] = useStore('projectList');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const projectTypeOptions = useProjectTypeOptions();

  const fetchProjects = (store: Store['firmwareList']) => {
    const {
      pagedOptions: { index, size }
    } = store;
    PagingProjectsRequest(index, size).then(setDataSource);
  };

  useEffect(() => {
    fetchProjects(store);
  }, [store, refreshKey]);

  const onAllocUser = (record: Project) => {
    setAllocVisible(true);
    setProject(record);
  };

  const onEdit = (record: Project) => {
    setProject(record);
    setVisible(true);
  };

  const onDelete = (id: number) => {
    DeleteProjectRequest(id).then(() => {
      reduxStore.dispatch({
        type: 'SET_PROJECT',
        payload: { id: 0 }
      });
      if (dataSource) {
        const { size, page, total } = dataSource;
        gotoPage({ size, total, index: page }, 'prev');
      }
      window.location.reload();
    });
  };

  const onGenAccessToken = (id: number) => {
    GenProjectAccessTokenRequest(id).then((_) => {
      setRefreshKey(refreshKey + 1);
    });
  };

  const onViewAccessToken = (token: string) => {
    Modal.info({
      title: intl.get('ACCESS_CREDENTIALS'),
      content: (
        <Card size={'small'} style={{ backgroundColor: 'rgb(37, 43, 58)' }}>
          <Typography.Text style={{ color: '#fff' }} copyable={{ text: token }}>
            {token}
          </Typography.Text>
        </Card>
      ),
      icon: null,
      okText: intl.get('OK')
    });
  };

  const columns = [
    {
      title: intl.get('PROJECT_NAME'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: intl.get('ACCESS_CREDENTIALS'),
      dataIndex: 'token',
      key: 'token',

      render: (token: string, record: Project) => {
        if (token) {
          return (
            <Button
              type={'link'}
              onClick={() => {
                onViewAccessToken(token);
              }}
            >
              {intl.get('CLICK_TO_VIEW')}
            </Button>
          );
        }
        return (
          <Button
            type={'link'}
            onClick={() => {
              onGenAccessToken(record.id);
            }}
          >
            {intl.get('CLICK_TO_GENERATE_ACCESS_CREDENTIAL')}
          </Button>
        );
      }
    },
    {
      title: intl.get('DESCRIPTION'),
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: intl.get('project.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        const label = projectTypeOptions.find((o) => o.value === type)?.label;
        return label ? intl.get(label) : '-';
      }
    },
    {
      title: intl.get('OPERATION'),
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <Space>
            {hasPermissions(Permission.ProjectAllocUser, Permission.ProjectAllocUserGet) && (
              <Button type={'link'} size={'small'} onClick={() => onAllocUser(record)}>
                {intl.get('ASSIGN_USERS')}
              </Button>
            )}
            <HasPermission value={Permission.ProjectEdit}>
              <Button type={'text'} size={'small'} onClick={() => onEdit(record)}>
                <EditOutlined />
              </Button>
            </HasPermission>
            <HasPermission value={Permission.ProjectDelete}>
              <Popconfirm
                title={intl.get('DELETE_PROJECT_PROMPT')}
                onConfirm={() => onDelete(record.id)}
              >
                <Button type={'text'} size={'small'} danger>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </HasPermission>
          </Space>
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <>
      <Table
        columns={columns}
        dataSource={ds}
        header={{
          title: intl.get('MENU_PROJECT_MANAGEMENT'),
          toolbar: [
            <HasPermission value={Permission.ProjectAdd}>
              <Button type={'primary'} onClick={() => setVisible(true)}>
                {intl.get('CREATE_PROJECT')}
                <PlusOutlined />
              </Button>
            </HasPermission>
          ]
        }}
        pagination={{
          ...paged,
          onChange: (index, size) =>
            setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
        }}
        rowKey={(row) => row.id}
      />
      {open && (
        <EditProjectModal
          open={open}
          project={project}
          onSuccess={() => {
            setVisible(false);
            setProject(undefined);
            if (dataSource) {
              const { size, page, total } = dataSource;
              gotoPage({ size, total, index: page }, 'next');
            }
          }}
          onCancel={() => {
            setVisible(false);
            setProject(undefined);
          }}
        />
      )}
      {allocVisible && project && (
        <AllocUserDrawer
          project={project}
          open={allocVisible}
          onSuccess={() => {
            setAllocVisible(false);
            setProject(undefined);
          }}
          onClose={() => {
            setAllocVisible(false);
            setProject(undefined);
          }}
        />
      )}
    </>
  );
};

export default ProjectPage;
