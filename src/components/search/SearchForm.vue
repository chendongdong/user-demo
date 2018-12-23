<template>
  <div class="header-search fixed">
    <a class="left-text" @click="switchCity" v-show="!isSearchResult&&location">
      {{location.name}}
      <i class="fa fa-angle-down" style="font-size: 20px;padding-top: 10px"></i>
    </a>
    <div class="header-search-left" @click="onClickBack">
      <slot name="overwrite-left">
        <transition :name="transition">
          <a class="header-search-back" v-show="_leftOptions.showBack">{{ typeof _leftOptions.backText === 'undefined' ? '' : _leftOptions.backText}}</a>
        </transition>
        <transition :name="transition">
          <div class="left-arrow" v-show="_leftOptions.showBack"></div>
        </transition>
      </slot>
      <slot name="left"></slot>
    </div>
    <autocomplete
      class="auto-complete"
      v-model="keyword"
      :fetch-suggestions='querySearch'
      placeholder='请输入医生/科室/医院名称'
      @select='handleSelect'
      @click-search="handleSearchClick"
      :trigger-on-focus='false'>
    </autocomplete>
    <!--<span type="primary" @click="handleSearchClick" class="search-btn" style="display: none">搜索</span>-->
    <div type="primary" @click="switchCity" class="search-btn" v-show="isSearchResult&&location">
      {{location.name}}
      <img src="~assets/image/toggle.png" style="width: 18px">
    </div>
    <!--<img src="~assets/ic_scan.png" style="width: 24px;padding-left: 6px;" v-show="!isSearchResult" @click="onClickScan">-->
  </div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import Autocomplete from 'components/search/autocomplete'
  import {SESSION_DATA} from '../../config/sessionStorage'
  import objectAssign from 'object-assign'

  export default {
    components: {
      Autocomplete
    },
    data () {
      return {
        keyword: '',
        type: '',
        isSearchResult: false
      }
    },
    props: {
      leftOptions: Object,
      transition: String,
      location: Object
    },
    // when load the page accordding to query params
    mounted () {
      if (this.$route.path.indexOf('search-result') < 0) {
        this.isSearchResult = false
      } else {
        this.isSearchResult = true
      }
      let q = window.sessionStorage.getItem(SESSION_DATA.SEARCH_VALUE) || ''
      this.type = this.$route.query.st || 'all'
      if (this.isSearchResult) {
        // 先执行了SearchForm组件的mounted的方法，再执行SearchResult页面的mounted,此时参数还没传递过来，所以从session中获取
        let temp = window.sessionStorage.getItem(SESSION_DATA.SWITCH_CITY)
        let id = 0
        if (temp) {
          id = JSON.parse(temp).value
        }
        if (id) {
          this.doSearch({q: q, type: this.type || 'all', city_id: id})
        } else {
          this.doSearch({q: q, type: this.type || 'all'})
        }
        this.keyword = q
      } else {
        this.doSearch({q: q, type: this.type || 'all'})
      }
      // this.$router.push({ path: '/search', query: { q: q, st: this.type || 'all' } })
    },
    computed: {
      _leftOptions () {
        return objectAssign({
          showBack: true,
          preventGoBack: false
        }, this.leftOptions || {})
      }
    },
    methods: {
      switchCity () {
        if (!this.isSearchResult) {
          // 主界面
          this.$router.push({name: 'SelectLocation', query: {page: 'home'}})
        } else {
          // 结果页
          this.$router.push({name: 'SelectLocation', query: {page: 'result'}})
        }
      },
      ...mapActions([
        'doSearch'
      ]),
      ...mapGetters({
        // 映射 this.doneCount 为 store.getters.doneTodosCount
        suggestions: 'suggestions'
      }),
      querySearch (q, cb) {
        if (q) {
          let _this = this
          setTimeout(function () {
            _this.$store.dispatch('suggestion', {q: q, cb: cb})
          }, 350)
        } else {
          let searchHis = window.localStorage.getItem('search-histroy')
          if (searchHis) {
            searchHis = JSON.parse(searchHis).reverse()
          } else {
            searchHis = []
          }
          cb(searchHis)
        }
      },
      handleSelect (item) {
        let q = item.value.replace(/<\/?[^>]*>/g, '').split(' ')[0]
        this.keyword = q
        if (item.key.indexOf('_') >= 0) {
          this.type = item.key.split('_')[0]
        }
        if (this.isSearchResult && this.location.value) {
          this.doSearch({q: this.keyword, type: 'all', city_id: this.location.value})
        } else {
          this.doSearch({q: this.keyword, type: 'all'})
        }
        window.sessionStorage.setItem(SESSION_DATA.SEARCH_VALUE, this.keyword)
        this.$emit('do-search')
        if (!this.isSearchResult) {
          this.$router.push({path: '/search-result'})
        }
      },
      handleSearchClick () {
        if (this.isSearchResult && this.location.value) {
          this.doSearch({q: this.keyword, type: 'all', city_id: this.location.value})
        } else {
          this.doSearch({q: this.keyword, type: 'all'})
        }
        window.sessionStorage.setItem(SESSION_DATA.SEARCH_VALUE, this.keyword)
        this.$emit('do-search')
        if (!this.isSearchResult) {
          this.$router.push({path: '/search-result'})
        }
      },
      onClickBack () {
        if (this._leftOptions.preventGoBack) {
          this.$emit('on-click-back')
        } else {
          window.sessionStorage.removeItem(SESSION_DATA.SWITCH_CITY)
          this.$router ? this.$router.back() : window.history.back()
        }
      },
      onClickScan () {
        this.$emit('on-click-scan')
      }
    }
  }
</script>
<style lang='scss'>
@import "style/searchForm.scss";
</style>
