import request from 'umi-request';
import { TableListParams } from './data.d';

export async function queryAdminInstructList(params?: TableListParams) {

  //配合接口的分页变量名
  params.page = params.current;
  params.per_page = params.pageSize;

  const response = await request('/api/v0/admininstructlist', {
    method:"GET", params

  });

  //整理接口返回值符合Protable格式
  let newData =[];
  for(let i = 0; i < response.data.length; i++) {
    let obj = {};
    if(response.data[i].edges !== "" && response.data[i].edges !== undefined && JSON.stringify(response.data[i].edges) !== "{}"){
      // console.log(response.data[i].edges.information_info)
      obj.id = response.data[i].id
      obj.rid = response.data[i].rid
      obj.information_id = response.data[i].information_id
      obj.type = response.data[i].type
      obj.action = response.data[i].action
      obj.updated_unix = response.data[i].updated_unix
      obj.title = response.data[i].edges.information_info.title
      obj.video_no = response.data[i].edges.information_info.video_no

    }else{
      obj.id = response.data[i].id
      obj.rid = response.data[i].rid
      obj.information_id = response.data[i].information_id
      obj.type = response.data[i].type
      obj.action = response.data[i].action
      obj.updated_unix = response.data[i].updated_unix
      obj.title = ""
      obj.video_no = ""

    }
    newData.push(obj)
  }
  response.data = newData
  // console.log(response)
  return response;


}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateAdminInstruct(params: TableListParams) {
  return request(`/api/v0/admininstruct/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
