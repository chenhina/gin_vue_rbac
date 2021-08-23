import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Cookies from "js-cookie";


// import '@/assets/css/global.css'


import settings from './assets/js/settings'

Vue.prototype.$settings = settings

import axios from 'axios'

Vue.prototype.$http = axios

import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import {
  addDateRange,
  download,
  handleTree,
  parseTime,
  resetForm,
  selectDictLabel,
  selectDictDefault,
  selectDictLabels
} from "@/utils/ruoyi";

Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;

Vue.prototype.addDateRange = addDateRange;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictDefault = selectDictDefault;
Vue.prototype.selectDictLabels = selectDictLabels;

Vue.prototype.hasPermi = function(values) {
  const permissions = store.getters && store.getters.permissions;
  return permissions.some(permission => {
    return permission === "*:*:*" || values.includes(permission);
  });
};

Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
};

Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
};

Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg);
};

import "./assets/styles/element-variables.scss";
import "@/assets/styles/index.scss"; // global css
import "@/assets/styles/ruoyi.scss"; // ruoyi css


import Element from "element-ui";

import "./assets/icons"; // icon
import "./permission"; // permission control

import { getCrontabData, getIntervalData } from "./utils/validate"; // 通用图标组件


import Pagination from "@/components/Pagination";
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar";
import SmallDialog from "@/components/SmallDialog";
import DeptTree from "@/components/DeptTree";
import UsersTree from "@/components/UsersTree";
import ModelDisplay from "@/components/ModelDisplay";
import CommonIcon from "@/components/CommonIcon";
import CommonStaticTable from "@/components/CommonStaticTable";

import { getModelSelect } from "@/utils/modelSelect";

import permission from "./directive/permission";


// 自定义组件
Vue.component("SmallDialog", SmallDialog);
Vue.component("DeptTree", DeptTree);
Vue.component("UsersTree", UsersTree);
Vue.component("ModelDisplay", ModelDisplay);
// 全局组件挂载
Vue.component("Pagination", Pagination);
Vue.component("RightToolbar", RightToolbar);
Vue.component("CommonIcon", CommonIcon);
Vue.component("CommonStaticTable", CommonStaticTable);

Vue.use(Element);
Vue.use(permission);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
