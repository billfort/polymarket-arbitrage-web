<template>

  <div class="mask" v-if="loading">
    <div class="loader"></div>
  </div>

  <div class="row">
    <Addresses />
    <button @click="myGetList">get trades</button>
  </div>
  <div v-for="(value, key) in pairs" :key="key">
    <TradePair :pair="value" />
  </div>
  <!-- <table v-if="list" class="info" style="width: 100%; border-collapse: collapse; border: 1px solid lightgray; "
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
  </table> -->

</template>

<script setup>
import { ref } from 'vue';
import { convertUTCToLocal } from '../api/util'
import { POLYMARKET_ARBITRAGE_URL } from '../api/const'
import Addresses from '@/components/Addresses.vue'
import TradePair from '@/components/TradePair.vue'

const list = ref([]);
const pairs = ref(new Map());
const loading = ref(false);

function formatSlug(slug) {
  let arr = slug.split('-');
  const len = arr.length;
  if (len < 4) {
    return slug;
  }
  arr = arr.splice(len - 4, 3);
  return `${arr[0]} ${arr[1]}, ${arr[2]}`;
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

    for (let i = 0; i < list.value.length; i++) {
      let t = list.value[i];
      t.slug = formatSlug(t.slug);
      t.openAt = convertUTCToLocal(t.openAt);
      t.closeAt = convertUTCToLocal(t.closeAt);
      t.stopProfit1at = convertUTCToLocal(t.stopProfit1at);
      t.stopProfit2at = convertUTCToLocal(t.stopProfit2at);
      t.stopProfit3at = convertUTCToLocal(t.stopProfit3at);
      t.stopProfit4at = convertUTCToLocal(t.stopProfit4at);
      t.stopProfit5at = convertUTCToLocal(t.stopProfit5at);
      t.stopProfit6at = convertUTCToLocal(t.stopProfit6at);
      t.stopProfit7at = convertUTCToLocal(t.stopProfit7at);
      t.stopProfit8at = convertUTCToLocal(t.stopProfit8at);
      t.stopProfit9at = convertUTCToLocal(t.stopProfit9at);
      t.stopLosst1at = convertUTCToLocal(t.stopLosst1at);
      t.stopLosst2at = convertUTCToLocal(t.stopLosst2at);
      t.stopLosst3at = convertUTCToLocal(t.stopLosst3at);
      t.stopLosst4at = convertUTCToLocal(t.stopLosst4at);
      t.stopLosst5at = convertUTCToLocal(t.stopLosst5at);
      t.stopLosst6at = convertUTCToLocal(t.stopLosst6at);
      t.stopLosst7at = convertUTCToLocal(t.stopLosst7at);
      t.stopLosst8at = convertUTCToLocal(t.stopLosst8at);
      t.stopLosst9at = convertUTCToLocal(t.stopLosst9at);

      const outcome = t.outcome;

      let p = pairs.value.get(t.batch);
      if (p) {
        const theOther = outcome == 'up' ? 'down' : 'up';
        p[theOther].sumPrice = Number(p[theOther].openPrice) + Number(t.openPrice);
        t.sumPrice = p[theOther].sumPrice;
        p[outcome] = t;
      } else {
        const m = {};
        m[outcome] = t
        m.pub = t
        pairs.value.set(t.batch, m);
      }
    }
    console.log('pairs: ', pairs.value)
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
