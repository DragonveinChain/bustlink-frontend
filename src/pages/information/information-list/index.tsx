import {PlusOutlined} from '@ant-design/icons';
import {Button, Card, List, Pagination, Modal, Image, Typography, Form, Row, Col, Select} from 'antd';
import React, {Component} from 'react';

import {PageContainer} from '@ant-design/pro-layout';
import {connect, Dispatch} from 'umi';
import {StateType} from './model';
import {InfoItem} from './data.d';
import styles from './style.less';
import {removeInformationItem} from '@/pages/information/information-list/service';
import OperationModal from '@/pages/information/information-list/components/OperationModal';
import StandardFormRow from "@/pages/list/search/projects/components/StandardFormRow";
import TagSelect from "@/pages/list/search/projects/components/TagSelect";
import { FormInstance } from 'antd/es/form';

const {Paragraph} = Typography;
const FormItem = Form.Item;


interface InformationListProps {
  listInformationList: StateType;
  dispatch: Dispatch;
  loading: boolean;
}

interface InformationListState {
  visible: boolean;
  done: boolean;
  current?: Partial<InfoItem>;
  page: number;
  per_page: number;
}


class InformationList extends Component<InformationListProps, InformationListState> {
  state = {
    channel_label:"",
    channel_name:"",
    video_no:"",
    done: false,
    page: 1,
    per_page: 15,
    visible:false,
    current:{},
  }

  formRef = React.createRef<FormInstance>();


  componentDidMount() {
    const {dispatch} = this.props;
    // let state = this.state == null ? this.defaultState : this.state;
    // this.setState(state)
    dispatch({
      type: 'listInformationList/fetch',
      payload: this.state,
    });
  }

  componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    console.log("InformationList|componentDidUpdate", prevProps, prevState, snapshot)
  }

  onChange = (page: number, pageSize?: number) => {
    console.log("InformationList|onChange", page, pageSize)
    const state = {
      done :this.state.done,
      page,
      video_no:this.state.video_no,
      channel_label:this.state.channel_label,
      channel_name:this.state.channel_name,
      per_page: pageSize === undefined ? 15 : pageSize,
    };
    const {dispatch} = this.props;
    dispatch({
      type: 'listInformationList/fetch',
      payload: state,
    });
    this.setState(state)
  }

  onSearch = () => {

    console.log("InformationList|onSearch", this.formRef.current!.getFieldValue("channel_label"))
    const state = {
      done :this.state.done,
      video_no:this.formRef.current!.getFieldValue("video_no"),
      channel_label:this.formRef.current!.getFieldValue("channel_label"),
      channel_name:this.formRef.current!.getFieldValue("channel_name"),
      per_page: 15,
      page:1,
    };
    const {dispatch} = this.props;
    dispatch({
      type: 'listInformationList/fetch',
      payload: state,
    });
    this.setState(state)
  }
   handleDone = () => {
    this.setState({
      done:false,
      visible: false,
    })
  }
  //
   handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

   handleSubmit = async (values: InfoItem) => {
    const {dispatch} = this.props;
    await dispatch({
      type: 'listInformationList/submit',
      payload: values,
    });
    this.setState({
      visible: false,
    })
    dispatch({
      type: 'listInformationList/fetch',
      payload: this.state,
    });
  }

  render() {

    // const [done, setDone] = useState<boolean>(false);
    // const [visible, setVisible] = useState<boolean>(false);
    // const [current, setCurrent] = useState<Partial<InfoItem> | undefined>(undefined);

    //
    // const showModal = () => {
    //   setVisible(true);
    //   setCurrent(undefined);
    // };

    const showEditModal = (item: InfoItem) => {
      this.setState({
        visible: true,
        current:item
      })
      console.log("InformationList|showEditModal",this.state.current)

    };

    // const  deleteItem = (id: string) => {
    //   console.log("delete id", id)
    //   const {dispatch} = this.props;
    //   let state = this.state == null ? this.defaultState : this.state;
    //   async () => {
    //     const resp = await removeInformationItem({ id: id });
    //     if (resp.status === 'success') {
    //       Modal.success({
    //         content: resp.message,
    //       });
    //       dispatch({
    //         type: 'listInformationList/fetch',
    //         payload: state,
    //       });
    //     }
    //
    //   }
    //
    // };

    const deleteItem = async (currentItem: InfoItem) => {
      console.log("InformationList|editAndDelete", currentItem)
      const {dispatch} = this.props;
      let state = this.state == null ? this.defaultState : this.state;
      Modal.confirm({
        title: '删除确认',
        content: `是否确定删除番号：${currentItem.video_no}?`,
        onOk: async () => {
          const resp = await removeInformationItem({ id: currentItem.id });
          if (resp.status === 'success') {
            Modal.success({
              content: resp.message,
            });
            dispatch({
              type: 'listInformationList/fetch',
              payload: state,
            });
          }else{
            Modal.error({
              content: resp.message,
            });
          }
        },
      });
    };

    // const editAndDelete = (key: string, currentItem: InfoItem) => {
    //   console.log("InformationList|editAndDelete", key, currentItem)
    //   if (key === 'edit') showEditModal(currentItem);
    //   else if (key === 'delete') {
    //     Modal.confirm({
    //       title: '删除任务',
    //       content: '确定删除该任务吗？',
    //       okText: '确认',
    //       cancelText: '取消',
    //       onOk: () => deleteItem(currentItem.id),
    //     });
    //   }
    // };

    const {
      listInformationList: {list},
      loading,
    } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        {/*<p>*/}
        {/*  段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，*/}
        {/*  提供跨越设计与开发的体验解决方案。*/}
        {/*</p>*/}
        {/*<div className={styles.contentLink}>*/}
        {/*  <a>*/}
        {/*    <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg"/>{' '}*/}
        {/*    快速开始*/}
        {/*  </a>*/}
        {/*  <a>*/}
        {/*    <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg"/>{' '}*/}
        {/*    产品简介*/}
        {/*  </a>*/}
        {/*  <a>*/}
        {/*    <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg"/>{' '}*/}
        {/*    产品文档*/}
        {/*  </a>*/}
        {/*</div>*/}
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );

    const footer = [
      <Pagination
        key={'pagination'}
        total={list?.total}
        current={list?.current_page}
        onChange={this.onChange}
        defaultPageSize={15}
        pageSizeOptions={["15", "35", "55", "75", "95"]}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
      />,
    ];

    const nullData: Partial<InfoItem> = {};
    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (

      <div className={styles.coverCardList}>

        <PageContainer content={content} extraContent={extraContent} footer={footer}>
          <Card bordered={false}>
            <Form
              layout="inline"
              ref={this.formRef}
              onValuesChange={() => {
                // 表单项变化时请求数据

                // 模拟查询表单生效
                this.onSearch();
              }}
            >

              <FormItem  label="视频番号" name="video_no">
                <input placeholder="请输入"  className="ant-input" type="text" ></input>
              </FormItem>

              <FormItem  label="频道标签" name="channel_label">
                <input placeholder="请输入" className="ant-input" type="text" ></input>
              </FormItem>

                <FormItem {...formItemLayout} label="频道名称" name="channel_name">
                  <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                    <Option value="default">default</Option>
                    <Option value="free">free</Option>
                    <Option value="vip">vip</Option>
                    <Option value="spread">spread</Option>
                    <Option value="custom">custom</Option>
                    <Option value="">none</Option>
                  </Select>
                </FormItem>

              {/*<StandardFormRow title="频道" grid last>*/}
              {/*  <Row gutter={16}>*/}
              {/*    <Col lg={16} md={10} sm={10} xs={24}>*/}
              {/*      <FormItem {...formItemLayout} label="频道" name="author">*/}
              {/*        <Select placeholder="不限" style={{ maxWidth: 300, width: '100%' }}>*/}
              {/*          <Option value="lisa">王昭君</Option>*/}
              {/*        </Select>*/}
              {/*      </FormItem>*/}
              {/*    </Col>*/}
                  {/*<Col lg={8} md={10} sm={10} xs={24}>*/}
                  {/*  <FormItem {...formItemLayout} label="好评度" name="rate">*/}
                  {/*    <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>*/}
                  {/*      <Option value="good">优秀</Option>*/}
                  {/*      <Option value="normal">普通</Option>*/}
                  {/*    </Select>*/}
                  {/*  </FormItem>*/}
                  {/*</Col>*/}
              {/*  </Row>*/}
              {/*</StandardFormRow>*/}
            </Form>
          </Card>
          <div className={styles.cardList}>
            <List<Partial<InfoItem>>
              rowKey="id"
              loading={loading}
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
                xl: 1,
                xxl: 1,
              }}
              dataSource={list == null ? [nullData] : [nullData, ...list.data]}
              renderItem={(item) => {
                if (item && item.id) {
                  return (
                    <List.Item key={item.id}>
                      <Card
                        // hoverable={true}
                        className={styles.card}
                        actions={[<a key="edit" onClick={(e) => {
                          e.preventDefault();
                          showEditModal(item as InfoItem);
                        }}>编辑</a>, <a key="delete" onClick={(e) => {
                          e.preventDefault()
                          deleteItem( item as InfoItem)
                        }}>删除</a>]
                        }
                      >
                        <Card.Meta

                          avatar={
                            // <img
                            //   alt=""
                            //   className={styles.cardAvatar}
                            //   // src={'http://127.0.0.1:10080/link/' + item.root + '/' + item.poster_path + "?ts=1"}
                            //   src={localStorage.getItem("InformationImgUrl") + item.root + '/' + item.poster_path + "?ts=1"}
                            //   onError={(e) => {
                            //     e.target.onerror = null;
                            //     e.target.src="/admin/failed/147x200.svg"
                            //     e.target.style="width:100px"
                            //   }}
                            // />
                            <Image
                            width="250px"
                            src={localStorage.getItem("InformationImgUrl") + item.root + '/' + item.poster_path + `?ts=1`}
                            fallback="/admin/failed/147x200.svg"
                            crossOrigin="anonymous"
                            />

                          }
                          title={<a>{item.video_no}</a>}
                          description={
                            // item.title + <br/> + item.title
                            <Paragraph >
                              <Paragraph  ellipsis={{rows: 2}}>
                                Title: {item.title}<br/>
                              </Paragraph>
                              <Paragraph className={styles.item} ellipsis={{rows: 4}}>
                                频道标签: {item.channel_label}<br/>
                                频道名称: {item.channel_name}<br/>
                              </Paragraph>
                            </Paragraph>

                          }
                        />
                      </Card>
                    </List.Item>
                  );
                }
                return (
                  <List.Item>
                    {/*<Button type="dashed" className={styles.newButton}>*/}
                    {/*  <PlusOutlined/> 新增产品*/}
                    {/*</Button>*/}
                  </List.Item>
                );
              }}
            />
          </div>
        </PageContainer>

        <OperationModal
          done={this.state.done}
          current={this.state.current}
          visible={this.state.visible}
          onDone={this.handleDone}
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmit}
        />
      </div>

    );
  }
}

export default connect(
  ({
     listInformationList,
     loading,
   }: {
    listInformationList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    listInformationList,
    loading: loading.models.listInformationList,
  }),
)(InformationList);
