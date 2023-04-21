<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="拍卖状态">
              <j-dict-select-tag placeholder="请选择拍卖状态" v-model="queryParam.status" dictCode="sale_state" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="资产类型">
              <j-dict-select-tag placeholder="请选择资产类型" v-model="queryParam.assetTypeId"
                dictCode="nft_info_kind_dictionary,name,code" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="开始时间">
                <j-date placeholder="请选择开始时间" v-model="queryParam.startTime"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="结束时间">
                <j-date placeholder="请选择结束时间" v-model="queryParam.endTime"></j-date>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus? '收起': '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="doSync" type="primary" icon="plus">同步</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('nft_info')">导出</a-button>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal"
        @handleSuperQuery="handleSuperQuery"></j-super-query>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length
        }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table ref="table" size="middle" :scroll="{ x: true }" bordered rowKey="id" :columns="columns"
        :dataSource="dataSource" :pagination="ipagination" :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt=""
            style="max-width:80px;font-size: 12px;font-style: italic;" preview="text" />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleEdit(record)">详情</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <nft-info-modal ref="modalForm" @ok="modalFormOk"></nft-info-modal>
  </a-card>
</template>

<script>

import ElementUI from 'element-ui'
import { axios } from '@/utils/request'
import { getAction } from '@/api/manage'
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import NftInfoModal from './modules/NftInfoModal'

export default {
  name: 'NftInfoList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    NftInfoModal
  },
  data() {
    return {
      description: 'nft_info管理页面',
      // 表头
      columns: [
        {
          title: '藏品图片',
          align: "center",
          dataIndex: 'assetImageUrl',
          scopedSlots: { customRender: 'imgSlot' }
        },
        {
          title: '藏品名称',
          align: "center",
          dataIndex: 'name'
        },
        {
          title: '资产类型',
          align: "center",
          dataIndex: 'assetTypeId_dictText'
        },
        {
          title: '藏品编号',
          align: "center",
          dataIndex: 'id'
        },
        {
          title: '拍卖编号',
          align: "center",
          dataIndex: 'auctionNumber'
        },
        {
          title: '状态',
          align: "center",
          dataIndex: 'status',
          customRender: function (text) {
            if (text != 3) {
              return "未拍卖";
            } else {
              return "拍卖中";
            }
          }
        },
        {
          title: '当前出价',
          align: "center",
          sorter: true,
          dataIndex: 'nftPrice',
          customRender: function (text) {
            return !text ? "" : ((text/1000000).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            }).replace("$", ""));
          }
        },
        {
          title: '收藏次数',
          align: "center",
          sorter: true,
          dataIndex: 'collectCount'
        },
        {
          title: '所有者昵称',
          align: "center",
          dataIndex: 'ownerUserNickName'
        },
        {
          title: '创建时间',
          align: "center",
          sorter: true,
          dataIndex: 'createTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 19 ? text.substr(0, 19) : text)
          }
        },
        {
          title: '开始时间',
          align: "center",
          sorter: true,
          dataIndex: 'startTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 19 ? text.substr(0, 19) : text)
          }
        },
        {
          title: '结束时间',
          align: "center",
          sorter: true,
          dataIndex: 'endTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 19 ? text.substr(0, 19) : text)
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          fixed: "right",
          width: 120,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: "/nft/nftInfo/list",
        delete: "/nft/nftInfo/delete",
        deleteBatch: "/nft/nftInfo/deleteBatch",
        exportXlsUrl: "/nft/nftInfo/exportXls",
        importExcelUrl: "nft/nftInfo/importExcel",

      },
      dictOptions: {},
      superFieldList: [],
    }
  },
  created() {
    this.getSuperFieldList();
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
    getImgView(text) {
      return text;
    },
    
    doSync() {
      // this.$loading();
      return axios({
        url: "/nft/nftInfo/sync",
        method: "post"
      }).then((data) => {
        // this.$loading().close();
      })
    },

    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = [];
      fieldList.push({ type: 'string', value: 'assetImageUrl', text: '资产图片网址', dictCode: '' })
      fieldList.push({ type: 'int', value: 'assetTypeId', text: '资产类型Id', dictCode: 'nft_info_kind_dictionary' })
      fieldList.push({ type: 'int', value: 'auctionNumber', text: '拍卖编号', dictCode: '' })
      fieldList.push({ type: 'int', value: 'categoryId', text: '类别编号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'chainConfigName', text: '链名称', dictCode: '' })
      fieldList.push({ type: 'int', value: 'clickCount', text: '点击次数', dictCode: '' })
      fieldList.push({ type: 'string', value: 'coinConfigName', text: '货币种类', dictCode: '' })
      fieldList.push({ type: 'int', value: 'collectCount', text: '收藏次数', dictCode: '' })
      fieldList.push({ type: 'string', value: 'contractAddress', text: '合约地址', dictCode: '' })
      fieldList.push({ type: 'date', value: 'createTime', text: '创建时间' })
      fieldList.push({ type: 'string', value: 'createUserImgLogo', text: '创建者头像', dictCode: '' })
      fieldList.push({ type: 'string', value: 'createUserNickName', text: '创建用户昵称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'creator', text: '创建用户', dictCode: '' })
      fieldList.push({ type: 'date', value: 'endTime', text: '结束时间' })
      fieldList.push({ type: 'int', value: 'isCollect', text: '收藏标识', dictCode: '' })
      fieldList.push({ type: 'string', value: 'name', text: '类型', dictCode: '' })
      fieldList.push({ type: 'BigDecimal', value: 'nftPrice', text: '当前出价', dictCode: '' })
      fieldList.push({ type: 'string', value: 'owner', text: '所有者', dictCode: '' })
      fieldList.push({ type: 'string', value: 'ownerUserImgLogo', text: '所有者头像', dictCode: '' })
      fieldList.push({ type: 'string', value: 'ownerUserNickName', text: '所有者昵称', dictCode: '' })
      fieldList.push({ type: 'date', value: 'startTime', text: '开始时间' })
      fieldList.push({ type: 'int', value: 'status', text: '状态', dictCode: 'sale_state' })
      fieldList.push({ type: 'string', value: 'tokenId', text: '代币id', dictCode: '' })
      fieldList.push({ type: 'string', value: 'tokenStandard', text: '代币标准', dictCode: '' })
      this.superFieldList = fieldList
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>