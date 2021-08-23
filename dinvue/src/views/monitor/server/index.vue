<template>
  <div class="app-container">
    <!-- 监控控制 -->
    <div class="server-monitor-control">
      <!-- 监控启用开关 -->
      <div class="control-server-monitor same-block">
        开启监控：
        <el-switch
          v-model="isOpeningMonitor"
          active-color="#13ce66"
          inactive-color="#ff4949"
          title="控制所有监控项"
          @change="changeMonitorStatus"
        />
      </div>
      <!-- 更新频率设置 -->
      <div class="monitor-update-interval same-block">
        监控频率：
        <el-input-number
          v-model="monitorUpdateInterval"
          label=""
          class="monitor-update-interval-blank"
          controls-position="right"
          :min="minMonitorUpdateInterval"
          @input="handleIntervalChange"
        />
        <el-select
          v-model="intervalType"
          class="monitor-update-interval-unit"
          @change="selectIntervalType"
        >
          <el-option
            v-for="item in Object.keys(INTERVAL_ID_TO_TYPE_MAPPING)"
            :key="INTERVAL_ID_TO_TYPE_MAPPING[item].type"
            :label="INTERVAL_ID_TO_TYPE_MAPPING[item].name"
            :value="INTERVAL_ID_TO_TYPE_MAPPING[item].name"
          />
        </el-select>

      </div>
      <!-- 监控日志保存时间 -->
      <div class="monitor-log-save-time same-block">
        保存天数：
        <el-input v-model="monitorLogSavingDays" class=" same-block" style="width: 120px;"/>
        <el-button
          type="primary"
          class="same-block"
          title="只有提交更改才会生效"
          @click="updateMonitorStatusSettingsInfo"
        >更改
        </el-button>
      </div>
      <!-- 清空记录 -->
      <div class="clean-monitor-log same-block">
        <el-button
          class="same-block"
          type="warning"
          title="清空所有监控记录"
          @click="cleanMonitorLogsInfo"
        >清空记录
        </el-button>
      </div>
    </div>

    <div class="server-monitor-top">
      <!-- 左侧服务器信息 -->
      <el-card class="box-card server-information">
        <div slot="header" class="clearfix">
          <div class="server-info-item">服务器</div>
          <el-select
            filterable
            :value="currentServerName"
            class="server-info-item"
            placeholder="请选择服务器"
            @change="chooseServerInfo"
          >
            <el-option
              v-for="(item,index) in allServerInfo"
              :key="item.id"
              :label="item.ip"
              :value="index"
            />
          </el-select>
          <el-button
            type="primary"
            class="server-info-item"
            title="只有提交更改才会生效"
            @click="updateServerInfo"
          >更改
          </el-button>
        </div>
        <div class="server-info-detail">
          <div v-for="(key,index) in currentServerInfoKeys" :key="index" class="server-info-detail-line text item">
            <div class="server-info-detail-item">
              <div style="width: 30%;display: inline-block;">{{ SERVER_KEY_TO_NAME_MAPPING[key] }}:</div>
              <div v-if="CHANGEABLE_SERVER_FIELDS.indexOf(key) > -1" style="display: inline-block;">
                <el-input v-model="currentServer[key]" style="display: inline-block; width: 90%;"/>
              </div>
              <div v-else style="display: inline-block; "> {{ currentServer[key] }}</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 右侧仪表盘 -->
      <el-card
        v-for="(key, index) of Object.keys(instrumentBoardData)"
        :key="`${index}-${key}`"
        class="box-card information-instrument-panel"
      >
        <instrument-board
          :show-top-title="true"
          :show-sub-title="true"
          :ring-graph-key="key"
          :instrument-board-data="instrumentBoardData[key]"
          :top-title-key-to-name-mapping="INSTRUMENT_BOARD_KEY_TO_NAME_MAPPING"
        />
      </el-card>
    </div>
    <!--  下方折线图  -->
    <div class="server-monitor-bottom">
      <!-- 折线图 -->
      <el-card
        class="box-card server-monitor-line-chart"
      >
        <div id="CpuChart" :style="{width: '100%', height: '500px'}"></div>

      </el-card>
      <el-card
        class="box-card server-monitor-line-chart"
      >
        <div id="MemoryChart" :style="{width: '100%', height: '500px'}"></div>

      </el-card>

    </div>
  </div>
</template>

