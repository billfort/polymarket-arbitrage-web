<template>

  <div class="mask" v-if="loading">
    <div class="loader"></div>
  </div>

  <div class="row">
    <Addresses />
    <button @click="myGetList">get trades</button>
  </div>
  <table v-if="list" class="info" style="width: 100%; border-collapse: collapse; border: 1px solid lightgray; "
    border="1">
    <thead>
      <tr>
        <th>batch</th>
        <th>crypto</th>
        <th>outcome</th>
        <th>slug(ET)</th>
        <th>openAt</th>
        <th>openPrice</th>
        <th>sumPrice</th>
        <th>size</th>
        <th>openVal</th>
        <th>closeAt</th>
        <th>closeVal</th>
        <th>PnL</th>
        <th>Balance</th>
        <th>CloseBy</th>
        <th>stopProfit1</th>
        <th>stopProfit2</th>
        <th>stopProfit3</th>
        <th>stopProfit4</th>
        <th>stopProfit5</th>
        <th>stopProfit6</th>
        <th>stopProfit7</th>
        <th>stopProfit8</th>
        <th>stopProfit9</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in list" :key="p.id">
        <td style="word-break: break-all; font-size: small;">{{ p.batch }}</td>
        <td style="word-break: break-all; font-size: small;">{{ p.crypto }}</td>
        <td style="word-break: break-all; font-size: small;">{{ p.outcome }}</td>
        <td style="word-break: break-all; font-size: small;">{{ p.slug }}</td>
        <td>{{ p.openAt }}</td>
        <td style="width: 2rem;">{{ Number(p.openPrice).toFixed(2) }}</td>
        <td style="width: 2rem;">{{ Number(p.sumPrice).toFixed(2) }}</td>
        <td style="width: 3rem;">{{ Number(p.openSize).toFixed(2) }}</td>
        <td style="width: 3rem;">{{ Number(p.openValue).toFixed(2) }}</td>
        <td>{{ p.closeAt }}</td>
        <td style="width: 3rem;">{{ Number(p.closeValue).toFixed(2) }}</td>
        <td style="width: 3rem;">{{ Number(p.pnl).toFixed(2) }}</td>
        <td style="width: 3rem;">{{ Number(p.assetValue).toFixed(1) }}</td>
        <td>{{ p.closeBy }}</td>
        <td>{{ p.stopProfit1at }}</td>
        <td>{{ p.stopProfit2at }}</td>
        <td>{{ p.stopProfit3at }}</td>
        <td>{{ p.stopProfit4at }}</td>
        <td>{{ p.stopProfit5at }}</td>
        <td>{{ p.stopProfit6at }}</td>
        <td>{{ p.stopProfit7at }}</td>
        <td>{{ p.stopProfit8at }}</td>
        <td>{{ p.stopProfit9at }}</td>
      </tr>
    </tbody>
  </table>

</template>

<script setup>
import { ref } from 'vue';
import { convertUTCToLocal } from '../api/util'
import { POLYMARKET_ARBITRAGE_URL } from '../api/const'
import Addresses from '@/components/Addresses.vue'

const list = ref([]);
const loading = ref(false);

function formatSlug(slug) {
  let arr = slug.split('-');
  console.log('arr: ', arr)
  const len = arr.length;
  if (len < 4) {
    return slug;
  }
  arr = arr.splice(len - 4, 3);
  console.log('arr2: ', arr)
  return arr.join(' ');
}

const myGetList = async () => {
  const address = localStorage.getItem('address')
  if (!address) {
    alert('Please select an address first.')
    return
  }

  try {
    loading.value = true;
    const res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/trades?address=${address}`)
    list.value = await res.json()

    let pairs = new Map();
    for (let i = 0; i < list.value.length; i++) {
      let p = list.value[i];

      let q = pairs.get(p.batch);
      if (q) {
        p.sumPrice = Number(q.openPrice) + Number(p.openPrice);
        q.sumPrice = p.sumPrice;
      } else {
        pairs.set(p.batch, p);
      }
      p.slug = formatSlug(p.slug);
      p.openAt = convertUTCToLocal(p.openAt);
      p.closeAt = convertUTCToLocal(p.closeAt);
      p.stopProfit1at = convertUTCToLocal(p.stopProfit1at);
      p.stopProfit2at = convertUTCToLocal(p.stopProfit2at);
      p.stopProfit3at = convertUTCToLocal(p.stopProfit3at);
      p.stopProfit4at = convertUTCToLocal(p.stopProfit4at);
      p.stopProfit5at = convertUTCToLocal(p.stopProfit5at);
      p.stopProfit6at = convertUTCToLocal(p.stopProfit6at);
      p.stopProfit7at = convertUTCToLocal(p.stopProfit7at);
      p.stopProfit8at = convertUTCToLocal(p.stopProfit8at);
      p.stopProfit9at = convertUTCToLocal(p.stopProfit9at);
      p.stopLosst1at = convertUTCToLocal(p.stopLosst1at);
      p.stopLosst2at = convertUTCToLocal(p.stopLosst2at);
      p.stopLosst3at = convertUTCToLocal(p.stopLosst3at);
      p.stopLosst4at = convertUTCToLocal(p.stopLosst4at);
      p.stopLosst5at = convertUTCToLocal(p.stopLosst5at);
      p.stopLosst6at = convertUTCToLocal(p.stopLosst6at);
      p.stopLosst7at = convertUTCToLocal(p.stopLosst7at);
      p.stopLosst8at = convertUTCToLocal(p.stopLosst8at);
      p.stopLosst9at = convertUTCToLocal(p.stopLosst9at);

    }
    console.log('trades: ', list.value)
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
