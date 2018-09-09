import React, { PureComponent, Fragment } from 'react';

import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Button,
  TreeSelect,
  Input,
  Table,
  Card,
  Divider,
  Popconfirm,
  message,
} from 'antd';

import DescriptionList from 'components/DescriptionList';
import Description from 'components/DescriptionList/Description';
import styles from '../TableList.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const { TreeNode } = TreeSelect;
const FormItem = Form.Item;

@connect(({ sysCache, loading }) => ({
  lastQuery: sysCache.lastQuery,
  cacheInfo: sysCache.cacheInfo,
  cacheNames: sysCache.cacheNames,
  cacheList: sysCache.cacheList,
  loading: loading.models.sysCache,
}))
@Form.create()
export default class SysCachePage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysCache/reset',
    });
    dispatch({
      type: 'sysCache/type',
    });
  }

  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'sysCache/fetch',
        params: fieldsValue,
      });
    });
  };

  handleReSearch = () => {
    const { dispatch, lastQuery } = this.props;
    dispatch({
      type: 'sysCache/fetch',
      params: lastQuery,
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysCache/remove',
      payload: {
        cacheName: record.cacheName,
        cacheKey: record.cacheKey,
      },
    })
      .then(response => {
        if (response) {
          if (response.code === 0) {
            message.success(`删除缓存成功`);
          } else {
            message.error(response.msg);
          }
        } else {
          message.error('系统异常，请稍后重试！');
        }
      })
      .then(() => {
        dispatch({
          type: 'sysCache/reset',
        });
        this.handleReSearch();
      });
  };

  showInfo = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysCache/info',
      payload: {
        cacheName: record.cacheName,
        cacheKey: record.cacheKey,
      },
    });
  };

  renderCacheSelect = cacheNames => {
    if (cacheNames && cacheNames.length > 0) {
      return cacheNames.map(cacheName => {
        return <TreeNode value={`${cacheName}`} title={cacheName} key={cacheName} />;
      });
    } else {
      return <TreeNode value="0" title="加载中" key={0} />;
    }
  };

  renderSimpleForm() {
    const { form, cacheNames } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="缓存类型">
              {getFieldDecorator('cacheName', {
                rules: [{ required: true, message: '缓存类型不能为空' }],
              })(
                <TreeSelect
                  showSearch
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  allowClear
                  placeholder="缓存类型"
                >
                  {this.renderCacheSelect(cacheNames)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="缓存Key">
              {getFieldDecorator('cacheKey')(<Input placeholder="缓存Key" />)}
            </FormItem>
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
    const { cacheList, loading, cacheInfo } = this.props;

    const columns = [
      {
        title: '缓存类型',
        dataIndex: 'cacheName',
      },
      {
        title: '缓存Key',
        dataIndex: 'cacheKey',
      },
      {
        title: '操作',
        render: record => {
          return (
            <Fragment>
              <a onClick={() => this.showInfo(record)}>查看</a>
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

    return (
      <PageHeaderLayout title="系统缓存">
        <Card style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            {cacheList != null && (
              <Table
                loading={loading}
                rowKey="id"
                dataSource={cacheList}
                columns={columns}
                pagination={false}
              />
            )}
          </div>
        </Card>
        {cacheInfo && (
          <Card title="缓存信息" style={{ marginBottom: 24 }} bordered={false}>
            <DescriptionList size="large" layout="vertical" col={1} style={{ marginBottom: 32 }}>
              <Description term="缓存类型">{cacheInfo.cacheName}</Description>
              <Description term="缓存Key">{cacheInfo.cacheKey}</Description>
              <Description term="缓存内容">
                {JSON.stringify(cacheInfo.cacheValue, null, 4)}
              </Description>
            </DescriptionList>
          </Card>
        )}
      </PageHeaderLayout>
    );
  }
}
