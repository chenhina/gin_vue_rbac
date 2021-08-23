import request from "@/utils/request"

// 登录接口
export function login(username, password, code, code_id) {
  const data = {
    username,
    password,
    code,
    code_id
  };
  return request({
    url: "/base/login/",
    method: "post",
    data: data
  });
}

// 获取用户详细信息
export function getInfo(token) {
  return request({
    url: "/admin/getInfo/",
    method: "get",
    config: {
      headers: {
        'Authorization': "Bearer " + token
      }
    }
  })
}


// 登出
export function logout() {
  return request({
    url: "/admin/logout/",
    method: "post"
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: "/base/code/",
    method: "post"
  })
}
