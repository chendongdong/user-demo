<template>
  <div>
    <x-button mini type="primary" @click.native="lastWeek">上一周</x-button>
    <x-button mini type="primary" @click.native="nextWeek">下一周</x-button>
    <x-table full-bordered style="background-color:#fff;margin: 10px 0">
      <thead>
      <tr>
        <th>日期</th>
        <th>上午</th>
        <th>下午</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in 7">
        <td class="date">{{item}}</td>
        <td class="morning">9:00-12:00</td>
        <td class="afternoon">2:00-5:00</td>
      </tr>
      </tbody>
    </x-table>
  </div>
</template>
<script>
  import {XButton, XTable} from 'vux'
  export default {
    components: {
      XButton, XTable
    },
    data () {
      return {
        currentFirstDate: ''
      }
    },
    methods: {
      lastWeek () {
        this.setDate(this.addDate(this.currentFirstDate, -7))
      },
      nextWeek () {
        this.setDate(this.addDate(this.currentFirstDate, 7))
      },
      formatDate (date) {
        let year = date.getFullYear() + '年'
        let month = (date.getMonth() + 1) + '月'
        let day = date.getDate() + '日'
        let week = '(' + ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()] + ')'
        return year + month + day + ' ' + week
      },
      addDate (date, n) {
        date.setDate(date.getDate() + n)
        return date
      },
      setDate (date) {
        let week = date.getDay() - 1
        date = this.addDate(date, week * -1)
        this.currentFirstDate = new Date(date)
        let dateEle = document.getElementsByClassName('date')
        let mornEle = document.getElementsByClassName('morning')
        let afterEle = document.getElementsByClassName('afternoon')
        for (let i = 0; i < 7; i++) {
          let currentDate = i === 0 ? date : this.addDate(date, 1)
          dateEle[i].innerHTML = this.formatDate(currentDate)
          if (i % 2 === 0) {
            mornEle[i].style.backgroundColor = '#68C84F'
            mornEle[i].style.color = 'white'
            afterEle[i].style.backgroundColor = '#9f9f9f'
            afterEle[i].style.color = 'white'
          } else {
            mornEle[i].style.backgroundColor = '#9f9f9f'
            mornEle[i].style.color = 'white'
            afterEle[i].style.backgroundColor = '#68C84F'
            afterEle[i].style.color = 'white'
          }
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.setDate(new Date())
      })
    }
  }
</script>
