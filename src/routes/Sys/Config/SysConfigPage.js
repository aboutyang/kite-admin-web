import React, { PureComponent, Fragment } from 'react';

import { connect } from 'dva';
import { Form, Row, Col, Input, Button, Card, Table, Divider, Popconfirm, message } from 'antd';

import styles from '../TableList.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import collectionJoinStr from '../../../utils/collections';
import EditSysConfig from './EditSysConfig';

@connect(({ sysConfig, loading }) => ({
  sysConfig,
  page: sysConfig.page,
  loading: loading.models.sysConfig,
}))
@Form.create()
export default class SysConfigPage extends PureComponent {
  state = {
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysConfig/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {
        ...obj,
      };
      newObj[key] = collectionJoinStr(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sidx = `${sorter.field}`;
      params.order = `${sorter.order}`;
    }
    dispatch({
      type: 'sysConfig/fetch',
      params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'sysConfig/fetch',
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
        type: 'sysConfig/fetch',
        params: fieldsValue,
      });
    });
  };

  handleReSearch = () => {
    const {
      dispatch,
      sysConfig: { lastQuery },
    } = this.props;
    dispatch({
      type: 'sysConfig/fetch',
      params: lastQuery,
    });
  };

  showAddFrom = () => {
    this.setState({
      modalVisible: true,
      isUpdate: false,
      initObj: {},
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
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

  handleAdd = (fields, isUpdate) => {
    const { dispatch } = this.props;
    if (isUpdate) {
      dispatch({
        type: 'sysConfig/updateConfig',
        payload: fields,
      })
        .then(response => {
          if (response) {
            if (response.code === 0) {
              message.success(`参数修改成功`);
            } else {
              message.error(response.msg);
            }
          } else {
            message.error('系统异常，请稍后重试！');
          }
          this.handleModalVisible();
        })
        .then(() => {
          this.handleReSearch();
        });
    } else {
      dispatch({
        type: 'sysConfig/saveConfig',
        payload: fields,
      })
        .then(response => {
          if (response) {
            if (response.code === 0) {
              message.success(`新增参数成功`);
            } else {
              message.error(response.msg);
            }
          } else {
            message.error('系统异常，请稍后重试！');
          }
          this.handleModalVisible();
        })
        .then(() => {
          this.handleReSearch();
        });
    }
  };

  handleDeforcelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysConfig/deleteConfig',
      payload: [record.id],
    })
      .then(response => {
        if (response) {
          if (response.code === 0) {
            message.success(`删除参数【${record.paramKey}】成功`);
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
            {getFieldDecorator('key')(<Input placeholder="参数名" />)}
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
    const { page, loading } = this.props;
    const { modalVisible, isUpdate, initObj } = this.state;
    if (page && page.pageSize > 0) {
      // continue
    } else {
      return <div>waiting...</div>;
    }

    const pagination = {
      total: page.totalCount,
      pageSize: page.pageSize,
      current: page.currPage,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    const { list: data } = page;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '参数名',
        dataIndex: 'paramKey',
      },
      {
        title: '参数值',
        dataIndex: 'paramValue',
      },
      {
        title: '备注',
        dataIndex: 'remark',
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
      <PageHeaderLayout title="参数管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showAddFrom()}>
                新建
              </Button>
            </div>
            <Table
              loading={loading}
              rowKey="id"
              dataSource={data}
              columns={columns}
              pagination={pagination}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <EditSysConfig
          {...parentMethods}
          modalVisible={modalVisible}
          isUpdate={isUpdate}
          initObj={initObj}
        />
      </PageHeaderLayout>
    );
  }
}
