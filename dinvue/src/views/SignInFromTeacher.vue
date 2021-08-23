<template>
  <div class="SignInFromTeacher">
    <div style="width: 70%;float: left">

      <div id="myChart2" :style="{width: '100%', height: '500px'}"></div>
    </div>
    <div style="width: 30%;float: right">

      <el-date-picker type="date" placeholder="选择日期，查看签到详情" v-model="date1" style="width: 70%;"></el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="lookOneDay">查看</el-button>

      <div id="myChart" :style="{width: '100%', height: '500px'}"></div>
    </div>
    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false" :destroy-on-close="true">
      <el-table :data="tableData" stripe style="width: 100%;"
                :cell-style="{ textAlign: 'center' }"
                :header-cell-style="{textAlign: 'center'}">
        <el-table-column
            prop="name"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="is_late"
            :formatter="formatter"
            label="签到情况">

        </el-table-column>
      </el-table>

    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "SignInFromTeacher",
  data() {
    return {
      value: new Date(),
      calendarData: [],
      LateCount: 0,
      PunctualCount: 0,
      date1: '',
      drawer: false,
      tableData: []
    }
  },
  methods: {
    formatter(row, column) {
      return row ? "迟到" : "准时";
    },
    dateFtt(fmt, date) {
      var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    },
    lookOneDay() {
      if (this.date1 === '') {
        this.$message({
          message: '请选择查询日期',
          type: 'warning'
        })
        return
      }
      let data2 = this.dateFtt("yyyy-MM-dd", this.date1)
      this.$http.get(this.$settings.base_url + 'user/sign_in_day/?day=' + data2).then(res => {
        if (res.data.code === 100) {
          this.tableData = res.data.data
          this.drawer = true
        }
      })

    },
    signinList() {
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      myChart2.setOption({
        title: {
          text: '签到情况周统计'
        },
        legend: {},
        tooltip: {},
        dataset: {
          source: []
        },
        yAxis: {},
        xAxis: {type: 'category'},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {type: 'bar', itemStyle: {color: '#1E90FF'}},
          {type: 'bar', itemStyle: {color: '#FFA500'}},
          {type: 'bar', itemStyle: {color: '#c4c4c4'}}
        ]
      });
      // 异步加载数据
      $.get(this.$settings.base_url + 'user/sign_in_all/?classes=python17期').done(function (data) {
        myChart2.hideLoading();
        // 填入数据
        myChart2.setOption({
          dataset: {
            source: data.data
          },
        });
      });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '签到统计情况',
          subtext: '今日签到情况',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
      });
      // 异步加载数据
      $.get(this.$settings.base_url + 'user/sign_in_all/?classes=python17期').done(function (data) {
        myChart.hideLoading();
        // 填入数据
        myChart.setOption({
          series: [
            {
              name: '签到情况',
              type: 'pie',
              radius: '50%',
              data: [
                {value: data.data2.data[0], name: '准时', itemStyle: {color: '#1E90FF'}},
                {value: data.data2.data[1], name: '迟到', itemStyle: {color: '#FFA500'}},
                {value: data.data2.data[2], name: '缺勤', itemStyle: {color: '#c4c4c4'}},
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]

        });
      });
    }
  },
  computed: {},
  mounted() {
    this.drawLine();
    this.signinList();
  },

}
</script>

<style scoped>
.everyDay {
  display: inline-block;
  width: 20px;
  height: 20px;
  color: #fff;
  border-radius: 50%;
}

.bg_orange {
  background-color: #ffa500;
}

.bg_dodgerblue {
  background-color: #1e90ff;
}
</style>