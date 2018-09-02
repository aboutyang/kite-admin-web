import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Radio, TreeSelect } from 'antd';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
class EditSysMenu extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/selectMenu',
    });
  }

  okHandle = () => {
    const { form, handleAdd, isUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(
        {
          ...fieldsValue,
        },
        isUpdate,
        form
      );
    });
  };

  renderMenu = menuList => {
    if (menuList && menuList.length > 0) {
      return menuList.map(menu => {
        if (menu.children) {
          return (
            <TreeNode value={`${menu.menuId}`} title={menu.name} key={menu.menuId}>
              {this.renderMenu(menu.children)}
            </TreeNode>
          );
        } else {
          return <TreeNode value={`${menu.menuId}`} title={menu.name} key={menu.menuId} />;
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
      handleModalVisible,
      isUpdate,
      initObj,
      changeSelectType,
      menu: { menuList },
      loading,
    } = this.props;

    const title = !isUpdate ? '新增菜单' : `修改【${initObj.name}】菜单`;
    const typeName = initObj.type === 0 ? '目录' : initObj.type === 1 ? '菜单' : '按钮';

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
            return form.getFieldDecorator('menuId', {
              initialValue: initObj.menuId,
            })(<Input placeholder="菜单ID" hidden={isUpdate} />);
          }
        })()}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
          {form.getFieldDecorator('type', {
            initialValue: initObj.type,
          })(
            <RadioGroup onChange={e => changeSelectType(e)}>
              <Radio value={0}>目录</Radio>
              <Radio value={1}>菜单</Radio>
              <Radio value={2}>按钮</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '菜单名称不能为空' }],
            initialValue: isUpdate ? initObj.name : '',
          })(<Input placeholder="菜单名称或按钮名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级菜单">
          {form.getFieldDecorator('parentId', {
            initialValue: isUpdate ? (initObj.parentId === 0 ? '' : initObj.parentId) : '',
          })(
            <TreeSelect
              showSearch
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择上级菜单"
              allowClear
              treeDefaultExpandAll
            >
              {this.renderMenu(menuList)}
            </TreeSelect>
          )}
        </FormItem>
        {initObj.type !== 2 && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={`${typeName}URL`}>
            {form.getFieldDecorator('path', {
              rules: [{ required: true, message: `${typeName}URL不能为空` }],
              initialValue: isUpdate ? initObj.path : '',
            })(<Input placeholder={`${typeName}URL`} />)}
          </FormItem>
        )}
        {initObj.type !== 0 && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="授权标识">
            {form.getFieldDecorator('perms', {
              rules: [{ required: true, message: '授权标识不能为空' }],
              initialValue: isUpdate ? initObj.perms : '',
            })(<Input placeholder="多个用逗号分隔，如：user:list,user:create" />)}
          </FormItem>
        )}
        {initObj.type !== 2 && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序号">
            {form.getFieldDecorator('orderNum', {
              rules: [{ required: true, message: '排序号不能为空' }],
              initialValue: isUpdate ? initObj.orderNum : '',
            })(<Input placeholder="排序号" />)}
          </FormItem>
        )}
        {initObj.type !== 2 && (
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="图标"
            help="获取图标：http://fontawesome.io/icons/"
          >
            {form.getFieldDecorator('icon', {
              rules: [{ required: true, message: `${typeName}图标不能为空` }],
              initialValue: isUpdate ? initObj.icon : '',
            })(<Input placeholder={`${typeName}图标`} />)}
          </FormItem>
        )}
      </Modal>
    );
  }
}

export default Form.create()(EditSysMenu);
