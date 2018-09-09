import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Radio, TreeSelect } from 'antd';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

@connect(({ dept, sysUser, role, loading }) => ({
  dept,
  roleList: role.roleList,
  roleIdList: sysUser.roleIdList,
  loading: loading.models.sysUser,
}))
class EditSysUser extends PureComponent {
  // state = {
  //   checkedRoleKeys: [],
  //   roleChange: false,
  // };

  componentDidMount() {
    const { dispatch, isUpdate, initObj } = this.props;
    dispatch({
      type: 'dept/selectDept',
    });
    dispatch({
      type: 'role/selectRole',
    }).then(() => {
      if (isUpdate) {
        dispatch({
          type: 'sysUser/userInfo',
          userId: initObj.userId,
        });
      }
    });
  }

  okHandle = () => {
    const { form, handleAdd, isUpdate, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'sysUser/clearRoleIdList',
      });
      handleAdd(
        {
          ...fieldsValue,
        },
        isUpdate,
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

  renderRole = roleList => {
    if (roleList && roleList.length > 0) {
      return roleList.map(role => {
        return <TreeNode value={`${role.roleId}`} title={role.roleName} key={role.roleId} />;
      });
    } else {
      return <TreeNode value="0" title="请选择" key={0} />;
    }
  };

  render() {
    const {
      modalVisible,
      form,
      handleModalVisible,
      isUpdate,
      initObj,
      dept: { deptList },
      roleList,
      roleIdList,
      dispatch,
      loading,
    } = this.props;

    let title = '新增用户';
    if (isUpdate) {
      title = `修改【${initObj.username}】`;
    }

    return (
      <Modal
        title={title}
        visible={modalVisible}
        onOk={this.okHandle}
        confirmLoading={loading}
        onCancel={() => {
          dispatch({
            type: 'sysUser/clearRoleIdList',
          });
          handleModalVisible();
        }}
      >
        {(() => {
          if (isUpdate) {
            return form.getFieldDecorator('userId', {
              initialValue: initObj.userId,
            })(<Input placeholder="用户ID" hidden={isUpdate} />);
          }
        })()}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
          {form.getFieldDecorator('username', {
            rules: [{ required: true, message: '用户名不能为空' }],
            initialValue: isUpdate ? initObj.username : '',
          })(<Input placeholder="登录账号" disabled={isUpdate} />)}
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
        {(() => {
          if (!isUpdate) {
            return (
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
                {form.getFieldDecorator('password', {})(<Input placeholder="密码" />)}
              </FormItem>
            );
          }
        })()}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
          {form.getFieldDecorator('email', {
            rules: [{ required: true, message: '邮箱不能为空' }],
            initialValue: isUpdate ? initObj.email : '',
          })(<Input placeholder="邮箱" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号">
          {form.getFieldDecorator('mobile', {
            rules: [{ required: true, message: '手机号不能为空' }],
            initialValue: isUpdate ? initObj.mobile : '',
          })(<Input placeholder="手机号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
          {form.getFieldDecorator('status', {
            initialValue: isUpdate ? initObj.status : 1,
          })(
            <RadioGroup>
              <Radio value={1}>正常</Radio>
              <Radio value={0}>禁用</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="选择角色">
          {form.getFieldDecorator('roleIdList', {
            initialValue: isUpdate ? roleIdList : [],
          })(
            <TreeSelect
              allowClear
              showSearch
              treeDefaultExpandAll
              style={{ width: 300 }}
              // treeCheckable={true}
              key="roleId"
            >
              {this.renderRole(roleList)}
            </TreeSelect>
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(EditSysUser);
