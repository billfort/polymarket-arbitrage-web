<template>

  <div class="mask" v-if="loading">
    <div class="loader"></div>
  </div>

  <div class="row">
    <Addresses />
    <button @click="myGetList">get trades</button>
  </div>
  
  <AssetValueItem v-for="item in list" :key="item.id" :v="item" />
</template>

<script setup>
import { ref } from 'vue';
import { POLYMARKET_ARBITRAGE_URL } from '../api/const'
import Addresses from '@/components/Addresses.vue'
import { convertUTCToLocalShort, convertUTCToLocalLong } from '../api/util'
import AssetValueItem from '@/components/AssetValueItem.vue'

const list = ref([]);
const loading = ref(false);

const myGetList = async () => {
  const address = localStorage.getItem('address')
  if (!address) {
    alert('Please select an address first.')
    return
  }

  try {
    list.value = [];
    loading.value = true;
    const res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/asset-values?address=${address}`)
    list.value = await res.json()

    if (list.value.length > 0) {
      const minTradeId = list.value[0].id
      const res2 = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/position-snapshots?address=${address}&minTradeId=${minTradeId}`)
      const positions = await res2.json()
      console.log('positions: ', positions)

      list.value.forEach(item => {
        item.openAt = convertUTCToLocalShort(item.openAt)
        item.positions = positions.filter(pos => pos.tradeId === item.id)
      })
    }
    console.log('list: ', list.value)

  } catch (error) {
    console.error(error)
    alert('Fail to fetch trades')
  } finally {
    loading.value = false;
  }
}

</script>

<style scoped>
th {
  position: sticky;
  top: 0;
  /* Sticks to the top of its containing block when scrolled */
  background-color: #f2f2f2;
  /* Optional: for better visibility */
  z-index: 1;
  /* Ensures header is above scrolling content */
}
</style>