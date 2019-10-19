<template>
  <div class="home">
    <van-nav-bar fixed >
       <van-button
        class="search-btn"
        slot="title"
        round
        type="info"
        size="small"
        @click="$router.push('/search')"
      >搜索</van-button>
    </van-nav-bar>
    <van-tabs v-model="active" swipeable>
      <!-- 面包按钮 -->
      <div slot="nav-right" class="wap-nav" @click="show = true">
        <van-icon name="wap-nav" size="24" />
      </div>
      <!-- /面包按钮 -->
      <van-tab :title="channel.name" v-for="channel in channellist" :key="channel.id">
        <van-pull-refresh v-model="channel.isPullDownLoading" @refresh="onRefresh">
          <van-list
            v-model="channel.loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="(articles,index) in channel.articles"
              :key="index"
              :title="articles.title"
            >
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in articles.cover.images" :key="index">
                    <van-image lazy-load height="80" :src="img" />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <span>{{ articles.aut_name }}</span>
                    <span>{{ articles.comm_count }}评论</span>
                    <span>{{ articles.pubdate | relativeTime }}</span>
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <van-popup v-model="show" round closeable position="bottom" :style="{ height: '90%' }">
      <div class="channel-container">
        <van-cell title="我的频道" :border="false">
          <van-button
            type="danger"
            size="mini"
            @click="isEditShow=!isEditShow"
          >{{isEditShow?'完成':'编辑'}}</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item
            v-for="(item,index) in channellist"
            :key="index"
            :text="item.name"
            @click="onMychannelclick(index)"
          >
            <van-icon v-show="isEditShow" class="close-icon" slot="icon" name="close" />
          </van-grid-item>
        </van-grid>

        <van-cell title="推荐频道" :border="false" />
        <van-grid :gutter="10" @click="alert('item')">
          <van-grid-item
            v-for="(item,index) in reloadAllChannels"
            :key="index"
            :text="item.name"
            @click="onAddchannel(item)"
          />
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 导入获取频道方法
import { getChannels, getAllChannels } from '@/api/channels'
// 导入频道文章接口
import { getArticles } from '@/api/article'
// import { relativeTime } from '@/api/utils/date'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'homeIndex',
  data () {
    return {
      active: 0,
      // list: [],
      // loading: false,
      // finished: false,
      channellist: getItem('channels') || [],
      allchannellist: [],
      show: false,
      isEditShow: false
    }
  },
  created () {
    // 获取我的频道列表
    this.loadchannels()
    // 获取全部频道列表
    this.loadAllChannels()
  },
  computed: {
    // 编辑全部频道列表，将我的频道列表从全部频道列表删除
    reloadAllChannels () {
      const arr = []
      this.allchannellist.forEach(channel => {
        const ret = this.channellist.find(item => item.id === channel.id)
        if (!ret) {
          arr.push(channel)
        }
      })
      return arr
    }
  },
  watch: {
    channellist (newVal) {
      setItem('channels', newVal)
    }
  },
  methods: {
    // 点击我的频道进入对应频道列表
    onMychannelclick (index) {
      console.log(index)

      // 如果修改按钮是修改状态的话
      if (this.isEditShow) {
        // 删除点击的频道
        this.channellist.splice(index, 1)
        this.onLoad()
      } else {
        this.switchChannel(index)
      }
    },
    switchChannel (index) {
      this.active = index
      this.show = false
    },
    // 将推荐频道添加到我的频道列表
    onAddchannel (channel) {
      console.log(channel)

      this.channellist.push(channel)
    },
    extendData (channels) {
      channels.forEach(channel => {
        channel.articles = [] // 存储频道的文章列表
        channel.finished = false // 存储频道的加载结束状态
        channel.loading = false // 存储频道的加载更多的 loading 状态
        channel.timestamp = null // 存储获取频道下一页的时间戳
        channel.isPullDownLoading = false // 存储频道的下拉刷新 loading 状态
      })
    },
    // 下拉刷新
    async onRefresh () {
      const articleschannel = this.channellist[this.active]
      const { data } = await getArticles({
        channel_id: articleschannel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      articleschannel.articles.unshift(...data.data.results)
      articleschannel.isPullDownLoading = false
      this.$toast('刷新成功')
    },
    // 获取全部频道列表
    async loadAllChannels () {
      const { data } = await getAllChannels()
      // console.log(data)
      this.extendData(data.data.channels)
      this.allchannellist = data.data.channels
    },
    // 获取频道
    async loadchannels () {
      // var list = await getchannel()
      // console.log(list)
      const { data } = await getChannels()
      // console.log(Date.now() + 'loadchannels')
      // console.log(data)
      this.extendData(data.data.channels)
      // 给每个频道列表添加三个自己的参数
      // data.data.channels.forEach(channel => {
      //   channel.articles = []
      //   channel.loading = false
      //   channel.finished = false
      //   channel.timestamp = null // 存储获取频道下一页的时间戳
      //   channel.isPullDownLoading = false // 存储频道的下拉刷新 loading 状态
      // })
      // console.log(data.data.channels)
      this.channellist = data.data.channels
    },
    // 获取频道下面的列表
    async onLoad () {
      // console.log(Date.now() + 'onload')
      // 根据当前选中标签获取到当前选中的标签
      const articleschannel = this.channellist[this.active]
      // console.log(articleschannel)
      // 获取到当前选中标签的文章列表
      const { data } = await getArticles({
        channel_id: articleschannel.id,
        timestamp: articleschannel.timestamp || Date.now(),
        with_top: 1
      })
      // 向文章列表中放入文章列表内容
      articleschannel.articles.push(...data.data.results)
      // 加载状态停止
      articleschannel.loading = false
      // 判断是否还有数据
      if (data.data.pre_timestamp) {
        // 有数据继续加载
        articleschannel.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据结束加载
        articleschannel.finished = true
      }
      // console.log(articleschannel)

      // console.log(articleschannel)
      // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     articleschannel.articles.push(articleschannel.articles.length + 1)
      //   }
      //   // 加载状态结束
      //   articleschannel.loading = false
      //   // articleschannel.articles.finished = true
      //   // 数据全部加载完成
      //   if (articleschannel.articles.length >= 40) {
      //     articleschannel.finished = true
      //   }
      //   // console.log(this.channellist)
      // }, 500)
    }
  }
}
</script>

<style lang='less' scoped>
.home {
  .article-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .meta span {
      margin-right: 10px;
    }
  }
}
.home {
  .van-tabs /deep/ .van-tabs__wrap--scrollable {
    position: fixed;
    top: 46px;
    left: 0;
    right: 16px;
    z-index: 2;
  }

  .van-tabs /deep/ .van-tabs__content {
    margin-top: 90px;
  }
}
.wap-nav {
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  opacity: 0.8;
}
.home {
  .channel-container {
    padding-top: 30px;
  }
}
.van-grid-item {
  width: 25%;
}
.channel-container {
  padding-top: 30px;
  .close-icon {
    position: absolute;
    top: -5px;
    right: -5px;
  }
}
.search-btn{
  width: 100%;
  background: #5babfb;
}
</style>
