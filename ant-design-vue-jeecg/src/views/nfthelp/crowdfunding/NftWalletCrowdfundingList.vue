<template>
  <a-card :bordered="false" :class="'cust-erp-sub-tab'">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator" v-if="mainId">
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'crowdfunding:nft_wallet_crowdfunding:add'">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('nft_wallet_crowdfunding')" v-has="'crowdfunding:nft_wallet_crowdfunding:exportXls'">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel">
          <a-button type="primary" icon="import" v-has="'crowdfunding:nft_wallet_crowdfunding:importExcel'">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0" v-has="'crowdfunding:nft_wallet_crowdfunding:deleteAll'">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" v-has="'crowdfunding:nft_wallet_crowdfunding:edit'">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-has="'crowdfunding:nft_wallet_crowdfunding:delete'">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <nftWalletCrowdfunding-modal ref="modalForm" @ok="modalFormOk" :mainId="mainId"></nftWalletCrowdfunding-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import NftWalletCrowdfundingModal from './modules/NftWalletCrowdfundingModal'

  export default {
    name: "NftWalletCrowdfundingList",
    mixins:[JeecgListMixin],
    components: { NftWalletCrowdfundingModal },
    props:{
      mainId:{
        type:String,
        default:'',
        required:false
      }
    },
    watch:{
      mainId:{
        immediate: true,
        handler(val) {
          if(!this.mainId){
            this.clearList()
          }else{
            this.queryParam['crowdfundingId'] = val
            this.loadData(1);
          }
        }
      }
    },
    data () {
      return {
        description: 'nft_crowdfunding管理页面',
        disableMixinCreated:true,
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'投资人',
            align:"center",
            dataIndex: 'realName',
          },
          {
            title:'付款钱包',
            align:"center",
            dataIndex: 'walletAddress_dictText',
          },
          {
            title:'收款钱包',
            align:"center",
            dataIndex: 'paymentAddress',
          },
          {
            title:'申请状态',
            align:"center",
            dataIndex: 'state_dictText'
          },
          {
            title:'意向金额',
            align:"center",
            dataIndex: 'amount'
          },
          {
            title:'到账金额',
            align:"center",
            dataIndex: 'amountReality'
          },
          {
            title:'申请时间',
            align:"center",
            dataIndex: 'createTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'审核时间',
            align:"center",
            dataIndex: 'updateTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/crowdfunding/nftCrowdfunding/listNftWalletCrowdfundingByMainId",
          delete: "/crowdfunding/nftCrowdfunding/deleteNftWalletCrowdfunding",
          deleteBatch: "/crowdfunding/nftCrowdfunding/deleteBatchNftWalletCrowdfunding",
          exportXlsUrl: "/crowdfunding/nftCrowdfunding/exportNftWalletCrowdfunding",
          importUrl: "/crowdfunding/nftCrowdfunding/importNftWalletCrowdfunding",
        },
        dictOptions:{
         state:[],
         type:[],
        },
        superFieldList: []
      }
    },
    created() {
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl(){
        return `${window._CONFIG['domianURL']}/${this.url.importUrl}/${this.mainId}`;
      }
    },
    methods: {
      clearList(){
        this.dataSource=[]
        this.selectedRowKeys=[]
        this.ipagination.current = 1
      },
      getSuperFieldList() {
      let fieldList = [];
      fieldList.push({ type: 'string', value: 'state', text: '申请状态', dictCode: 'wallet_funding_state' })
      this.superFieldList = fieldList
    }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
