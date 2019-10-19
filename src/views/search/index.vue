<template>
    <div class="search">
        <van-search
            v-model="searchText"
            placeholder="请输入搜索关键词"
            show-action
            shape="round"
            @input="onSearchInput"
            @search="onSearch(searchText)"
            >
            <div slot="action" @click="onSearch">搜索</div>
        </van-search>
    <van-cell-group>
      <van-cell v-for="(item,index) in suggestionList" :key="index" :title="item" icon="search" >
          <div v-html="item" slot="title" @click="onSearch(item)"></div>
      </van-cell>
    </van-cell-group>
    </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
export default {

  // @search="onSearch"
  name: 'searchIndex',
  data () {
    return {
      searchText: '',
      suggestionList: []
    }
  },
  methods: {
    onSearch (str) {
      this.$router.push('searchresult' + str)
    },
    async onSearchInput () {
      const searchText = this.searchText.trim()
      //   console.log(searchText)
      if (!searchText) {

      } else {
        const { data } = await getSearchSuggestions({
          q: this.searchText
        })
        // this.suggestionList = data.data.options
        const searchSuggestions = data.data.options

        const reg = new RegExp(searchText, 'g')
        searchSuggestions.forEach((item, index) => {
          searchSuggestions[index] = item.replace(reg, '<span style="color: red">' + searchText + '</span>')
        })
        this.suggestionList = searchSuggestions
        // console.log(data)
      }
    }
  }
}
</script>

<style>

</style>
