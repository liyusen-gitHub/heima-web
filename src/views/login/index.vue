<template>
    <div class="login">
      <van-nav-bar
        title="登录"
      />
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          required
          clearable
          label="用户名"
          placeholder="请输入用户名"
        />

        <van-field
          v-model="user.code"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
        />
      </van-cell-group>
      <div class="loginbtn">
        <van-button type="info" @click="login">登录</van-button>
      </div>
    </div>
</template>

<script>
// 引入发送请求接口
import request from '@/utils/request'

export default {
  name: 'loginpage',
  data () {
    return {
      user: {
        mobile: '15911111111',
        code: '246810'
      }
    }
  },
  methods: {
    async login () {
      try {
        const { data } = await request({
          url: '/app/v1_0/authorizations',
          method: 'POST',
          data: this.user
        })
        console.log(data)
        this.$toast.success('登陆成功')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登录失败，手机号或验证码不正确')
        }
      }
    }
  }

}
</script>

<style lang="less" scoped>
  .login{
    .loginbtn{
      padding: 20px;
      .van-button{
        width: 100%;
        background-color: #6db4fb;
      }
    }
  }
</style>
