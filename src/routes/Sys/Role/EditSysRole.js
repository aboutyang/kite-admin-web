import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, TreeSelect, Tree } from 'antd';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

@connect(({ dept, role, menu, loading }) => ({
  dept,
  menuIdList: role.menuIdList,
  deptIdList: role.deptIdList,
  treeMenu: menu.treeMenu,
  loading: loading.models.sysUser,
}))
class EditSysRole extends PureComponent {
  state = {
    checkedKeys: [],
    change: false,
    checkedDeptKeys: [],
    deptChange: false,
  };

  componentDidMount() {
    const { dispatch, isUpdate, initObj } = this.props;
    dispatch({
      type: 'dept/selectDept',
    });
    dispatch({
      type: 'menu/treeMenu',
    });
    if (isUpdate) {
      dispatch({
        type: 'role/roleInfo',
        roleId: initObj.roleId,
      });
    }
  }

  okHandle = () => {
    const { form, handleAdd, isUpdate, menuIdList, deptIdList } = this.props;
    const { change, checkedKeys, deptChange, checkedDeptKeys } = this.state;
    const keys = change ? checkedKeys : isUpdate ? menuIdList : [];
    const deptKeys = deptChange ? checkedDeptKeys : isUpdate ? deptIdList : [];
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(
        {
          ...fieldsValue,
          menuIdList: keys,
          deptIdList: deptKeys,
        },
        isUpdate
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

  renderMenuTree = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.menuId}>
            {this.renderMenuTree(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.menuId} />;
    });
  };

  renderDeptTree = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.deptId}>
            {this.renderDeptTree(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.deptId} />;
    });
  };

  onCheck = checkedKeys => {
    this.setState({
      checkedKeys,
      change: true,
    });
  };

  onDeptCheck = checkedDeptKeys => {
    this.setState({
      checkedDeptKeys,
      deptChange: true,
    });
  };

  render() {
    const {
      modalVisible,
      form,
      handleModalVisible,
      isUpdate,
      treeMenu,
      initObj,
      dept: { deptList },
      loading,
      menuIdList,
      deptIdList,
    } = this.props;

    const { change, checkedKeys, deptChange, checkedDeptKeys } = this.state;
    const keys = change ? checkedKeys : isUpdate ? menuIdList : [];
    const deptKeys = deptChange ? checkedDeptKeys : isUpdate ? deptIdList : [];

    const title = !isUpdate ? '新增角色' : `修改【${initObj.roleName}】角色`;

    return (
      <Modal
        title={title}
        visible={modalVisible}
        onOk={this.okHandle}
        confirmLoading={loading}
        onCancel={() => handleModalVisible()}
      >
        {isUpdate &&
          form.getFieldDecorator('roleId', {
            initialValue: initObj.roleId,
          })(<Input placeholder="角色ID" hidden={isUpdate} />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名">
          {form.getFieldDecorator('roleName', {
            rules: [{ required: true, message: '角色名不能为空' }],
            initialValue: isUpdate ? initObj.roleName : '',
          })(<Input placeholder="角色名" disabled={isUpdate} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属部门">
          {form.getFieldDecorator('deptId', {
            initialValue: isUpdate ? initObj.deptId : '',
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('remark', {
            initialValue: isUpdate ? initObj.remark : '',
          })(<Input placeholder="备注" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="功能权限">
          {form.getFieldDecorator('menuIdList', {})(
            <Tree
              checkable
              onCheck={this.onCheck}
              onSelect={this.onSelect}
              checkedKeys={keys}
              key="menuId"
            >
              {this.renderMenuTree(treeMenu)}
            </Tree>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数据权限">
          {form.getFieldDecorator('deptIdList', {})(
            <Tree checkable onCheck={this.onDeptCheck} checkedKeys={deptKeys} key="deptId">
              {this.renderDeptTree(deptList)}
            </Tree>
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(EditSysRole);
