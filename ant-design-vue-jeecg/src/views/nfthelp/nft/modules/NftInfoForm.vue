<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="资产图片网址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assetimageurl">
              <a-input v-model="model.assetimageurl" placeholder="请输入资产图片网址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="资产类型Id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assettypeid">
              <a-input-number v-model="model.assettypeid" placeholder="请输入资产类型Id" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="拍卖编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="auctionnumber">
              <a-input-number v-model="model.auctionnumber" placeholder="请输入拍卖编号" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="类别编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="categoryid">
              <a-input-number v-model="model.categoryid" placeholder="请输入类别编号" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="链名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="chainconfigname">
              <a-input v-model="model.chainconfigname" placeholder="请输入链名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="点击次数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="clickcount">
              <a-input-number v-model="model.clickcount" placeholder="请输入点击次数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="货币种类" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="coinconfigname">
              <a-input v-model="model.coinconfigname" placeholder="请输入货币种类"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收藏次数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="collectcount">
              <a-input-number v-model="model.collectcount" placeholder="请输入收藏次数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="合约地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contractaddress">
              <a-input v-model="model.contractaddress" placeholder="请输入合约地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="创建时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createtime">
              <j-date placeholder="请选择创建时间" v-model="model.createtime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="创建者头像" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createuserimglogo">
              <a-input v-model="model.createuserimglogo" placeholder="请输入创建者头像"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="创建用户昵称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createusernickname">
              <a-input v-model="model.createusernickname" placeholder="请输入创建用户昵称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="创建用户" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="creator">
              <a-input v-model="model.creator" placeholder="请输入创建用户"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description">
              <a-textarea v-model="model.description" rows="4" placeholder="请输入描述" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endtime">
              <j-date placeholder="请选择结束时间" v-model="model.endtime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收藏标识" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="iscollect">
              <a-input-number v-model="model.iscollect" placeholder="请输入收藏标识" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="元数据" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="metadata">
              <a-textarea v-model="model.metadata" rows="4" placeholder="请输入元数据" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入类型"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="当前出价" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="nftprice">
              <a-input-number v-model="model.nftprice" placeholder="请输入当前出价" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="所有者" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="owner">
              <a-input v-model="model.owner" placeholder="请输入所有者"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="所有者头像" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="owneruserimglogo">
              <a-input v-model="model.owneruserimglogo" placeholder="请输入所有者头像"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="所有者昵称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ownerusernickname">
              <a-input v-model="model.ownerusernickname" placeholder="请输入所有者昵称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="starttime">
              <j-date placeholder="请选择开始时间" v-model="model.starttime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <j-dict-select-tag type="list" v-model="model.status" dictCode="" placeholder="请选择状态" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="代币id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tokenid">
              <a-input v-model="model.tokenid" placeholder="请输入代币id"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="代币标准" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tokenstandard">
              <a-input v-model="model.tokenstandard" placeholder="请输入代币标准"  ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'NftInfoForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
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
        },
        url: {
          add: "/nft/nftInfo/add",
          edit: "/nft/nftInfo/edit",
          queryById: "/nft/nftInfo/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
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
      submitForm () {
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
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>