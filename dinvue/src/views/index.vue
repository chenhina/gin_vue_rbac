<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <div class="card">
        <el-col :xs="24" :lg="16" :md="16">
          <div class="car-left">
            <el-row>
              <div>
                <el-col :xs="20" :lg="12" :md="12">
                  <div class="text">
                    <h4>早安，管理员， 请开始您一天的工作吧！</h4>
                    <p class="tips-text">
                      <i class="el-icon-sunny el-icon"/>
                      <span>今日晴，0℃ - 10℃，天气寒冷，注意添加衣物。</span>
                    </p>
                  </div>
                </el-col>
              </div>
            </el-row>
          </div>
        </el-col>
        <el-col :xs="24" :lg="8" :md="8">
          <div class="car-right">
            <el-row>
              <el-col :span="8">
                <div class="car-item">
                  <span class="flow"><i class="el-icon-s-grid"/></span>
                  <span>今日流量 </span>
                  <b>13260</b>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="car-item">
                  <span class="user-number">
                    <i class="el-icon-s-custom"/>
                  </span>
                  <span>总用户 </span>
                  <b>48286</b>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="car-item">
                  <span class="feedback">
                    <i class="el-icon-star-on"/>
                  </span>
                  <span>好评率 </span>
                  <b>98%</b>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </div>
    </el-row>
<!--    <el-row>-->
<!--      <el-card shadow="hover">-->
<!--        <h2>-->
<!--          使用教学：<a style="color:#409EFF" target="view_window" href="https://www.bilibili.com/video/BV1fV411y7dT/">https://www.bilibili.com/video/BV1fV411y7dT/</a>-->
<!--        </h2>-->
<!--        <br>-->
<!--        <h2>-->
<!--          工作流教学：<a style="color:#409EFF" target="view_window" href="https://www.bilibili.com/video/BV1Ka411F7Ji/">https://www.bilibili.com/video/BV1Ka411F7Ji/</a>-->
<!--        </h2>-->
<!--        <div/>-->
<!--      </el-card>-->
<!--    </el-row>-->
    <div class="bottom">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="chart-player">
            <music-player/>
          </div>
        </el-col>

      </el-row>


      <el-divider/>
    </div>
  </div>
</template>

<script>
  import musicPlayer from "./musicPlayer";

  export default {
    name: "Index",
    data() {
      return {
        // 版本号
        version: "1.1.1"
      };
    },
    methods: {
      goTarget(href) {
        window.open(href, "_blank");
      }
    },
    components: {
      musicPlayer
    }
  };
</script>

<style scoped lang="scss">
  .home {
    blockquote {
      padding: 10px 20px;
      margin: 0 0 20px;
      font-size: 17.5px;
      border-left: 5px solid #eee;
    }

    hr {
      margin-top: 20px;
      margin-bottom: 20px;
      border: 0;
      border-top: 1px solid #eee;
    }

    .col-item {
      margin-bottom: 20px;
    }

    ul {
      padding: 0;
      margin: 0;
    }

    font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 13px;
    color: #676a6c;
    overflow-x: hidden;

    ul {
      list-style-type: none;
    }

    h4 {
      margin-top: 0px;
    }

    h2 {
      margin-top: 10px;
      font-size: 26px;
      font-weight: 100;
    }

    p {
      margin-top: 10px;

      b {
        font-weight: 700;
      }
    }

    .update-log {
      ol {
        display: block;
        list-style-type: decimal;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0;
        margin-inline-end: 0;
        padding-inline-start: 40px;
      }
    }
  }
</style>

