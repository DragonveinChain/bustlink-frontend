import React, {useEffect, useState} from 'react';
import { Form, Button, Input, Modal,  Select, Steps ,Checkbox,Row,Col} from 'antd';

import { TableListItem } from '../data.d';

import { queryPermissionList} from '../service';
import {forEach} from "lodash";
import {render} from "react-dom";

export interface FormValueTypeBind extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface BindFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueTypeBind) => void;
  onSubmit: (values: FormValueTypeBind) => void;
  bindModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;


export interface BindFormState {
  formVals: FormValueTypeBind;
  currentStep: number;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const BindForm: React.FC<BindFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueTypeBind>({
    id: props.values.id,
    permissions:props.values.permissions,
  });

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [CheckBoxItemList, setCheckBoxItemList] = useState<[]>([]);

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handlebindModalVisible,
    bindModalVisible,
    values,
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
      handleUpdate({ ...formVals, ...fieldsValue });

  };

  useEffect(() => {
    getCheckboxItemList().then(r => setCheckBoxItemList(r));
  }, []);

  async function getCheckboxItemList() {

    const permissonList =  await queryPermissionList()
    const elements: JSX.Element[] =[]
    permissonList.forEach((item)=>{
      elements.push(
        <Checkbox key={item.id}
          value={item.id}
          style={{
            lineHeight: '32px',
          }}
        >
          {item.name}
        </Checkbox>
      );
    })
    return elements
  }

  const renderContent = () => {
      return (
        <FormItem name="permissions" label="权限"
                  rules={[{required: true, message: '请设置角色的权限'}]}>
          <Checkbox.Group>
            <Row>
              {CheckBoxItemList}
            </Row>
          </Checkbox.Group>
        </FormItem>
      );

  };

  const renderFooter = () => {
      return (
        <>
          <Button onClick={() => handlebindModalVisible(false, values)}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            完成
          </Button>
        </>
      );

  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="给角色配置权限"
      visible={bindModalVisible}
      footer={renderFooter()}
      onCancel={() => handlebindModalVisible()}
    >

      <Form
        {...formLayout}
        form={form}
        initialValues={{
          id: formVals.id,
          permissions:formVals.permissions,

        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default BindForm;
