import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Button, message, Divider, Popconfirm, Modal, Form, Row, Col, Input } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EditSysRole from './EditSysRole';
import styles from '../TableList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
export default class SysRolePage extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
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
      page: pagination.current,
      limit: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'role/fetch',
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
      type: 'role/fetch',
    });
  };

  showDeleteConfirm = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    const research = this.handleReSearch;

    Modal.confirm({
      title: '删除角色',
      content: '确定要删除选中的记录？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        if (!selectedRows) return;
        dispatch({
          type: 'role/removeRole',
          payload: selectedRows.map(row => row.roleId),
        })
          .then(response => {
            if (response) {
              if (response.code === 0) {
                message.success(`删除角色【${selectedRows.map(row => row.name).join(',')}】成功`);
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
        type: 'role/fetch',
        params: fieldsValue,
      });
    });
  };

  handleReSearch = () => {
    const {
      dispatch,
      role: { lastQuery },
    } = this.props;
    dispatch({
      type: 'role/fetch',
      params: lastQuery,
    });
  };

  handleAdd = (fields, isUpdate) => {
    const { dispatch } = this.props;
    if (isUpdate) {
      dispatch({
        type: 'role/updateRole',
        payload: fields,
      })
        .then(response => {
          if (response) {
            if (response.code === 0) {
              message.success(`角色修改成功`);
            } else {
              message.error(response.msg);
            }
          } else {
            message.error('系统异常，请稍后重试！');
          }
          this.handleModalVisible();
        })
        .then(() => {
          this.handleSearch();
        });
    } else {
      dispatch({
        type: 'role/saveRole',
        payload: fields,
      })
        .then(response => {
          if (response) {
            if (response.code === 0) {
              message.success(`新增菜单成功`);
            } else {
              message.error(response.msg);
            }
          } else {
            message.error('系统异常，请稍后重试！');
          }
          this.handleModalVisible();
        })
        .then(() => {
          this.handleSearch();
        });
    }
  };

  showAddFrom = () => {
    this.setState({
      modalVisible: true,
      isUpdate: false,
      initObj: {},
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
      type: 'role/removeRole',
      payload: [record.roleId],
    })
      .then(response => {
        if (response) {
          if (response.code === 0) {
            message.success(`删除角色【${record.roleName}】成功`);
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
            {getFieldDecorator('roleName')(<Input placeholder="角色名" />)}
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
      role: { page },
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
        title: '角色ID',
        dataIndex: 'roleId',
      },
      {
        title: '角色名',
        dataIndex: 'roleName',
      },
      {
        title: '所属部门',
        dataIndex: 'deptName',
      },
      {
        title: '备注',
        dataIndex: 'remark',
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

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="角色管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showAddFrom()}>
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              rowKey="roleId"
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible && (
          <EditSysRole
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
