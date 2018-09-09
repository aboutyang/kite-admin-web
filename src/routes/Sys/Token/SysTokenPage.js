import React, { PureComponent, Fragment } from 'react';

import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Input, Button, Card, Table, Popconfirm, message } from 'antd';

import styles from '../TableList.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import collectionJoinStr from '../../../utils/collections';

@connect(({ sysToken, loading }) => ({
  sysToken,
  page: sysToken.page,
  loading: loading.models.sysToken,
}))
@Form.create()
export default class SysTokenPage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysToken/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
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
      type: 'sysToken/fetch',
      params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'sysToken/fetch',
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
        type: 'sysToken/fetch',
        params: fieldsValue,
      });
    });
  };

  handleReSearch = () => {
    const {
      dispatch,
      sysToken: { lastQuery },
    } = this.props;
    dispatch({
      type: 'sysToken/fetch',
      params: lastQuery,
    });
  };

  forceLogout = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysToken/remove',
      token: record.token,
    })
      .then(response => {
        if (response) {
          if (response.code === 0) {
            message.success(`【${record.username}】被踢出`);
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
            {getFieldDecorator('username')(<Input placeholder="用户名" />)}
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
    if (page && page.pageSize > 0) {
      // continue
    } else {
      return <div>waiting</div>;
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
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '登录时间',
        dataIndex: 'loginTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '过期时间',
        dataIndex: 'expireTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: 'Token',
        dataIndex: 'token',
      },
      {
        title: '操作',
        render: record => {
          return (
            <Fragment>
              <Popconfirm
                title="确定强制登出此用户？"
                onConfirm={() => this.forceLogout(record)}
                okText="确定"
                cancelText="取消"
              >
                <a>登出</a>
              </Popconfirm>
            </Fragment>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout title="在线用户">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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
      </PageHeaderLayout>
    );
  }
}
