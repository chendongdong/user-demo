<template>
  <div style="align-items: flex-start;display:flex;padding-left: 10px; border-radius:3px;background-color:white;z-index:3" v-clickoutside="handleBlur">
    <input
      type="text"
      class="search-input-text"
      :value="value"
      :disabled="disabled"
      :placeholder="placeholder"
      @input="handleInput"
      @focus="handleFocus"
      @keydown.enter.native="select(highlightedIndex)" />

    <i class="fa fa-search" style="padding: 8px;color: #68C84F" @click="handleSearchClick"></i>
    <transition name="md-fade-bottom">
      <ul
        v-if="suggestionVisible"
        class="autocomplete__suggestions"
        :class="{ 'is-loading': loading }"
        ref="suggestions">
        <li v-if="loading"><i class="el-icon-loading"></i></li>
        <template v-for="(item, index) in suggestions" v-else>
          <li
            v-if="!customItem"
            :class="{'highlighted': highlightedIndex === index}"
            @click="select(index)"
            v-html="item.value">
          </li>
          <component
            v-else
            :class="{'highlighted': highlightedIndex === index}"
            @click="select(index)"
            :is="customItem"
            :item="item"
            :index="index">
          </component>
        </template>
      </ul>
    </transition>
  </div>
</template>
<script>
  import Clickoutside from '../../utils/clickoutside'
  export default {
    directives: {Clickoutside},
    props: {
      placeholder: String,
      disabled: Boolean,
      value: [String, Number],
      fetchSuggestions: Function,
      triggerOnFocus: {
        type: Boolean,
        default: true
      },
      customItem: String
    },
    data () {
      return {
        currentValue: this.value,
        suggestions: [],
        suggestionVisible: false,
        loading: false,
        highlightedIndex: -1
      }
    },
    watch: {
      'value' (val, oldValue) {
        this.currentValue = val
      },
      'currentValue' (val) {
        this.$emit('input', val)
      }
    },
    mounted () {
//      this.value = document.getElementsByClassName('input-text').item(0).value
      this.$parent.popperElm = this.popperElm = this.$el
    },
    methods: {
      handleChange (value) {
        this.$emit('input', value)
        this.showSuggestions(value)
      },
      handleFocus () {
//        if (this.triggerOnFocus) {
        this.showSuggestions(this.value)
//        }
      },
      handleBlur () {
        this.hideSuggestions()
      },
      handleInput (event) {
        this.currentValue = event.target.value
        this.showSuggestions(this.currentValue)
      },
      select (index) {
        if (this.suggestions && this.suggestions[index]) {
          this.$emit('input', this.suggestions[index].value.replace(/<\/?[^>]*>/g, '').split(' ')[0])
          this.$emit('select', this.suggestions[index])
          this.$nextTick(() => {
            this.hideSuggestions()
          })
        }
      },
      hideSuggestions () {
        this.suggestionVisible = false
        this.suggestions = []
        this.loading = false
      },
      showSuggestions (value) {
        this.suggestionVisible = true
        this.loading = true
        this.fetchSuggestions(value, (suggestions) => {
          this.loading = false
          if (Array.isArray(suggestions) && suggestions.length > 0) {
            this.suggestions = suggestions
          } else {
            this.hideSuggestions()
          }
        })
      },
      highlight (index) {
        if (!this.suggestionVisible || this.loading) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index >= this.suggestions.length) {
          index = this.suggestions.length - 1
        }
        var elSuggestions = this.$refs.suggestions
        var elSelect = elSuggestions.children[index]
        var scrollTop = elSuggestions.scrollTop
        var offsetTop = elSelect.offsetTop
        if (offsetTop + elSelect.scrollHeight > (scrollTop + elSuggestions.clientHeight)) {
          elSuggestions.scrollTop += elSelect.scrollHeight
        }
        if (offsetTop < scrollTop) {
          elSuggestions.scrollTop -= elSelect.scrollHeight
        }
        this.highlightedIndex = index
      },
      handleSearchClick () {
        this.hideSuggestions()
        // $emit不能越级传递，只能传递给父组件，不能传给爷爷组件
        this.$emit('click-search')
      }
    }
  }
</script>
<style lang="scss">
  @import "style/autocomplete.scss";
</style>
