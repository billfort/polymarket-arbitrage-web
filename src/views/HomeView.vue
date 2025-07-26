<template>
  <div class="mask" v-if="loading">
    <div class="loader"></div>
  </div>

  <h4 style="width:100%; text-align: center;">Asset Balance</h4>
  <div class="row">
    <input v-model="walletAddress" placeholder="Enter wallet address" />
    <button @click="myGetList" :disabled="loading">{{ loading ? 'Loading...' : 'Get Asset Balance' }}</button>
  </div>
  <div style="padding:1rem;">{{ result }}</div>
  <div id="chartRevenue" class="chart"></div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { convertUTCToLocal } from '../api/util.ts'
import { POLYMARKET_ARBITRAGE_URL } from '../api/const.ts'

const list = ref([]);
const loading = ref(false);
const walletAddress = ref('');
walletAddress.value = localStorage.getItem('address') || '';

let chartRevenue = ref<any>(null)
let result = ref('')

onUnmounted(() => {
  if (chartRevenue.value) {
    chartRevenue.value.dispose()
    chartRevenue.value = null
  }
})

const myGetList = async () => {
  if (!walletAddress.value) {
    walletAddress.value = localStorage.getItem('address') || '';
  }
  try {
    loading.value = true;
    console.log('POLYMARKET_ARBITRAGE_URL asset: ', POLYMARKET_ARBITRAGE_URL)
    const res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/asset-values?address=${walletAddress.value}`)
    list.value = await res.json()
    console.log('values: ', list.value)

    let list1 = list.value.reverse()
    let len = list1.length

    if (len == 0) {
      return
    }
    list1.map((item: any) => {
      item.openAt = convertUTCToLocal(item.openAt)
    })


    let xdata1 = list1.map((item: any) => {
      return (item.openAt.substring(5, 13).replace('T', ' '))
    })

    let ydata1 = list1.map((item: any) => {
      return (item.assetValue.toFixed(1))
    })

    chartRevenue.value = echarts.init(document.getElementById("chartRevenue"));

    chartRevenue.value.setOption({
      title: { text: '' },
      tooltip: {},
      xAxis: { name: 'time', data: xdata1 },
      yAxis: { type: 'value', name: 'balance' },
      series: { name: 'balance', type: 'line', data: ydata1 }
    })

  } catch (error) {
    console.error(error)
    alert('Fail to fetch trades')
  } finally {
    loading.value = false;
  }
}

</script>
