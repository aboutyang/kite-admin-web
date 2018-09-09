import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input } from 'antd';

const FormItem = Form.Item;

@connect(({ sysConfig, loading }) => ({
  sysConfig,
  loading: loading.models.sysConfig,
}))
class EditSysConfig extends PureComponent {
  okHandle = () => {
    const { form, handleAdd, isUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(
        {
          ...fieldsValue,
        },
        isUpdate
      );
    });
  };

  render() {
    const { modalVisible, form, handleModalVisible, isUpdate, initObj, loading } = this.props;

    const title = !isUpdate ? '新增参数' : `修改【${initObj.name}】参数`;

    return (
      <Modal
        title={title}
        visible={modalVisible}
        onOk={this.okHandle}
        confirmLoading={loading}
        onCancel={() => handleModalVisible()}
      >
        {isUpdate &&
          form.getFieldDecorator('id', {
            initialValue: initObj.id,
          })(<Input placeholder="id" hidden={isUpdate} />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="参数名">
          {form.getFieldDecorator('paramKey', {
            rules: [{ required: true, message: '参数名不能为空' }],
            initialValue: isUpdate ? initObj.paramKey : '',
          })(<Input placeholder="参数名" disabled={isUpdate} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="参数值">
          {form.getFieldDecorator('paramValue', {
            rules: [{ required: true, message: '参数值不能为空' }],
            initialValue: isUpdate ? initObj.paramValue : '',
          })(<Input placeholder="参数值" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('remark', {
            initialValue: isUpdate ? initObj.remark : '',
          })(<Input placeholder="备注" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(EditSysConfig);
