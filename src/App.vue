<template>
  <div id="yimi-weixin-user-app">
    <nprogress-container></nprogress-container>
    <transition
      mode="out-in"
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
      appear>
      <router-view class="animated"></router-view>
    </transition>
  </div>
</template>
<script>
 import NprogressContainer from 'components/Nprogress/NprogressContainer'
 export default {
   components: {
     NprogressContainer
   }
 }
</script>
<style lang="scss">
  @import "./styles/scss/main.scss";
  .pad-content {
    padding: 44px 10px 0px 10px;
  }
</style>
