<template>
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      :confirmLoading="confirmLoading"
      switchFullscreen
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭">
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="form" :model="model" :rules="validatorRules">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="分红情况" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="state">
                <j-dict-select-tag type="list" v-model="model.state" dictCode="nft_profit_state" placeholder="请选择分红情况" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="利润总额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="profit">
                <a-input v-model="model.profit" placeholder="请输入利润总额" ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="货币种类" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currency">
                <j-dict-select-tag type="list" v-model="model.currency" dictCode="nft_profit_currency" placeholder="请选择货币种类" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>
    </j-modal>
  </template>
  
  <script>
  
    import { httpAction } from '@/api/manage'
    import { validateDuplicateValue } from '@/utils/util'
  
    export default {
      name: "NftCrowdfundingProfitModal",
      components: {
      },
      props:{
        mainId:{
          type:String,
          required:false,
          default:''
        }
      },
      data () {
        return {
          title:"操作",
          width:800,
          visible: false,
          model:{
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
          validatorRules: {
            profit: [
                { required: true, message: '请输入利润总额!'},
             ],
             state: [
                { required: true, message: '请选择分红情况!'},
             ],
             currency: [
                { required: true, message: '请选择货币种类!'},
             ]
          },
          url: {
            add: "/crowdfunding/nftCrowdfunding/addNftCrowdfundingProfit",
            edit: "/crowdfunding/nftCrowdfunding/editNftCrowdfundingProfit",
          }
  
        }
      },
      created () {
      //备份model原始值
        this.modelDefault = JSON.parse(JSON.stringify(this.model));
      },
      methods: {
        add () {
          this.edit(this.modelDefault);
        },
        edit (record) {
          this.model = Object.assign({}, record);
          this.visible = true;
        },
        close () {
          this.$emit('close');
          this.visible = false;
          this.$refs.form.clearValidate();
        },
        handleOk () {
          const that = this;
          // 触发表单验证
          this.$refs.form.validate(valid => {
            if (valid) {
              that.confirmLoading = true;
              let httpurl = '';
              let method = '';
              if(!this.model.id){
                httpurl+=this.url.add;
                method = 'post';
              }else{
                httpurl+=this.url.edit;
                 method = 'put';
              }
              this.model['crowdfundingId'] = this.mainId
              httpAction(httpurl,this.model,method).then((res)=>{
                if(res.success){
                  that.$message.success(res.message);
                  that.$emit('ok');
                }else{
                  that.$message.warning(res.message);
                }
              }).finally(() => {
                that.confirmLoading = false;
                that.close();
              })
            }else{
               return false
            }
          })
        },
        handleCancel () {
          this.close()
        },
  
  
      }
    }
  </script>
  