<template>
  <div class="switch-tree">
    <group v-for="(item, index) in menuData" :key="index">
      <x-switch :title="item.subject" :inline-desc="item.depict" v-model="currentValue[index]" @on-change="onValueChange"></x-switch>
      <switch-tree :menuData="item.children" v-if="currentValue[index]" v-model="currentValue[index]"></switch-tree>
    </group>
  </div>
</template>

<script>
  import { Group } from 'vux'
  import XSwitch from './x-switch'

  export default {
    name: 'SwitchTree',
    components: {
      XSwitch, Group
    },
    computed: {
    },
    props: {
      menuData: {
        type: Array,
        default: []
      },
      value: {
        type: [Array, Boolean],
        default: false
      }
    },
    data () {
      return {
        currentValue: this.value.length ? this.value : []
      }
    },
    watch: {
    },
    methods: {
      onValueChange () {
        this.$emit('input', this.currentValue)
      }
    },
    mounted () {
      this.$nextTick(function () {})
    }
  }
</script>
<style lang="scss">
  .switch-tree {
    padding-left: 20px;
  }

  .switch-tree .weui-label {
    font-size: 15px;
  }

  .switch-tree .vux-label-desc {
    font-size: 13px;
  }

  .switch-tree .weui-cells {
    margin-top: 0;
  }
</style>
