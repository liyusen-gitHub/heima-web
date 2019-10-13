// 获取用户token
export const getItem = (name) => {
  return JSON.parse(window.localStorage.getItem(name))
}
// 设置用户token
export const setItem = (name, data) => {
  return window.localStorage.setItem(name, JSON.stringify(data))
}
// 删除用户token
export const removeItem = (name) => {
  return window.localStorage.removeItem(JSON.parse(name))
}
