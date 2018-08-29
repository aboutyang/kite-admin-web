import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, TreeSelect } from 'antd';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

@connect(({ loading }) => ({
  loading: loading.models.dept,
}))
class EditSysDept extends PureComponent {
  okHandle = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(
        {
          ...fieldsValue,
        },
        form
      );
    });
  };

  renderDept = deptList => {
    if (deptList && deptList.length > 0) {
      return deptList.map(dept => {
        if (dept.children) {
          return (
            <TreeNode value={`${dept.deptId}`} title={dept.name} key={dept.deptId}>
              {this.renderDept(dept.children)}
            </TreeNode>
          );
        } else {
          return <TreeNode value={`${dept.deptId}`} title={dept.name} key={dept.deptId} />;
        }
      });
    } else {
      return <TreeNode value="0" title="请选择" key={0} />;
    }
  };

  render() {
    const {
      modalVisible,
      form,
      isUpdate,
      initObj,
      handleModalVisible,
      deptList,
      loading,
    } = this.props;

    const title = '新增部门';

    return (
      <Modal
        title={title}
        visible={modalVisible}
        onOk={this.okHandle}
        confirmLoading={loading}
        onCancel={() => handleModalVisible()}
      >
        {(() => {
          if (isUpdate) {
            return form.getFieldDecorator('deptId', {
              initialValue: isUpdate ? initObj.deptId : '',
            })(<Input placeholder="部门ID" hidden={isUpdate} />);
          }
        })()}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门名称">
          {form.getFieldDecorator('name', {
            initialValue: isUpdate ? initObj.name : '',
            rules: [{ required: true, message: '部门名称不能为空' }],
          })(<Input placeholder="登录账号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属部门">
          {form.getFieldDecorator('parentId', {
            initialValue: isUpdate ? initObj.parentId : '',
            rules: [{ required: true, message: '所属部门不能为空' }],
          })(
            <TreeSelect
              showSearch
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="所属部门"
              allowClear
              treeDefaultExpandAll
            >
              {this.renderDept(deptList)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
          {form.getFieldDecorator('orderNum', {
            initialValue: isUpdate ? initObj.orderNum : '',
            rules: [{ required: true, message: '排序不能为空' }],
          })(<Input placeholder="排序" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(EditSysDept);
