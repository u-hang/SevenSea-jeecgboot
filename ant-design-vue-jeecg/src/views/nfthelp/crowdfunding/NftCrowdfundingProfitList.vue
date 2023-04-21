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
        <a-button @click="handleAdd" type="primary" icon="plus" v-has="'crowdfunding:nft_crowdfunding_profit:add'">新增</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0" v-has="'crowdfunding:nft_crowdfunding_profit:deleteAll'">
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
            <a @click="handleEdit(record)" v-has="'crowdfunding:nft_crowdfunding_profit:edit'">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-has="'crowdfunding:nft_crowdfunding_profit:delete'">
              <a>删除</a>
            </a-popconfirm>
          </span>
  
        </a-table>
      </div>
  
      <nftCrowdfundingProfit-modal ref="modalForm" @ok="modalFormOk" :mainId="mainId"></nftCrowdfundingProfit-modal>
    </a-card>
  </template>
  
  <script>
  
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import NftCrowdfundingProfitModal from './modules/NftCrowdfundingProfitModal'
  
    export default {
      name: "NftCrowdfundingProfitList",
      mixins:[JeecgListMixin],
      components: { NftCrowdfundingProfitModal },
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
          description: '分润管理页面',
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
              title:'分红情况',
              align:"center",
              dataIndex: 'state_dictText'
            },
            {
              title:'利润总额',
              align:"center",
              dataIndex: 'profit',
            },
            {
              title:'货币种类',
              align:"center",
              dataIndex: 'currency_dictText'
            },
            {
              title:'分红时间',
              align:"center",
              dataIndex: 'createTime'
            },
            {
              title:'结算时间',
              align:"center",
              dataIndex: 'updateTime'
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
            list: "/crowdfunding/nftCrowdfunding/listNftCrowdfundingProfitByMainId",
            delete: "/crowdfunding/nftCrowdfunding/deleteNftCrowdfundingProfit",
            deleteBatch: "/crowdfunding/nftCrowdfunding/deleteBatchNftCrowdfundingProfit"
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
  