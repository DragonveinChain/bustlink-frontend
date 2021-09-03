import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Form, Input, Modal, Radio, Select, Steps, Tree } from 'antd';

import {TableListItem} from '../data.d';
import { querySelectMenuList} from "@/pages/menu/menu-list/service";

export interface FormValueType extends Partial<TableListItem> {
  id?: string;

}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}

const FormItem = Form.Item;
const {Step} = Steps;
const {TextArea} = Input;
const {Option} = Select;
const RadioGroup = Radio.Group;




export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};


const {TreeNode} = Tree;



const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    id: props.values.id,
    parent_id: props.values.parent_id,
    parent_name: props.values.parent_name,
    comment: props.values.comment,
    name: props.values.name,
    path: props.values.path,
    depth: props.values.depth,
  })

  // const [currentStep, setCurrentStep] = useState<number>(0);
  // const [MenuList, setMenuList] = useState<[]>([]);
  const [TreeData, setTreeData] = useState<[]>([]);

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  // const forward = () => setCurrentStep(currentStep + 1);
  //
  // const backward = () => setCurrentStep(currentStep - 1);

  useEffect(() => {
    getSelectMenuList("00000000-0000-0000-0000-000000000000").then(r => setTreeData(r));
  }, []);

  async function getSelectMenuList(parentID) {
    let MenuList = []
    MenuList = await querySelectMenuList(parentID)
    const SelectMenuList: { name: any; key: any; }[] = []
    MenuList.forEach((item: { name: any; id: any; }) => {
      SelectMenuList.push({ name: item.name, key: item.id }
      );
    })
    // console.log("selectmemu list is ",SelectMenuList)
    return SelectMenuList
  };

  const onSelect= (info) =>{
    // console.log('selected', info);
    if (info[0] !== undefined) {
      let spstr = info[0].split("&")
      let paramKey = spstr[spstr.length-1]
      form.setFieldsValue({ parent_id: paramKey})
    }
  };


  const onLoadData = async (treeNode) => {
       const treeData = [...TreeData];
        getNewTreeData(treeData, treeNode.props.eventKey, await generateTreeNodes(treeNode), 2);
        setTreeData(treeData);
  };

  async function generateTreeNodes(treeNode) {
    const arr: { name: any; key: string; }[] = [];
    let childData = [];
    const key = treeNode.props.eventKey;
    let paramKey ="";
    let spstr = treeNode.props.eventKey.split("&")
    paramKey = spstr[spstr.length-1]

    childData = await getSelectMenuList(paramKey);
    childData.forEach((item) => {
      arr.push({ name: item.name, key: `${key}&${item.key}` });
    })
    return arr;
  }


  const setLeaf = (treeData, curKey, level) => {
    const loopLeaf = (data, lev) => {
      const l = lev - 1;
      data.forEach((item) => {
        // if ((item.key.length > curKey.length) ? item.key.indexOf(curKey) !== 0 :
        //   curKey.indexOf(item.key) !== 0) {
        //   return;
        // }
        if (item.children) {
          loopLeaf(item.children, l);
        } else if (l < 1) {
          item.isLeaf = true;
        }
      });
    };
    loopLeaf(treeData, level + 1);
  }

  const getNewTreeData = (treeData: never[], curKey: string | any[], child: string | any[], level: number) => {
    const loop = (data) => {
      // if (level < 1 || curKey.length - 3 > level * 2) return;
      if (level < 1) return;
      data.forEach((item) => {
        if (curKey.indexOf(item.key) === 0) {
          if (item.children) {
            loop(item.children);
          } else {
            item.children = child;
          }
        }
      });
    };
    loop(treeData);
    // setLeaf(treeData, curKey, level);
  }

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();

    handleUpdate({...formVals, ...fieldsValue});

  };



  const renderContent = () => {

    const loop = data =>
      data.map((item) => {
        if (item.children) {
          return <TreeNode title={item.name} key={item.key}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode title={item.name} key={item.key} isLeaf={item.isLeaf} disabled={item.key === '0-0-0'} />;
      });

    const treeNodes = loop(TreeData);

    return (
      <>
        <FormItem
          name="id"
          label="ID"
        >
          <Input placeholder="请输入" disabled={true}/>
        </FormItem>
        <FormItem
          name="name"
          label="名称"
          rules={[{required: true, message: '请输入至少两个字符的描述！', min: 2}]}
        >
          <Input placeholder="请输入"/>
        </FormItem>

        <FormItem
          name="parent_id"
          label="父级菜单ID"
        >
          <Input placeholder="请输入" disabled={true}/>
        </FormItem>
        <FormItem
          name="parent_name"
          label="父级菜单名称"
        >
          <Input placeholder="请输入" disabled={true}/>
        </FormItem>
        <FormItem
          name="menu-list"
          label="菜单列表"
        >
          <Tree onSelect={onSelect} loadData={onLoadData}>
            {treeNodes}
          </Tree>
        </FormItem>
        <FormItem
          name="path"
          label="路径"
        >
          <Input placeholder="请输入"/>
        </FormItem>
        <FormItem
          name="depth"
          label="菜单层级关系"
        >
          <Input placeholder="请输入"/>
        </FormItem>

        <FormItem
          name="comment"
          label="描述"
          rules={[{required: true, message: '请输入至少两个字符的描述！', min: 2}]}
        >
          <TextArea rows={4} placeholder="请输入至少两个字符"/>
        </FormItem>


      </>
    );
  };

  const renderFooter = () => {
    // if (currentStep === 1) {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
          完成
        </Button>
      </>
    );
    // }
    // if (currentStep === 2) {
    //   return (
    //     <>
    //       <Button style={{ float: 'left' }} onClick={backward}>
    //         上一步
    //       </Button>
    //       <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
    //       <Button type="primary" onClick={() => handleNext()}>
    //         完成
    //       </Button>
    //     </>
    //   );
    // }
    // return (
    //   <>
    //     <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
    //     <Button type="primary" onClick={() => handleNext()}>
    //       下一步
    //     </Button>
    //   </>
    // );
  };

  return (
    <Modal
      width={1000}
      bodyStyle={{padding: '32px 40px 48px'}}
      destroyOnClose
      title="菜单编辑"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >

      <Form
        {...formLayout}
        form={form}
        initialValues={{

          id: formVals.id,
          name: formVals.name,
          comment: formVals.comment,
          parent_id: formVals.parent_id,
          parent_name: formVals.parent_name,
          path: formVals.path,
          depth: formVals.depth,


        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
