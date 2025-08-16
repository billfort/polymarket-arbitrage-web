<template>

  <div class="mask" v-if="loading">
    <div class="loader"></div>
  </div>

  <div class="row">
    <Addresses />
    <button @click="myGetList">get policy params</button>
  </div>

  <div>
    <KeyValue :keyValuePairs="list" />
  </div>

</template>

<script setup>
import { ref } from 'vue';
import { POLYMARKET_ARBITRAGE_URL } from '../api/const'
import Addresses from '@/components/Addresses.vue'
import KeyValue from '@/components/KeyValue.vue'

const list = ref([]);
const loading = ref(false);

const setDefaultConfigs = async () => {
  const address = localStorage.getItem('address')
  if (!address) {
    alert('Please select an address first.')
    return
  }
  try {
    const res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/policy-param`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address: address
        })
      }
    )
    const data = await res.json()
    console.log('data: ', data)
  } catch (error) {
    console.error(error)
    alert('Fail to set default configs')
  }
}

const myGetList = async () => {
  const address = localStorage.getItem('address')
  if (!address) {
    alert('Please select an address first.')
    return
  }

  try {
    list.value = [];
    loading.value = true;
    const res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/policy-param?address=${address}`)
    list.value = await res.json()
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