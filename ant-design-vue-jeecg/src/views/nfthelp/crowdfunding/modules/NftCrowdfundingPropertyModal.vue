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
            <a-form-model-item label="资产状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="state">
              <j-dict-select-tag type="list" v-model="model.state" dictCode="nft_property_state" placeholder="请选择资产状态" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="资产名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="propertyName">
              <a-input v-model="model.propertyName" placeholder="请输入资产名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="资产类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag type="list" v-model="model.type" dictCode="nft_property_type" placeholder="请选择资产类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="合约地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contractAddress">
              <a-input v-model="model.contractAddress" placeholder="请输入合约地址" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="Token ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tokenId">
              <a-input v-model="model.tokenId" placeholder="请输入Token ID" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="Token标准" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tokenStandard">
              <a-input v-model="model.tokenStandard" placeholder="请输入Token标准" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="区块链" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="chainConfigName">
              <a-input v-model="model.chainConfigName" placeholder="请输入区块链" ></a-input>
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
    name: "NftCrowdfundingPropertyModal",
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
           propertyName: [
              { required: true, message: '请输入资产名称!'},
           ],
           state: [
              { required: true, message: '请输入资产状态!'},
           ],
           type: [
              { required: true, message: '请输入资产类型!'},
           ],
           contractAddress: [
              { required: true, message: '请输入合约地址!'},
           ],
           tokenId: [
              { required: true, message: '请输入Token ID!'},
           ],
        },
        url: {
          add: "/crowdfunding/nftCrowdfunding/addNftCrowdfundingProperty",
          edit: "/crowdfunding/nftCrowdfunding/editNftCrowdfundingProperty",
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
