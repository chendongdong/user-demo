<template>
  <div class="case">
    <div class="app-header">
      <x-header :left-options="{showBack: true, backText: '返回'}">
        基础健康信息
        <span slot="right" class="save" @click="saveCase">保存</span>
      </x-header>
    </div>
    <div class="app-content">
      <group>
        <x-input v-model="caseInfo.infection_history" title="传染病史：" placeholder="请输入" required></x-input>
        <x-input v-model="caseInfo.operation_history" title="手术外伤史：" placeholder="请输入" required></x-input>
        <x-input v-model="caseInfo.allergy_history" title="过敏史：" placeholder="请输入" required></x-input>
        <x-input v-model="caseInfo.blood_history" title="输血史：" placeholder="请输入" required></x-input>
        <x-input v-model="caseInfo.smoke_history" title="吸烟史：" placeholder="请输入" required></x-input>
        <x-input v-model="caseInfo.drink_history" title="饮酒史：" placeholder="请输入" required></x-input>
        <x-input v-model="caseInfo.marriage_history" title="婚姻史：" placeholder="请输入" required></x-input>
        <x-input v-model="caseInfo.menstruation_history" title="月经史：" placeholder="请输入" required></x-input>
        <x-input v-model="caseInfo.family_history" title="家族史：" placeholder="请输入" required></x-input>
      </group>
    </div>

    <toast v-model="showHint" type="text">{{getRet}}</toast>
  </div>
</template>
<script>
  import {XHeader, XButton, Group, Cell, XInput, Toast} from 'vux'
  import CloneData from '../../../../utils/CloneData'
  export default {
    components: {
      XHeader,
      Group,
      Cell,
      XButton,
      XInput,
      Toast
    },
    computed: {
      getRet () {
        let data = this.$store.getters.caseMsg
        if (data) {
          this.showHint = true
          this.$store.dispatch('clearCaseMsg')
        }
        return data
      },
      caseInfo () {
        let data = this.$store.getters.caseInfo
        CloneData.extend(this.caseData, data)
        return this.caseData
      }
    },
    data () {
      return {
        caseData: {},
        showHint: false
      }
    },
    methods: {
      saveCase () {
        this.$store.dispatch('saveCaseInfo', this.caseInfo)
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.$store.dispatch('baseCaseInfo')
      })
    }
  }
</script>

<style lang="scss">
  @import "style/case.scss";
</style>

