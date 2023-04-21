<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="众筹名称">
              <a-input placeholder="请输入众筹名称" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="众筹状态">
              <j-dict-select-tag placeholder="请选择众筹状态" v-model="queryParam.state" dictCode="funding_state" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="众筹类型">
                <j-dict-select-tag placeholder="请选择众筹类型" v-model="queryParam.type" dictCode="funding_type" />
              </a-form-item>
            </a-col>
            <a-col :xl="10" :lg="11" :md="12" :sm="24">
              <a-form-item label="发布时间">
                <j-date placeholder="请选择开始日期" class="query-group-cust" v-model="queryParam.publishTime_begin"></j-date>
                <span class="query-group-split-cust"></span>
                <j-date placeholder="请选择结束日期" class="query-group-cust" v-model="queryParam.publishTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xl="10" :lg="11" :md="12" :sm="24">
              <a-form-item label="结束时间">
                <j-date placeholder="请选择开始日期" class="query-group-cust" v-model="queryParam.endingTime_begin"></j-date>
                <span class="query-group-split-cust"></span>
                <j-date placeholder="请选择结束日期" class="query-group-cust" v-model="queryParam.endingTime_end"></j-date>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
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
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'crowdfunding:nft_crowdfunding:add'">新增</a-button>
      <a-button type="primary" icon="download" @click="onExportXls"
        v-has="'crowdfunding:nft_crowdfunding:exportXls'">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
        @change="handleImportExcel" v-has="'crowdfunding:nft_crowdfunding:importExcel'">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"
        v-has="'crowdfunding:nft_crowdfunding:search'"></j-super-query>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
            selectedRowKeys.length
        }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table ref="table" size="middle" bordered rowKey="id" class="j-table-force-nowrap" :scroll="{ x: true }"
        :columns="columns" :dataSource="dataSource" :pagination="ipagination" :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
        :customRow="clickThenSelect" @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt=""
            style="max-width:80px;font-size: 12px;font-style: italic;" />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" v-has="'crowdfunding:nft_crowdfunding:edit'">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link" v-has="'crowdfunding:nft_crowdfunding:delete'">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="项目资产" key="1" forceRender>
        <NftCrowdfundingPropertyList :mainId="nftCrowdfundingPropertyMainId" />
      </a-tab-pane>
      <a-tab-pane tab="项目参与成员" key="2">
        <NftWalletCrowdfundingList :mainId="nftWalletCrowdfundingMainId" />
      </a-tab-pane>
      <a-tab-pane tab="项目分红情况" key="3">
        <NftCrowdfundingProfitList :mainId="nftCrowdfundingProfitMainId" />
      </a-tab-pane>
    </a-tabs>

    <nftCrowdfunding-modal ref="modalForm" @ok="modalFormOk"></nftCrowdfunding-modal>
  </a-card>
</template>

<script>
import { axios } from '@/utils/request'
import { httpAction, downloadFile } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import NftCrowdfundingModal from './modules/NftCrowdfundingModal'
import { getAction } from '@/api/manage'
import NftWalletCrowdfundingList from './NftWalletCrowdfundingList'
import NftCrowdfundingPropertyList from './NftCrowdfundingPropertyList'
import NftCrowdfundingProfitList from './NftCrowdfundingProfitList'
import { initDictOptions, filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import '@/assets/less/TableExpand.less'

export default {
  name: "NftCrowdfundingList",
  mixins: [JeecgListMixin],
  components: {
    NftWalletCrowdfundingList,
    NftCrowdfundingPropertyList,
    NftCrowdfundingProfitList,
    NftCrowdfundingModal
  },
  data() {
    return {
      description: 'NFT众筹管理页面',
      // 表头
      columns: [
        {
          title: '众筹名称',
          align: "center",
          dataIndex: 'title'
        },
        {
          title: '众筹状态',
          align: "center",
          dataIndex: 'state_dictText',
        },
        {
          title: '众筹类型',
          align: "center",
          dataIndex: 'type_dictText',
        },
        {
          title: '集资额度',
          align: "center",
          dataIndex: 'fundQuota'
        },
        {
          title: '已达成金额',
          align: "center",
          dataIndex: 'fundsReality'
        },
        {
          title: '发布时间',
          align: "center",
          dataIndex: 'publishTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '结束时间',
          align: "center",
          dataIndex: 'endingTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          fixed: "right",
          width: 147,
          scopedSlots: { customRender: 'action' },
        }
      ],
      url: {
        list: "/crowdfunding/nftCrowdfunding/list",
        delete: "/crowdfunding/nftCrowdfunding/delete",
        deleteBatch: "/crowdfunding/nftCrowdfunding/deleteBatch",
        exportXlsUrl: "/crowdfunding/nftCrowdfunding/exportXls",
        importExcelUrl: "crowdfunding/nftCrowdfunding/importExcel",
      },
      dictOptions: {
        state: [],
        type: [],
      },
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '50'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      selectedMainId: '',
      superFieldList: [],
      nftWalletCrowdfundingMainId: '',
      nftCrowdfundingPropertyMainId: '',
      nftCrowdfundingProfitMainId:''
    }
  },
  created() {
    this.getSuperFieldList();
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  methods: {
    onExportXls() {
      console.log("获取选中行====");
      // var rows=this.table;
      console.log(this.selectionRows[0]);
      var currRow = this.selectionRows[0];
      if (currRow != undefined) {
        console.log("do download====");
        var fileName = currRow.title;
        if (!fileName || typeof fileName != "string") {
          fileName = "导出文件"
        }
        return axios({
          url: "/crowdfunding/nftCrowdfunding/exportXls",
          data: currRow,
          method: "post",
          responseType: 'blob'
        }).then((data) => {
          if (!data) {
            this.$message.warning("文件下载失败")
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), fileName + '.xlsx')
          } else {
            let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName + '.xlsx')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
          }
        })
        // downloadFile("/crowdfunding/nftCrowdfunding/exportXls",fileName,currRow)
      } else {
        console.log("error====");
      }
    },
    initDictConfig() {
    },
    clickThenSelect(record) {
      return {
        on: {
          click: () => {
            this.onSelectChange(record.id.split(","), [record]);
          }
        }
      }
    },
    onClearSelected() {
      this.selectedRowKeys = [];
      this.selectionRows = [];
      this.selectedMainId = ''
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedMainId = selectedRowKeys[0]
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
      this.nftWalletCrowdfundingMainId = selectionRows[0]['id'];
      this.nftCrowdfundingPropertyMainId = selectionRows[0]['id'];
      this.nftCrowdfundingProfitMainId = selectionRows[0]['id'];
    },
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error("请设置url.list属性!")
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      this.onClearSelected()
      var params = this.getQueryParams();//查询条件
      this.loading = true;
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false;
      })
    },
    getSuperFieldList() {
      let fieldList = [];
      fieldList.push({ type: 'string', value: 'title', text: '众筹名称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'state', text: '众筹状态', dictCode: 'funding_state' })
      fieldList.push({ type: 'string', value: 'type', text: '众筹类型', dictCode: 'funding_type' })
      fieldList.push({ type: 'BigDecimal', value: 'fundQuota', text: '集资额度', dictCode: '' })
      fieldList.push({ type: 'BigDecimal', value: 'fundsReality', text: '已达成金额', dictCode: '' })
      fieldList.push({ type: 'date', value: 'publishTime', text: '发布时间' })
      fieldList.push({ type: 'date', value: 'endingTime', text: '结束时间' })
      this.superFieldList = fieldList
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less'
</style>