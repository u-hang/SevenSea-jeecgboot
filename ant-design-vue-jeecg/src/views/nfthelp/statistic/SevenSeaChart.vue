<template>
    <div class="page-header-index-wide">
        <a-row :gutter="24">
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card :loading="loading" title="资金池" :total=" nftData.allPrice | MillionFormat">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <!-- <div>
                        <trend flag="up" style="margin-right: 16px;">
                            <span slot="term">周同比</span>
                            12%
                        </trend>
                        <trend flag="down">
                            <span slot="term">日同比</span>
                            11%
                        </trend>
                    </div>
                    <template slot="footer">日均销售额<span>￥ 234.56</span></template> -->
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card :loading="loading" title="藏品总数" :total="nftData.allCounts | NumberFormat">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <!-- <div>
                        <mini-area />
                    </div>
                    <template slot="footer">日订单量<span> {{ '1234' | NumberFormat }}</span></template> -->
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card :loading="loading" title="席位总数" :total="nftData.allChairman | NumberFormat">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <!-- <div>
                        <mini-bar :height="40" />
                    </div>
                    <template slot="footer">转化率 <span>60%</span></template> -->
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card :loading="loading" title="会员总计" :total="nftData.allUsers| NumberFormat">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <!-- <div>
                        <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" :height="8" />
                    </div>
                    <template slot="footer">
                        <trend flag="down" style="margin-right: 16px;">
                            <span slot="term">同周比</span>
                            12%
                        </trend>
                        <trend flag="up">
                            <span slot="term">日环比</span>
                            80%
                        </trend>
                    </template>-->
                </chart-card>
            </a-col>
        </a-row>

        <a-row :gutter="24">
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card :loading="loading" title="昨日活跃会员数" :total="nftData.beforePlayer | NumberFormat">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card :loading="loading" title="今日活跃会员数" :total="nftData.currPlayer | NumberFormat">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card :loading="loading" title="今日竞拍藏品数" :total="nftData.allSale | NumberFormat">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card :loading="loading" title="今日举牌次数" :total="nftData.allAct | NumberFormat">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                </chart-card>
            </a-col>
        </a-row>

        <a-row>
            <a-col :span="24">
                <a-card :loading="loading" :bordered="false" title="最近一周访问量统计" :style="{ marginTop: '24px' }">
                    <a-row>
                        <a-col :span="6">
                            <head-info title="今日IP" :content="loginfo.todayIp"></head-info>
                        </a-col>
                        <a-col :span="2">
                            <a-spin class='circle-cust'>
                                <a-icon slot="indicator" type="environment" style="font-size: 24px" />
                            </a-spin>
                        </a-col>
                        <a-col :span="6">
                            <head-info title="今日访问" :content="loginfo.todayVisitCount"></head-info>
                        </a-col>
                        <a-col :span="2">
                            <a-spin class='circle-cust'>
                                <a-icon slot="indicator" type="team" style="font-size: 24px" />
                            </a-spin>
                        </a-col>
                        <a-col :span="6">
                            <head-info title="总访问量" :content="loginfo.totalVisitCount"></head-info>
                        </a-col>
                        <a-col :span="2">
                            <a-spin class='circle-cust'>
                                <a-icon slot="indicator" type="rise" style="font-size: 24px" />
                            </a-spin>
                        </a-col>
                    </a-row>
                    <line-chart-multid :fields="visitFields" :dataSource="visitInfo"></line-chart-multid>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { axios } from '@/utils/request'
import ChartCard from '@/components/ChartCard'
import ACol from "ant-design-vue/es/grid/Col"
import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
import MiniArea from '@/components/chart/MiniArea'
import MiniBar from '@/components/chart/MiniBar'
import MiniProgress from '@/components/chart/MiniProgress'
import LineChartMultid from '@/components/chart/LineChartMultid'
import HeadInfo from '@/components/tools/HeadInfo.vue'
import Trend from '@/components/Trend'
import { getLoginfo,getVisitInfo } from '@/api/api'

export default {
    name: "IndexChart",
    components: {
        ATooltip,
        ACol,
        ChartCard,
        MiniArea,
        MiniBar,
        MiniProgress,
        LineChartMultid,
        HeadInfo,
        Trend
    },
    data() {
        return {
            loading: true,
            center: null,
            loginfo:{},
            visitFields:['ip','visit'],
            visitInfo:[],
            nftData:{},
            indicator: <a-icon type="loading" style="font-size: 24px" spin />
        }
    },
    created() {
        setTimeout(() => {
            this.loading = !this.loading
        }, 1000)
        this.initLogInfo();
        this.getSevenSeaInfo();
    },
    methods: {
        getSevenSeaInfo(){
            return axios({
                url: "/nft/nftInfoStatistic/dashboard",
                method: "get"
            }).then((data) => {
                // this.$loading().close();
                console.log(data);
                if(data.success){
                    this.nftData=data.result;
                }
            })
        },
        initLogInfo() {
            getLoginfo(null).then((res) => {
                if (res.success) {
                    Object.keys(res.result).forEach(key => {
                        res.result[key] = res.result[key] + ""
                    })
                    this.loginfo = res.result;
                }
            })
            getVisitInfo().then(res => {
                if (res.success) {
                    this.visitInfo = res.result;
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
.circle-cust {
    position: relative;
    top: 28px;
    left: -100%;
}

/* 首页访问量统计 */
.head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
        text-align: center;
        padding: 0 32px;
    }

    span {
        color: rgba(0, 0, 0, .45);
        display: inline-block;
        font-size: .95rem;
        line-height: 42px;
        margin-bottom: 4px;
    }

    p {
        line-height: 42px;
        margin: 0;

        a {
            font-weight: 600;
            font-size: 1rem;
        }
    }
}</style>