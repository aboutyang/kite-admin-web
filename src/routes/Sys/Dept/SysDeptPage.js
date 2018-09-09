import React, { PureComponent, Fragment } from 'react';

import { connect } from 'dva';

import { Card, Button, Table, message, Popconfirm, Divider } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EditSysDept from './EditSysDept';

import styles from '../TableList.less';

@connect(({ dept, loading }) => ({
  dept,
  deptList: dept.deptList,
  loading: loading.models.dept,
}))
export default class SysDeptPage extends PureComponent {
  state = {
    modalVisible: false,
  };

  componentDidMount() {
    this.handleSearch();
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleSearch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dept/selectDept',
    });
  };

  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: fields.deptId ? 'dept/update' : 'dept/add',
      payload: {
        ...fields,
      },
    })
      .then(response => {
        if (response.code === 0) {
          message.success(`添加部门【${fields.name}】成功`);
          form.resetFields();
          this.setState({
            modalVisible: false,
          });
        } else {
          message.error(response.msg);
        }
      })
      .then(() => {
        this.handleSearch();
      });
  };

  showAddFrom = () => {
    this.setState({
      modalVisible: true,
      isUpdate: false,
    });
  };

  showUpdateForm = record => {
    this.setState({
      modalVisible: true,
      isUpdate: true,
      initObj: {
        ...record,
      },
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dept/remove',
      payload: {
        deptId: record.deptId,
      },
    })
      .then(response => {
        if (response) {
          if (response.code === 0) {
            message.success(`删除部门【${record.username}】成功`);
          } else {
            message.error(response.msg);
          }
        } else {
          message.error('系统异常，请稍后重试！');
        }
      })
      .then(() => {
        this.handleSearch();
      });
  };

  render() {
    const { deptList } = this.props;
    const { modalVisible, isUpdate, initObj } = this.state;
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
      },
      {
        title: '上级部门',
        dataIndex: 'parentName',
      },
      {
        title: '排序',
        dataIndex: 'orderNum',
      },
      {
        title: '操作',
        render: record => {
          return (
            <Fragment>
              <a onClick={() => this.showUpdateForm(record)}>更新</a>
              <Divider type="vertical" />
              <Popconfirm
                title="确定要删除选中的记录？"
                onConfirm={() => this.handleDelete(record)}
                okText="确定"
                cancelText="取消"
              >
                <a>刪除</a>
              </Popconfirm>
            </Fragment>
          );
        },
      },
    ];

    // rowSelection objects indicates the need for row selection
    const rowSelection = {
      type: 'radio',
    };
    return (
      <PageHeaderLayout title="部门管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showAddFrom()}>
                新建
              </Button>
            </div>
            <Table
              rowKey="deptId"
              columns={columns}
              rowSelection={rowSelection}
              dataSource={deptList}
              pagination={false}
              footer={() => ''}
            />
          </div>
        </Card>
        <EditSysDept
          modalVisible={modalVisible}
          deptList={deptList}
          isUpdate={isUpdate}
          initObj={initObj}
          handleModalVisible={this.handleModalVisible}
          handleAdd={this.handleAdd}
        />
      </PageHeaderLayout>
    );
  }
}
