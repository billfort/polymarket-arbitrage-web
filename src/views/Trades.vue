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

</template>

<script setup>
import { ref } from 'vue';
import { convertUTCToLocalShort, convertUTCToLocalLong } from '../api/util'
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
    pairs.value = new Map();
    list.value = [];
    loading.value = true;
    const res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/trades?address=${address}`)
    list.value = await res.json()

    for (let i = 0; i < list.value.length; i++) {
      let t = list.value[i];
      t.outcome = t.outcome.toLowerCase();
      t.slug = formatSlug(t.slug);
      t.openAt = convertUTCToLocalLong(t.openAt);
      t.closeAt = convertUTCToLocalShort(t.closeAt);
      t.stopProfit1at = convertUTCToLocalShort(t.stopProfit1at);
      t.stopProfit2at = convertUTCToLocalShort(t.stopProfit2at);
      t.stopProfit3at = convertUTCToLocalShort(t.stopProfit3at);
      t.stopProfit4at = convertUTCToLocalShort(t.stopProfit4at);
      t.stopProfit5at = convertUTCToLocalShort(t.stopProfit5at);
      t.stopProfit6at = convertUTCToLocalShort(t.stopProfit6at);
      t.stopProfit7at = convertUTCToLocalShort(t.stopProfit7at);
      t.stopProfit8at = convertUTCToLocalShort(t.stopProfit8at);
      t.stopProfit9at = convertUTCToLocalShort(t.stopProfit9at);
      t.stopLoss1at = convertUTCToLocalShort(t.stopLoss1at);
      t.stopLoss2at = convertUTCToLocalShort(t.stopLoss2at);
      t.stopLoss3at = convertUTCToLocalShort(t.stopLoss3at);
      t.stopLoss4at = convertUTCToLocalShort(t.stopLoss4at);
      t.stopLoss5at = convertUTCToLocalShort(t.stopLoss5at);
      t.stopLoss6at = convertUTCToLocalShort(t.stopLoss6at);
      t.stopLoss7at = convertUTCToLocalShort(t.stopLoss7at);
      t.stopLoss8at = convertUTCToLocalShort(t.stopLoss8at);
      t.stopLoss9at = convertUTCToLocalShort(t.stopLoss9at);

      const outcome = t.outcome;
      const theOther = outcome == 'up' ? 'down' : 'up';

      let p = pairs.value.get(t.batch);
      if (p && !p[outcome]) {
        const theOtherTrade = p[theOther];
        if (!theOtherTrade) {
          console.log('p: ', p)
          console.log('theOther: ', theOther, 'theOtherTrade: ', theOtherTrade)
          return
        }
        if (theOtherTrade.slug == t.slug) {
          p[theOther].sumPrice = Number(p[theOther].openPrice) + Number(t.openPrice);
          t.sumPrice = p[theOther].sumPrice;
          p[outcome] = t;
        }
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
