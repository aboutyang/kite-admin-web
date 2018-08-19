import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Icon, Button, Dropdown, Menu, message, Divider } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EditSysUser from './EditSysUser';

import styles from '../TableList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ sysUser, loading }) => ({
  sysUser,
  loading: loading.models.sysUser,
}))
export default class SysUserPage extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysUser/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'sysUser/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sysUser/fetch',
      payload: {},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'sysUser/remove',
          payload: selectedRows.map(row => row.userId).join(','),
        }).then(response => {
          if (response) {
            const rep = JSON.parse(response);
            if (rep.code === 0) {
              message.success(`删除用户【${selectedRows.map(row => row.username).join(',')}】成功`);
            } else {
              message.error(rep.msg);
            }
          } else {
            message.error('系统异常，请稍后重试！');
          }
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      isUpdate: false,
    });
  };

  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }

    const { dispatch } = this.props;
    // const { dispatch, form } = this.props;
    dispatch({
      type: 'sysUser/fetch',
      payload: {},
    });

    // form.validateFields((err, fieldsValue) => {
    //   if (err) return;

    //   this.setState({
    //     formValues: fieldsValue,
    //   });

    //   dispatch({
    //     type: 'sysUser/fetch',
    //     payload: fieldsValue,
    //   });
    // });
  };

  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysUser/add',
      payload: {
        ...fields,
      },
    })
      .then(() => {
        message.success(`添加用户【${fields.username}】成功`);
        form.resetFields();
        this.setState({
          modalVisible: false,
        });
      })
      .then(() => {
        this.handleSearch();
      });
  };

  handleUpdate = record => {
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
      type: 'sysUser/remove',
      payload: record.userId,
    }).then(response => {
      if (response) {
        const rep = JSON.parse(response);
        if (rep.code === 0) {
          message.success(`删除用户【${record.username}】成功`);
        } else {
          message.error(rep.msg);
        }
      } else {
        message.error('系统异常，请稍后重试！');
      }
    });
  };

  render() {
    const {
      sysUser: { page },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, isUpdate, initObj } = this.state;

    const columns = [
      {
        title: '用户ID',
        dataIndex: 'userId',
      },
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '所属部门',
        dataIndex: 'deptName',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: record => {
          return (
            <Fragment>
              <a onClick={() => this.handleUpdate(record)}>更新</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleDelete(record)}>刪除</a>
            </Fragment>
          );
        },
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="enable">禁用</Menu.Item>
        <Menu.Item key="disable">启用</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="管理员列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      批量操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              rowKey="userId"
              loading={loading}
              data={page}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <EditSysUser
          {...parentMethods}
          modalVisible={modalVisible}
          isUpdate={isUpdate}
          initObj={initObj}
        />
      </PageHeaderLayout>
    );
  }
}
