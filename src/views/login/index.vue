<template>
    <div class="login">
      <van-nav-bar
        title="登录"
      />
      <ValidationObserver ref="loginForm">
        <van-cell-group>
          <ValidationProvider  name="手机号" rules="required|phone" v-slot="{ errors }">
            <van-field
              v-model="user.mobile"
              required
              clearable
              label="手机号"
              placeholder="请输入手机号"
              :error-message="errors[0]"
            />
          </ValidationProvider>

          <ValidationProvider name="验证码" rules="required|max:6" v-slot="{ errors }">
            <van-field
              v-model="user.code"
              type="password"
              label="验证码"
              placeholder="请输入验证码"
              :error-message="errors[0]"
              required
            />
          </ValidationProvider>
        </van-cell-group>
      </ValidationObserver>
      <div class="loginbtn">
        <van-button type="info" @click="login">登录</van-button>
      </div>
    </div>
</template>

<script>
// 引入发送请求接口
// import request from '@/utils/request'
// 引入用户登录接口
import { login } from '@/api/user'
// 引入设置用户token接口
import { setItem } from '@/utils/storage'

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
      const isValid = await this.$refs.loginForm.validate()
      console.log(isValid)

      if (!isValid) {
        return
      }
      const toast = this.$toast.loading({
        duration: 1000, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '登陆中...'
      })
      try {
        const { data } = await login(this.user)

        // 将用户token保存到容器中
        this.$store.commit('setUser', data.data)
        // 保存用户token
        setItem('user', data.data)

        toast.clear()
        this.$toast.success('登陆成功')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          toast.clear()
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
