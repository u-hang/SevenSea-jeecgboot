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
            <a-form-model-item v-has="'val:state'" label="申请状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="state">
              <j-dict-select-tag type="list" v-model="model.state" dictCode="wallet_funding_state" placeholder="请设置申请状态" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收/付款钱包" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="walletAddress">
              <!-- <j-dict-select-tag type="list" v-model="model.walletAddress" :dictCode="'nft_wallet,wallet_address,wallet_address,user_id='" placeholder="请选择钱包地址" /> -->
              <el-select v-model="model.walletAddress" clearable  placeholder="请选择" style="display:block;">
              <el-option v-for="(item, index) in walletArray" :value="item.walletAddress" :label="item.walletAddress" :key="index">
              </el-option>
              </el-select>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="收款钱包" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paymentAddress">
              <span>{{ model.walletAddress }}</span>
              <el-input v-model="model.paymentAddress" @input="$forceUpdate()" placeholder="请输入内容" disabled>{{ this.$forceUpdate.model.walletAddress }}</el-input>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="意向金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="amount">
              <a-input-number v-model="model.amount" placeholder="请输入意向金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item v-has="'val:amount'" label="到账金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="amountReality">
              <a-input-number v-model="model.amountReality" placeholder="请输入到账金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </j-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import {ElementUI,Input} from 'element-ui'
  import { validateDuplicateValue } from '@/utils/util'
  import store from '@/store'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { result } from 'lodash'
  import axios from 'axios'
  import { addUser,editUser,queryUserRole,queryall } from '@/api/api'

  export default {
    name: "NftWalletCrowdfundingModal",
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
        walletArray:[],
        paymentAddress:'',
        currData:{
          userid:store.getters.userInfo.username,
        },
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
           walletAddress: [
              { required: true, message: '请输入钱包地址!'},
           ],
           amount: [
              { required: false},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
           ],
        },
        url: {
          add: "/crowdfunding/nftCrowdfunding/addNftWalletCrowdfunding",
          edit: "/crowdfunding/nftCrowdfunding/editNftWalletCrowdfunding",
        }

      }
    },
    created () {
    //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
      this.getWalletAddress();
    },
    mounted(){
      this.getWalletAddress();
    },
    methods: {
      async getWalletAddress(){
        console.log("===============do test");
        console.log(store.getters.userInfo);
        var userId = store.getters.userInfo.id;
        queryUserRole({userid:userId}).then((res)=>{
          if(res.success){
            console.log(res)
          }
        });
        httpAction("/wallet/nftWallet/array",{"userId":userId},'post').then((res)=>{
              if(res.success) this.walletArray=res.result;
          })
      },
      selectPayment(val){
        console.log('walletArray',this.walletArray)
        const item = this.walletArray.find(item1=> item1.walletAddress === this.model.walletAddress)
        console.log(item)
        if(val != null && val != '' && val != undefined){
          this.paymentAddress=val;
          this.model.paymentAddress==item.walletAddress;
          console.log("=========");
          console.log(this.paymentAddress);
          console.log("=========");
          console.log(this.model);
        
        }

      },
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
