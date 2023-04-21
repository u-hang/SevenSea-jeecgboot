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
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'crowdfunding:nft_crowdfunding_property:add'">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('nft_crowdfunding_property')" v-has="'crowdfunding:nft_crowdfunding_property:exportXls'">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel">
          <a-button type="primary" icon="import" v-has="'crowdfunding:nft_crowdfunding_property:importExcel'">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0" v-has="'crowdfunding:nft_crowdfunding_property:deleteAll'">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel" ><a-icon type="delete"/>删除</a-menu-item>
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
          <a @click="handleEdit(record)" v-has="'crowdfunding:nft_crowdfunding_property:edit'">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-has="'crowdfunding:nft_crowdfunding_property:delete'">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <nftCrowdfundingProperty-modal ref="modalForm" @ok="modalFormOk" :mainId="mainId"></nftCrowdfundingProperty-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import NftCrowdfundingPropertyModal from './modules/NftCrowdfundingPropertyModal'

  export default {
    name: "NftCrowdfundingPropertyList",
    mixins:[JeecgListMixin],
    components: { NftCrowdfundingPropertyModal },
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
            title:'资产名称',
            align:"center",
            dataIndex: 'propertyName'
          },
          {
            title:'资产类型',
            align:"center",
            dataIndex: 'type_dictText',
          },
          {
            title:'合约地址',
            align:"center",
            dataIndex: 'contractAddress'
          },
          {
            title:'Token ID',
            align:"center",
            dataIndex: 'tokenId'
          },
          {
            title:'Token标准',
            align:"center",
            dataIndex: 'tokenStandard'
          },
          {
            title:'区块链',
            align:"center",
            dataIndex: 'chainConfigName'
          },
          {
            title:'资产状态',
            align:"center",
            dataIndex: 'state_dictText'
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
          list: "/crowdfunding/nftCrowdfunding/listNftCrowdfundingPropertyByMainId",
          delete: "/crowdfunding/nftCrowdfunding/deleteNftCrowdfundingProperty",
          deleteBatch: "/crowdfunding/nftCrowdfunding/deleteBatchNftCrowdfundingProperty",
          exportXlsUrl: "/crowdfunding/nftCrowdfunding/exportNftCrowdfundingProperty",
          importUrl: "/crowdfunding/nftCrowdfunding/importNftCrowdfundingProperty",
        },
        dictOptions:{
         state:[],
         type:[],
        }
      }
    },
    created() {
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
      }

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