<script>
  import {
    cleanMonitorLog,
    getMonitorLogs,
    getMonitorStatusInfo,
    getServerLatestLog,
    getServerList,
    updateMonitorStatusInfo,
    updateServerInfo,
    getEachServerInfo
  } from "@/api/monitor/server";
  import InstrumentBoard from "@/views/monitor/server/components/InstrumentBoard";
  import LineChart from "@/views/monitor/server/components/LineChart";
  import moment from "moment";
  import * as echarts from 'echarts';

  const debounce = require("lodash/debounce");

  // 要展示的信息，key -> name
  const SERVER_KEY_TO_NAME_MAPPING = {
    ip: "服务器IP",
    name: "Go版本",
    os: "操作系统",
    remark: "goroutine数"
  };

  // 更新频率类型映射
  const INTERVAL_ID_TO_TYPE_MAPPING = {
    0: {
      type: 0,
      name: "秒",
      key: "seconds",
      second: 1
    },
    1: {
      type: 1,
      name: "分钟",
      key: "minutes",
      second: 60
    }
  };
  const defaultUpdateInterval = INTERVAL_ID_TO_TYPE_MAPPING["0"];

  // 图表字段映射
  const CHART_KEY_NAME_MAPPING = {
    cpu: "CPU",
    memory: "内存",
    disk: "磁盘"
  };

  // 仪表盘字段映射
  const INSTRUMENT_BOARD_KEY_TO_NAME_MAPPING = {
    cpu: "CPU使用率",
    memory: "内存使用率"
  };

  // 服务器信息可修改字段
  const CHANGEABLE_SERVER_FIELDS = [];

  export default {
    name: "Server",
    components: {
      InstrumentBoard,
      LineChart
    },
    data() {
      return {
        SERVER_KEY_TO_NAME_MAPPING,
        INTERVAL_ID_TO_TYPE_MAPPING,
        CHART_KEY_NAME_MAPPING,
        CHANGEABLE_SERVER_FIELDS,
        INSTRUMENT_BOARD_KEY_TO_NAME_MAPPING,
        timeRange: [
          `${moment().format("YYYY-MM-DD")} 00:00:00`,
          `${moment().format("YYYY-MM-DD")} 23:59:59`
        ],
        // 加载层信息
        loading: [],
        // 所有服务器信息
        allServerInfo: [],
        // 当前展示的服务器名称
        currentServerName: "",
        // 当前展示的服务器信息
        currentServer: {},
        // 当前展示的服务器信息索引，更新服务器信息时用
        currentServerIndex: 0,
        // 开启监控控制按钮
        isOpeningMonitor: false,
        // 数据更新频率
        monitorUpdateInterval: 5,
        // 最小更新频率值
        minMonitorUpdateInterval: 1,
        // 更新频率类型
        intervalType: defaultUpdateInterval.name,
        // 更新频率单位对应秒
        intervalTypeUnits: defaultUpdateInterval.second,
        // 监控日志保存天数
        monitorLogSavingDays: 30,
        // 折线图数据
        lineChartData: {},
        // 仪表盘数据
        instrumentBoardData: {},
        // echarts
        // timeTrick: 5,
        dataTime: [],
        dataMemory: [],
        dataCpu: [],
        flag: true,
      };
    },
    computed: {
      currentServerInfoKeys() {
        return Object.keys(this.currentServer).filter(key => {
          if (SERVER_KEY_TO_NAME_MAPPING[key]) {
            return {[key]: SERVER_KEY_TO_NAME_MAPPING[key]};
          }
        });
      },
      intervalNameToSecondMapping() {
        const intervalNameToSecondMapping = {};
        Object.values(INTERVAL_ID_TO_TYPE_MAPPING).forEach(item => {
          intervalNameToSecondMapping[item.name] = item.second;
        });
        return intervalNameToSecondMapping;
      },
      monitorStatusInfo() {
        return {
          enabled: this.isOpeningMonitor ? 1 : 0,
          save_days: this.monitorLogSavingDays,
          interval: this.monitorUpdateInterval * this.intervalTypeUnits
        };
      }
    },
    watch: {
      currentServer(newServerInfo) {
        if (newServerInfo) {
          // 更新最新监控信息
          this.getServerLatestLogInfo(newServerInfo.id);
          // 获取监控日志信息
          this.getCurrentServerMonitorLogs();
        }
      }
    },
    created() {
      this.openLoading();
      // 获取所有服务器信息
      this.getServerList(this.currentServerIndex);
      // 获取服务器监控频率设置
      this.getMonitorStatusSettingsInfo();
    },
    mounted() {
      this.initeCpuCharts();
      this.initMemoryEchart();
    },
    destroyed() {
      this.flag = false
    },
    methods: {

      initeCpuCharts() {
        var myChart = echarts.init(document.getElementById('CpuChart'));
        myChart.setOption({
          title: {
            text: 'CPU使用率'
          },
          tooltip: {//提示框组件
            trigger: 'axis',
          },
          "legend": {
            "data": [
              "CPU"
            ]
          },
          "xAxis": {
            "axisLabel": {
              "show": true,
              "textStyle": {
                "color": "#00050c",//X轴字体颜色
                "fontSize": 10   //X轴字体大小
              },
            },
            "axisLine": {
              "lineStyle": {
                "color": "#315070"
              }
            },
            "type": "category",
            "boundaryGap": false,
            data: this.dataTime
          },
          // xAxis: {},
          yAxis: {
            "type": "value"
          },
          series: [{
            name: 'CPU',
            type: 'line',//数据显示类型(柱状图bar/折线line)
            data: [],
            smooth: true,
            "label": {
              "normal": {
                "fontSize": 15,
                "show": true, //折点显示数值,
                "position": "top"
              }
            },
            "symbolSize": 5,//折线点的大小，必须加这个，折点上方的数值才会显示
          }]
        });
        setInterval(() => {
          myChart.setOption({
            xAxis: {
              data: this.dataTime
            },
            series: [{
              // 根据名字对应到相应的系列
              name: 'CPU使用率',
              data: this.dataCpu
            }]
          });
        }, 5 * 1000);
      },


      addData(shift) {
        getEachServerInfo().then(res => {
          this.dataTime.push(res.data.datetime)
          this.dataMemory.push(res.data.memory)
          this.dataCpu.push(res.data.cpu)
        });
        if (shift && this.dataTime.length > 10) {
          this.dataTime.shift();
          this.dataMemory.shift();
          this.dataCpu.shift();
        }
      },


      initMemoryEchart() {
        // var myChart = echarts.init(document.getElementById('MemoryChart'), 'dark');
        var myChart = echarts.init(document.getElementById('MemoryChart'));
        myChart.setOption({
          title: {
            text: '内存使用率'
          },
          tooltip: {//提示框组件
            trigger: 'axis',
          },
          "legend": {
            "data": [
              "内存"
            ]
          },
          "xAxis": {
            "axisLabel": {
              "show": true,
              "textStyle": {
                "color": "#000610",//X轴字体颜色
                "fontSize": 10   //X轴字体大小
              },
            },
            "axisLine": {
              "lineStyle": {
                "color": "#315070"
              }
            },
            "type": "category",
            "boundaryGap": false,
            data: this.dataTime
          },
          // xAxis: {},
          yAxis: {
            "type": "value"
          },
          series: [{
            name: '内存',
            type: 'line',//数据显示类型(柱状图bar/折线line)
            data: [],
            smooth: true,
            "label": {
              "normal": {
                "fontSize": 15,
                "show": true, //折点显示数值,
                "position": "top"
              }
            },
            "symbolSize": 5,//折线点的大小，必须加这个，折点上方的数值才会显示
          }]
        });
        this.t2 = setInterval(() => {
          if (this.flag) {
            this.addData(true);
          }
          myChart.setOption({
            xAxis: {
              data: this.dataTime
            },
            series: [{
              // 根据名字对应到相应的系列
              name: '内存使用率',
              data: this.dataMemory
            }]
          });
        }, 5 * 1000);
      },

      /** 查询所有服务器基础信息 */
      getServerList(serverIndex) {
        getServerList({pageNum: "all"}).then(response => {
          this.allServerInfo = response.data;
          if (this.allServerInfo.length > 0) {
            this.currentServer = this.allServerInfo[serverIndex || this.currentServerIndex];
            this.currentServerName = this.currentServer.ip;
          }
          this.loading.close();
        });
      },
      /** 修改服务器信息*/
      updateServerInfo() {
        updateServerInfo(this.currentServer.id, this.currentServer).then(() => {
          this.msgSuccess("修改服务器信息成功！");
        }).catch(error => {
          this.$message.error(error.msg || "提交修改服务器信息出错！");
        }).finally(() => {
          this.getServerList();
        });
      },
      /** 获取服务器最新监控信息 */
      getServerLatestLogInfo(serverId) {
        getServerLatestLog(serverId).then(results => {
          this.instrumentBoardData = results.data;
        }).catch(error => {
          this.msgError(error.msg || "获取服务器最新监控信息错误！");
        });
      },
      /** 获取监控日志信息 */
      getCurrentServerMonitorLogs() {
        getMonitorLogs(this.currentServer.id, {as: JSON.stringify({"create_datetime__range": this.timeRange})}).then(results => {
          this.lineChartData = results.data;
        }).catch(error => {
          this.msgError(error.msg || "获取监控日志信息出错误！");
        });
      },

      /** 清除监控日志 */
      cleanMonitorLogsInfo() {
        this.$confirm("此操作将删除所有的监控记录，是否继续？", "提示", {
          confirmButtonText: "确定删除",
          cancelButtonText: "放弃"
        }).then(() => {
          cleanMonitorLog().then(results => {
            this.msgSuccess("清除记录成功！");
          }).catch(error => {
            this.$message.warning(error.msg || "清除记录失败，请重试！");
          });
        }).catch(() => {
        });
      },

      /** 获取监控配置信息 */
      getMonitorStatusSettingsInfo() {
        getMonitorStatusInfo().then(results => {
          const {enabled, interval, save_days} = results.data;
          this.isOpeningMonitor = enabled;
          this.monitorLogSavingDays = parseInt(save_days);
          this.formatInterval(parseInt(interval));
        }).catch(error => {
          this.msgError(error.msg || "获取服务器监控配置信息出错误！");
        });
      },
      /** 更新监控配置信息 */
      updateMonitorStatusSettingsInfo() {
        updateMonitorStatusInfo(this.monitorStatusInfo).then(() => {
          this.msgSuccess("更新配置成功！");
        }).catch((error) => {
          this.msgError(error.msg || "更新服务器监控配置信息出错误！");
        });
      },

      // 打开加载层
      openLoading() {
        this.loading = this.$loading({
          lock: true,
          text: "拼命读取中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
      },
      // 选择展示的服务器信息
      chooseServerInfo(index) {
        this.currentServerIndex = index;
        this.currentServer = this.allServerInfo[index];
        this.currentServerName = this.currentServer.name || this.currentServer.ip;
      },
      // 更改更新频率（周期）数值
      handleIntervalChange: debounce(function (value) {
        this.monitorUpdateInterval = value;
      }, 500),
      // 选择更新频率（周期） 单位
      selectIntervalType(value) {
        this.intervalType = value;
        this.intervalTypeUnits = this.intervalNameToSecondMapping[value];
      },
      // 修改监控状态
      changeMonitorStatus(value) {
        this.isOpeningMonitor = value;
        this.flag = value
      },
      // 监控周期时间转换
      formatInterval(intervalTime) {
        let biggerInterval = 0;
        for (const interval of Object.values(INTERVAL_ID_TO_TYPE_MAPPING)) {
          if (interval.second > biggerInterval && interval.second < intervalTime) {
            biggerInterval = interval.second;
            this.monitorUpdateInterval = intervalTime / interval.second;
            this.intervalType = interval.name;
            this.intervalTypeUnits = interval.second;
          }
        }
      }
    }
  };
</script>
<style scoped>
  .el-button--medium {
    margin: 2px;
    padding: 10px 10px;
  }

  .server-monitor-top {
    padding: 10px 10px;
    text-align: justify-all;
    overflow-x: scroll;
    display: flex;
  }

  .server-monitor-bottom {
    text-align: left;
    overflow-x: scroll;
    display: flex;
  }

  .server-information {
    width: 20%;
    min-width: 400px;
    min-height: 300px;
    display: inline-block;
  }

  .information-instrument-panel {
    width: 20%;
    display: inline-block;
    min-height: 300px;
    min-width: 300px;
    margin: 0 10px;
  }

  .server-info-item {
    display: inline-block;
    margin: 0 2px;
  }

  .server-info-detail {
    min-height: 200px;
  }

  .server-info-detail-line {
    margin: 5px;
    min-height: 20px;
  }

  .server-info-detail-item {
    text-align: justify;
    line-height: 40px;
    margin: 4px 0;
    overflow: auto;
  }

  .server-monitor-control {
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
  }

  .monitor-update-interval {
    margin: 0 20px;
  }

  .same-block {
    display: inline-block;
  }

  .monitor-update-interval-blank {
    width: 100px;
    margin: 0 2px;
  }

  .monitor-update-interval-unit {
    width: 80px;
    margin: 0 2px;
  }

  .monitor-log-save-time {
    width: 280px;
    margin: 0 2px;
  }

  .clean-monitor-log {
  }

  .server-monitor-line-chart {
    height: 500px;
    width: 50%;
    min-width: 500px;
    margin: 10px;
    display: inline-block;
    overflow-x: scroll;
  }

</style>
