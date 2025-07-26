<template>

  <div class="mask" v-if="loading">
    <div class="loader"></div>
  </div>

  <div class="row">
    <input v-model="walletAddress" placeholder="wallet address" style="width: 320px;" />
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
      </tr>
    </tbody>
  </table>

</template>

<script setup>
import { ref } from 'vue';
import { convertUTCToLocal } from '../api/util'
import { POLYMARKET_ARBITRAGE_URL } from '../api/const'

const list = ref([]);
const loading = ref(false);
const walletAddress = ref('');

walletAddress.value = localStorage.getItem('address');

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
  if (!walletAddress.value) {
    walletAddress.value = localStorage.getItem('address');
  }
  try {
    loading.value = true;
    const res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/trades?address=${walletAddress.value}`)
    list.value = await res.json()
    list.value.forEach(p => {
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

    })
    console.log('trades: ', list.value)
  } catch (error) {
    console.error(error)
    alert('Fail to fetch trades')
  } finally {
    loading.value = false;
  }
}

</script>
