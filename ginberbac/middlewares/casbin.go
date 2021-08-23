package middlewares

import (
	"github.com/gin-gonic/gin"
	"go.study.com/hina/giligili/controller"
	"go.study.com/hina/giligili/dao/mysql"
	"go.study.com/hina/giligili/pkg"
	"strconv"
)

func CasbinMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		user_id, exists := c.Get(controller.CtxUserIDKey)
		if !exists {
			controller.ResponseErrorWithMsg(c, controller.CodeNeedLogin, "你有问题")
			c.Abort()
		}
		user, _ := mysql.GetUserByID(user_id.(int64))
		// 获取用户的角色
		sub := user.RoleId
		if sub == 1 {  // admin 直接放行
			c.Next()
		} else {
			// 获取请求的url
			obj := c.Request.URL.RequestURI()
			// 获取请求方法
			act := c.Request.Method
			e := pkg.Casbin()
			// 判断策略中是否存在
			success, _ := e.Enforce(strconv.Itoa(int(sub)), obj, act)
			//if settings.Conf.Mode == "dev" || success {
			if success {
				c.Next()
			} else {
				controller.ResponseErrorWithMsg(c, controller.CodeInvalidParam, "权限不足")
				c.Abort()
				return
			}
		}
	}
}
