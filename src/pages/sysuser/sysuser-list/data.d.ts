export interface TableListItem {
  key: number;
  id: string;
  comment: string;
  data_scope: string;
  flag: string;
  name: string;
  title: string;
  content: string;
  status: number;
  sort: number;
  organization: string;

}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  id?: string;
  user_id?: string;
  organization_id?: string;
  status?: number;
  sort?: number;
  flag?: string;
  data_scope?: string;
  comment: string;
  name: string;
  title: string;
  content: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
