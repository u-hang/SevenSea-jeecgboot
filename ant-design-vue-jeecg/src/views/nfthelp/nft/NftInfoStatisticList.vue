<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="doSync" type="primary" icon="plus">同步</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('nft_info_statistic')">导出</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <el-statistic group-separator="," :precision="2" :value="value2" :title="title"></el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic title="男女比">
            <template slot="formatter"> 456/2 </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic group-separator="," :precision="2" decimal-separator="." :value="value1" :title="title">
            <template slot="prefix">
              <i class="el-icon-s-flag" style="color: red"></i>
            </template>
            <template slot="suffix">
              <i class="el-icon-s-flag" style="color: blue"></i>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic :value="like ? 521 : 520" title="Feedback">
            <template slot="suffix">
              <span @click="like = !like" class="like">
                <i class="el-icon-star-on" style="color:red" v-show="!!like"></i>
                <i class="el-icon-star-off" v-show="!like"></i>
              </span>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>
  </div>
  
    <div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">
      </a-table>
    </div>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { axios } from '@/utils/request'
  import moment from 'moment'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: 'NftInfoStatisticList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      // NftInfoStatisticModal
    },
    data () {
      return {
        like: true,
        value1: 4154.564,
        value2: 2222,
        title: '今年的增长',
        description: 'nft_info_statistic管理页面',
        // 表头
        columns: [
          {
            title:'类型',
            align:"center",
            dataIndex: 'typeText'
          },
          {
            title:'藏品总数',
            align:"center",
            sorter: true,
            dataIndex: 'totalCounts'
          },
          {
            title:'藏品总价',
            align:"center",
            sorter: true,
            dataIndex: 'totalPrice',
            customRender: function (text) {
              return !text ? "" : ((text/1000000).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              }).replace("$", ""));
            }
          },
          {
            title:'藏品最高价',
            align:"center",
            sorter: true,
            dataIndex: 'maxPrice',
            customRender: function (text) {
              return !text ? "" : ((text/1000000).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              }).replace("$", ""));
            }
          },
          {
            title:'藏品最低价',
            align:"center",
            sorter: true,
            dataIndex: 'minPrice',
            customRender: function (text) {
              return !text ? "" : ((text/1000000).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              }).replace("$", ""));
            }
          },
          {
            title:'席位数量',
            align:"center",
            sorter: true,
            dataIndex: 'chairman'
          },
          {
            title:'在售藏品数量',
            align:"center",
            sorter: true,
            dataIndex: 'currSale'
          },
          {
            title:'当前交易总额',
            align:"center",
            sorter: true,
            dataIndex: 'currTotal',
            customRender: function (text) {
              return !text ? "" : ((text/1000000).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              }).replace("$", ""));
            }
          },
          {
            title:'当前交易均价',
            align:"center",
            sorter: true,
            dataIndex: 'currAvg',
            customRender: function (text) {
              return !text ? "" : ((text/1000000).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              }).replace("$", ""));
            }
          },
          {
            title:'当前参与交易人数',
            align:"center",
            sorter: true,
            dataIndex: 'currMember'
          },
          {
            title:'当前交易竞拍次数',
            align:"center",
            sorter: true,
            dataIndex: 'currAct'
          },
          {
            title:'统计时间',
            align:"center",
            dataIndex: 'createTime',            
            customRender: function (text) {
              return !text ? "" : (moment(new Date(text*1000)).format('YYYY-MM-DD HH:mm:ss'));
            }
          },
        ],
        url: {
          list: "/nft/nftInfoStatistic/list",
          importExcelUrl: "nft/nftInfoStatistic/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      doSync() {      
        return axios({
          url: "/nft/nftInfoStatistic/sync",
          method: "post"
        }).then((data) => {
        
        })
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'typeText',text:'类型',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'totalCounts',text:'藏品总数',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'totalPrice',text:'藏品总价',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'maxPrice',text:'藏品最高价',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'minPrice',text:'藏品最低价',dictCode:''})
        fieldList.push({type:'int',value:'chairman',text:'席位数量',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'currSale',text:'在售藏品数量',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'currTotal',text:'当前交易总额',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'currAvg',text:'当前交易均价',dictCode:''})
        fieldList.push({type:'int',value:'currMember',text:'当前参与交易人数',dictCode:''})
        fieldList.push({type:'int',value:'currAct',text:'当前交易竞拍次数',dictCode:''})
        fieldList.push({type:'int',value:'createTime',text:'统计时间',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
  .like {
    cursor: pointer;
    font-size: 25px;
    display: inline-block;
  }
</style>