<template>
  <div class="mask" v-if="loading">
    <div class="loader"></div>
  </div>

  <h4 style="width:100%; text-align: center;">Asset Balance</h4>
  <div class="row">
    <Addresses />
    <button @click="myGetList" :disabled="loading">{{ loading ? 'Loading...' : 'Get Asset Balance' }}</button>
  </div>
  <!-- <div style="padding:1rem;">{{ result }}</div> -->
  <div v-if="balance" class="row">
    <div>USDCe: <span class='value'>{{ balance.usdceBalance?.toFixed(2) }}</span></div>
    <div>Position Value: <span class='value'>{{ balance.positionsValue?.toFixed(2) }}</span></div>
  </div>
  <div id="chartRevenue" class="chart"></div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { convertUTCToLocalShort } from '../api/util.ts'
import { POLYMARKET_ARBITRAGE_URL } from '../api/const.ts'
import Addresses from '@/components/Addresses.vue'

// const list = ref([]);
const loading = ref(false);
const balance = ref(null as any);
let chartRevenue = ref<any>(null)
let result = ref('')

onUnmounted(() => {
  if (chartRevenue.value) {
    chartRevenue.value.dispose()
    chartRevenue.value = null
  }
})

const myGetList = async () => {
  const address = localStorage.getItem('address')
  console.log('myGetList address: ', address)
  if (!address) {
    result.value = 'Please select an address first.'
    return
  }

  try {
    result.value = '';
    balance.value = null;

    loading.value = true;
    console.log('POLYMARKET_ARBITRAGE_URL asset: ', POLYMARKET_ARBITRAGE_URL)

    let res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/asset-balance?address=${address}`)
    balance.value = await res.json()
    console.log('balance: ', balance.value)

    res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/asset-values?address=${address}`)
    const list = await res.json()
    console.log('values: ', list)

    let list1 = list.reverse()
    let len = list1.length

    if (len == 0) {
      // return
    }
    list1.map((item: any) => {
      item.openAt = convertUTCToLocalShort(item.openAt)
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
