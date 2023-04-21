<template>
  <j-modal 
    :title="title" 
    :width="width" 
    :visible="visible" 
    switchFullscreen 
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }" 
    @cancel="handleCancel" 
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :label-col="labelCol" :wrapper-col="wrapperCol" :model="nftInfoModel">
        
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="历史记录" key="1">
            <NftInfoHistoryList :mainId="assetId"/>
          </a-tab-pane>
          <!-- <a-tab-pane tab="交易记录" key="2">

          </a-tab-pane> -->
        </a-tabs>

      </a-form-model>
    </a-spin>
    
  </j-modal>
</template>

<script>
import NftInfoHistoryList from "./NftInfoHistoryList"
export default {
  name: 'NftInfoModal',
  components: {
    // NftInfoForm
    NftInfoHistoryList
  },
  data() {
    return {
      title: '详情',
      width: 1000,
      visible: false,
      disableSubmit: false,
      nftInfoModel: {
        nftInfoHistoryList: [{}],
        nftInfoBidList: [{}]
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      assetId:""
    }
  },
  methods: {
    add() {
      this.visible = true
    },
    edit(record) {
      this.assetId=record.id;
      this.visible = true

    },
    close() {
      this.$emit('close');
      this.visible = false;
    },
    handleOk() {
      this.$refs.realForm.submitForm();
    },
    submitCallback() {
      this.$emit('ok');
      this.visible = false;
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>