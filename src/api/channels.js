import request from '@/utils/request'
// 导出获取频道方法
export function getChannels () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
