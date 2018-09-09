import React, { PureComponent } from 'react';

import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Input, Button, Card, Table } from 'antd';

import styles from '../TableList.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import collectionJoinStr from '../../../utils/collections';

@connect(({ sysLog, loading }) => ({
  page: sysLog.page,
  loading: loading.models.sysLog,
}))
@Form.create()
export default class SysLogPage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysLog/fetch',
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
      type: 'sysLog/fetch',
      params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'sysLog/fetch',
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
        type: 'sysLog/fetch',
        params: fieldsValue,
      });
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            {getFieldDecorator('key')(<Input placeholder="用户名,用户操作" />)}
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
        title: 'id',
        dataIndex: 'id',
        fixed: 'left',
        key: 'id',
        width: 60,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        fixed: 'left',
        key: 'username',
        width: 100,
      },
      {
        title: '用户操作',
        dataIndex: 'operation',
        fixed: 'left',
        key: 'operation',
        width: 100,
      },
      {
        title: '请求方法',
        dataIndex: 'method',
        width: 500,
        key: 'method',
      },
      {
        title: '请求参数',
        dataIndex: 'params',
        width: 640,
      },
      {
        title: '执行时长(ms)',
        dataIndex: 'time',
        fixed: 'right',
        width: 100,
      },
      {
        title: 'IP地址',
        dataIndex: 'ip',
        fixed: 'right',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        sorter: true,
        fixed: 'right',
        width: 200,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
    ];

    return (
      <PageHeaderLayout title="系统日志">
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
              scroll={{ x: 1700 }}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
