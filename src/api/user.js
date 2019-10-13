import request from '@/utils/request'
// 用户登录方法
export function login (user) {
  return request({
    url: '/app/v1_0/authorizations',
    method: 'POST',
    data: user
  })
}
