import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Icon,
  Button,
  Dropdown,
  Menu,
  message,
  Divider,
  Popconfirm,
  Modal,
  Form,
  Row,
  Col,
  Input,
  Tag,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EditSysUser from './EditSysUser';

import styles from '../TableList.less';
import collectionJoinStr from '../../../utils/collections';

@connect(({ sysUser, loading }) => ({
  sysUser,
  loading: loading.models.sysUser,
}))
@Form.create()
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
      newObj[key] = collectionJoinStr(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'sysUser/fetch',
      params,
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
    });
  };

  showDeleteConfirm = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    const research = this.handleReSearch;

    Modal.confirm({
      title: '删除用户',
      content: '确定要删除选中的记录？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        if (!selectedRows) return;
        dispatch({
          type: 'sysUser/remove',
          payload: selectedRows.map(row => row.userId),
        })
          .then(response => {
            if (response) {
              if (response.code === 0) {
                message.success(
                  `删除用户【${selectedRows.map(row => row.username).join(',')}】成功`
                );
                return true;
              } else {
                message.error(response.msg);
              }
            } else {
              message.error('系统异常，请稍后重试！');
            }
            return false;
          })
          .then(flag => {
            if (flag) {
              research();
            }
          });
      },
    });
  };

  generatorUserData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysUser/generator',
    })
      .then(response => {
        if (response) {
          if (response.code === 0) {
            message.success(`测试数据生成成功！`);
            return true;
          } else {
            message.error(response.msg);
          }
        } else {
          message.error('系统异常，请稍后重试！');
        }
        return false;
      })
      .then(flag => {
        if (flag) {
          this.handleReSearch();
        }
      });
  };

  changeStatus = status => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    dispatch({
      type: 'sysUser/changeStatus',
      userIds: selectedRows.map(row => row.userId),
      status,
    })
      .then(response => {
        if (response) {
          if (response.code === 0) {
            message.success(`操作成功!`);
            return true;
          } else {
            message.error(response.msg);
          }
        } else {
          message.error('系统异常，请稍后重试！');
        }
        return false;
      })
      .then(flag => {
        if (flag) {
          this.handleReSearch();
        }
      });
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

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      dispatch({
        type: 'sysUser/fetch',
        params: fieldsValue,
      });
    });
  };

  handleReSearch = () => {
    const {
      dispatch,
      sysUser: { lastQuery },
    } = this.props;
    dispatch({
      type: 'sysUser/fetch',
      params: lastQuery,
    });
  };

  handleAdd = (fields, isUpdate, form) => {
    const { dispatch } = this.props;
    const dispatchType = isUpdate ? 'sysUser/update' : 'sysUser/add';
    dispatch({
      type: dispatchType,
      payload: {
        ...fields,
      },
    })
      .then(response => {
        if (response.code === 0) {
          if (isUpdate) {
            message.success(`更新用户【${fields.username}】成功`);
          } else {
            message.success(`添加用户【${fields.username}】成功`);
          }
          form.resetFields();
          this.setState({
            modalVisible: false,
          });
        } else {
          message.error(response.msg);
        }
      })
      .then(() => {
        this.handleReSearch();
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
      type: 'sysUser/remove',
      payload: [record.userId],
    })
      .then(response => {
        if (response) {
          if (response.code === 0) {
            message.success(`删除用户【${record.username}】成功`);
          } else {
            message.error(response.msg);
          }
        } else {
          message.error('系统异常，请稍后重试！');
        }
      })
      .then(() => {
        this.handleReSearch();
      });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            {getFieldDecorator('query')(<Input placeholder="用户名" />)}
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      sysUser: { page },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, isUpdate, initObj } = this.state;

    const data = {
      ...page,
      pagination: {
        total: page.totalCount,
        pageSize: page.pageSize,
        current: page.currPage,
      },
    };

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
        render(val) {
          if (val === 1) {
            return <Tag color="green">启用</Tag>;
          } else {
            return <Tag color="red">禁用</Tag>;
          }
        },
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

    const menu = (
      <Menu>
        <Menu.Item key="remove" onClick={this.showDeleteConfirm}>
          <a>删除</a>
        </Menu.Item>
        <Menu.Item key="enable" onClick={() => this.changeStatus('lock')}>
          禁用
        </Menu.Item>
        <Menu.Item key="disable" onClick={() => this.changeStatus('unlock')}>
          启用
        </Menu.Item>
        <Menu.Item key="generatorUserData" onClick={this.generatorUserData}>
          生成100条测试数据
        </Menu.Item>
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
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible && (
          <EditSysUser
            {...parentMethods}
            modalVisible={modalVisible}
            isUpdate={isUpdate}
            initObj={initObj}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
