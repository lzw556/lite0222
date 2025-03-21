import React from 'react';
import { InputNumber } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem } from '../../../../../components/formInputItem';
import { getDisplayName } from '../../../../../utils/format';
import { useLocaleContext } from '../../../../../localeProvider';

export const InstallHeightItem = ({
  mode,
  name,
  restFields
}: {
  mode: 'create' | 'update';
  name?: number;
  restFields?: {
    fieldKey?: number | undefined;
  };
}) => {
  const { language } = useLocaleContext();
  const commonNameProp = ['attributes', 'tower_install_height'];
  const nameProp = name !== undefined ? [name, ...commonNameProp] : commonNameProp;
  const isModeCreate = mode === 'create';
  return (
    <FormInputItem
      {...restFields}
      required={isModeCreate}
      name={nameProp}
      label={
        isModeCreate
          ? getDisplayName({
              name: intl.get('TOWER_INSTALL_HEIGHT'),
              suffix: 'm',
              lang: language
            })
          : intl.get('TOWER_INSTALL_HEIGHT')
      }
      numericChildren={
        <InputNumber
          addonAfter={isModeCreate ? undefined : 'm'}
          controls={false}
          placeholder={intl.get('PLEASE_ENTER_SOMETHING', {
            something: intl.get('TOWER_INSTALL_HEIGHT')
          })}
          style={{ width: '100%' }}
        />
      }
      numericRule={{
        others: [
          {
            validator(_, value) {
              if (value > 0) {
                return Promise.resolve();
              } else if (value == null) {
                return Promise.reject(
                  new Error(
                    intl.get('PLEASE_ENTER_SOMETHING', {
                      something: intl.get('TOWER_INSTALL_HEIGHT')
                    })
                  )
                );
              } else {
                return Promise.reject(
                  new Error(
                    intl.get('VALIDATOR_NUMBER_MORE', {
                      name: intl.get('TOWER_INSTALL_HEIGHT'),
                      min: 0
                    })
                  )
                );
              }
            }
          }
        ]
      }}
      style={isModeCreate ? { display: 'inline-block', width: 200 } : undefined}
    />
  );
};
