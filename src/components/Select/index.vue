<template>
  <div class="g-select-warp" v-clickoutside="handleBlur">
    <div class="g-select-input" @click="handleClick">
      <input
        type="text"
        class="g-select-input-text"
        readonly=true
        v-model="value"
        :disabled="disabled"
        :placeholder="placeholder"
        @keydown.enter.native="select(highlightedIndex)" />
      <i class="fa" :class="selectArrow"></i>
    </div>
    <transition>
      <ul
        v-if="optionVisible"
        class="g-select"
        ref="options">
        <template v-for="(item, index) in options">
          <li
            v-if="!customItem"
            :class="{'highlighted': highlightedIndex === index}"
            @click="select(index)">
            {{item.dept_name}}
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
      customItem: String,
      options: {
        type: Array,
        default: []
      },
      labelKey: String,
      label: String
    },
    data () {
      return {
        optionVisible: false,
        highlightedIndex: -1,
        value: ''
      }
    },
    computed: {
      selectArrow: function () {
        return this.optionVisible ? 'fa-angle-up' : 'fa-angle-down'
      }
    },
    methods: {
      handleClick () {
        this.optionVisible = !this.optionVisible
      },
      handleBlur () {
        this.hideOptions()
      },
      select (index) {
        if (this.options) {
          this.value = this.options[index][this.label]
          this.$emit('select', this.options[index])
          this.$nextTick(() => {
            this.hideOptions()
          })
        }
      },
      hideOptions () {
        this.optionVisible = false
      },
      highlight (index) {
        if (!this.optionVisible || this.loading) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index >= this.options.length) {
          index = this.options.length - 1
        }
        var elSuggestions = this.$refs.options
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
      }
    }
  }
</script>
<style lang="scss">
  .g-select-input {
    position: relative;
    border: 1px solid #eee;
    height: 40px;
    &:after {
      content:" ";
      height:0;
      visibility:hidden;
      display:block;
      clear:both;
    }
    .g-select-input-text {
      height: 40px;
      padding: 0px 10px;
      float: left;
      outline: none;
      border: none;
      color: #6c6c6c;
      font-size: 14px;
    }
    i {
      float: right;
      margin-right: 10px;
      background-color: white;
      padding: 12px;
      color: #6c6c6c;
    }
  }
  .g-select-warp {
    /*align-items: flex-start;*/
    position: relative;
    background-color:white;
    &:after {
      content:" ";
      height:0;
      visibility:hidden;
      display:block;
      clear:both;
    }
  }
  .g-select {
    text-align: left;
    position: absolute;
    left: 0;
    top: 42px;
    margin: 0;
    background-color: #fff;
    border: 0;
    width: 100%;
    padding: 0;
    z-index: 1;
    max-height: 280px;
    box-sizing: border-box;
    overflow: auto;
    box-shadow: 0 0 6px 0 rgba(0,0,0,0.04), 0 2px 4px 0 rgba(0,0,0,0.12);
    li {
      list-style: none;
      line-height: 32px;
      padding: 4px 10px;
      margin: 0;
      cursor: pointer;
      color: #6c6c6c;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-bottom: solid 1px #f7f7f7;
      &:hover {
        background-color: #efefee;
      }
      &:active {
        background-color: #efefef;
      }
      &.divider {
        margin-top: 6px;
        border-top: 1px solid #D3DCE6;
        &:last-child {
          margin-bottom: -6px;
        }
      }
      &.highlighted {
        background-color: #dfdfdf;
      }
    }
    span {
      font-size: 14px;
    }
    span.hl {
      text-decoration: underline;
      color: #6c6c6c;
    }

    &.is-loading li:hover {
      background-color: #fff;
    }
    &.is-loading .el-icon-loading {
      vertical-align: middle;
    }
  }
</style>
