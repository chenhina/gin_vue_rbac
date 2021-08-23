# gin_vue_rbac

#### 介绍
前端使用vue，后端使用gin搭建的一套基于RBAC模型的后台管理系统

集成了动态加载路由、jwt鉴权、casbin权限管理等等

#### 安装教程

- 本地启动(需要配置nodejs以及golang环境)
  - 进入**dinvue**，`cnpm install`下载依赖、`cnpm run serve`启动前端项目
  - 进入**ginberbac**，`go mod tidy`下载go的依赖、`go run main.go`启动后端项目
- 服务器部署(基于docker-compose一键部署，需要配置docker及docker-compose等)
  - 前端自行打包(和上面一样进入**dinvue**，下载依赖`cnpm install`、进行编译`cnpm run build`)
  - 将编译完的dist文件与其他三个文件一起上传至服务器
  - `docker-compose up -d`一键部署
  - navicat远程连接服务器的13306端口，创建dva_gin,运行**ginberbac**里的sql文件(或者自行修改**ginberbac/conf/config.yaml**文件)
  - 访问服务器的80端口就能展示



