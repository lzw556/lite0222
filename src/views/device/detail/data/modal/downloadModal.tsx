import { Form, ModalProps, Select } from 'antd';
import { FC, useEffect } from 'react';
import { DownloadDeviceDataRequest } from '../../../../../apis/device';
import { Device } from '../../../../../types/device';
import intl from 'react-intl-universal';
import { useLocaleContext } from '../../../../../localeProvider';
import { RangeDatePicker, oneWeekNumberRange } from '../../../../../components/rangeDatePicker';
import React from 'react';
import { ModalWrapper } from '../../../../../components/modalWrapper';
import { DisplayProperty } from '../../../../../constants/properties';

const { Option } = Select;

export interface DownloadModalProps extends ModalProps {
  device: Device;
  property?: any;
  properties: DisplayProperty[];
  onSuccess: () => void;
  channel?: string;
}

const DownloadModal: FC<DownloadModalProps> = (props) => {
  const { open, device, property, properties, onSuccess } = props;
  const [range, setRange] = React.useState<[number, number]>(oneWeekNumberRange);
  const [form] = Form.useForm();
  const { language } = useLocaleContext();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        properties: property ? [property.key] : []
      });
    }
  }, [open, form, property]);

  const onDownload = () => {
    form.validateFields(['properties']).then((values) => {
      const pids = JSON.stringify(values.properties);
      const channel = props.channel;
      const filter = channel ? { pids, channel } : { pids };
      if (range) {
        const [from, to] = range;
        DownloadDeviceDataRequest(
          device.id,
          from,
          to,
          filter,
          language === 'en-US' ? 'en' : 'zh'
        ).then((res) => {
          if (res.status === 200) {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${device.name}.xlsx`);
            document.body.appendChild(link);
            link.click();
            onSuccess();
          }
        });
      }
    });
  };

  return (
    <ModalWrapper
      {...props}
      afterClose={() => form.resetFields()}
      width={430}
      title={intl.get('DWONLOAD_DATA')}
      okText={intl.get('DOWNLOAD')}
      onOk={onDownload}
    >
      <Form form={form} labelCol={{ span: 8 }}>
        <Form.Item label={intl.get('PROPERTY')} name={'properties'} required>
          <Select
            placeholder={intl.get('PLEASE_SELECT_DEVICE_PROPERTY')}
            mode={'multiple'}
            maxTagCount={2}
          >
            {properties.map((item) => (
              <Option key={item.key} value={item.key}>
                {intl.get(item.name)}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={intl.get('DATE_RANGE')} required>
          <RangeDatePicker onChange={setRange} />
        </Form.Item>
      </Form>
    </ModalWrapper>
  );
};

export default DownloadModal;
