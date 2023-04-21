<template>
  <a-card title="" :bordered="false">

    <!-- <div style="margin-bottom: 8px;">
      <span>启用数据变动特效：</span>
      <a-switch v-model="reloadEffect" />
    </div> -->

    <!--
        【即时保存大体思路】：
        1. 该功能依赖于【即时保存】功能，请先看即时保存示例
        2. 必须要有 socket-reload 属性，且设为 true
        3. 必须要有 socket-key 属性，该属性为当前表格的唯一标识，
           系统会自动更新所有 socket-key 相同的表格
        4. 在局部保存 edit-closed 事件中，
           保存成功后调用 socketSendUpdateRow 方法，将当前 row 传递过去即可 （见第 108 行）
      -->
    <j-vxe-table ref="table" row-number row-selection keep-source socket-reload socket-key="demo-socket-reload"
      :reload-effect="reloadEffect" :height="340" :loading="loading" :columns="columns" :dataSource="dataSource" />
  </a-card>
</template>
  
<script>
import { getAction } from '@api/manage'
import { JVXETypes } from '@/components/jeecg/JVxeTable'
import moment from 'moment'
import { ClientRequest } from 'http'

// 无痕刷新示例
export default {
  name: 'NftInfoHistoryList',
  props: {
    mainId: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      loading: false,
      dataSource: [],
      columns: [
        { key: 'type', title: '类型', align: 'center',width: '80px' },
        {
          key: 'price',
          title: '价格',
          align: 'center',
          width: '240px',
          type:JVXETypes.input,
          formatter({cellValue, row, column}) {
            return !cellValue ? "" : ((cellValue).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            }).replace("$", ""));
          },
        },
        { key: 'fromName', title: '会员昵称', align: 'center',width: '260px' },
        { 
          key: 'createTime', 
          title: '举牌时间', 
          width: '200px', 
          align: 'center',
          type:JVXETypes.datetime,
          formatter({cellValue, row, column}) {
            return !cellValue ? "" : (moment(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss'));
          },
        },
      ],
      // 查询url地址
      url: {
        getData: '/nft/nftInfo/queryHistoryById',
      },
      // 是否启用日历刷新效果
      reloadEffect: false,
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData() {
      let formData = { pageNo: 0, pageSize: 200, id: this.mainId }
      this.loading = true
      getAction(this.url.getData, formData).then(res => {
        if (res.success) {
          this.dataSource = res.result.records
        } else {
          this.$error({ title: '主表查询失败', content: res.message })
        }
      }).finally(() => {
        this.loading = false
      })
    },
  },
}
</script>
  
<style scoped></style>