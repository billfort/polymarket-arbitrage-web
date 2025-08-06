<template>

    <div class="row">
        <div style="display: flex; align-items: center;  width: 250px;">
            <input v-if="autoRefresh" type="text" v-model="interval" placeholder="seconds"
                style="width: 2rem; height: 20px; padding: 2px; text-align: center;" />
            <span v-if='autoRefresh'>seconds</span>
            <label for="myCheckbox" style="width: 140px; text-align: right;">auto refresh</label>
            <input type="checkbox" id="myCheckbox" name="option1" v-model="autoRefresh"
                style="width: 20px; height: 20px; margin-left: 10px;" @click="checkAutoRefresh" />

        </div>
        <button @click="myGetList">refresh</button>
    </div>
    <table v-if="list" class="info" style="width: 100%; border-collapse: collapse; border: 1px solid lightgray; "
        border="1">
        <thead>
            <tr>
                <th>token</th>
                <th>outcome</th>
                <th>bid1 volume</th>
                <th style="text-align: right;">bid1 price</th>
                <th>ask1 price</th>
                <th>ask1 volume</th>
                <th>slug</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="p in list" :key="p.tokenId" :style="{ color: p.outcome == 'up' ? 'red' : 'green' }">
                <td>{{ p.tokenName }}</td>
                <td>{{ p.outcome }}</td>
                <td style="text-align: right;">{{ p.bids.length > 0 ? p.bids[p.bids.length - 1].size : '' }}</td>
                <td style="background-color:beige; text-align: right;">{{ p.bids.length > 0 ? p.bids[p.bids.length
                    - 1].price : '' }}
                </td>
                <td style="background-color: bisque;">{{ p.asks.length > 0 ? p.asks[p.asks.length - 1].price : '' }}
                </td>
                <td>{{ p.asks.length > 0 ? p.asks[p.asks.length - 1].size : '' }}</td>
                <td style="word-break: break-all; font-size: small;">{{ p.slug }}</td>
            </tr>
        </tbody>
    </table>
    <div class="row" style="margin-top: 1rem;">{{ minSumPrice }}</div>
    <div class="row">One token price should be greater than 0.5</div>
    <table v-if="configs" class="info" style="width: 100%; border-collapse: collapse; border: 1px solid lightgray; "
        border="1">
        <thead>
            <tr>
                <th>id</th>
                <th>start trade minute</th>
                <th>end trade minute</th>
                <th>sum price low</th>
                <th>sum price high</th>
                <th>trade amount percent</th>
                <th>min trade amount</th>
                <th>stop loss percent</th>
                <th>take profit sum price</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(p, index) in configs" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ p.startTradeMinute }}</td>
                <td>{{ p.endTradeMinute }}</td>
                <td>{{ p.sumPriceLow }}</td>
                <td>{{ p.sumPriceHigh }} </td>
                <td>{{ p.tradeAmountPercent }} </td>
                <td>{{ p.minTradeAmount }}</td>
                <td>{{ p.stopLossPercent }}</td>
                <td>{{ p.takeProfitSumPrice }}</td>
            </tr>
        </tbody>
    </table>

</template>

<script setup>
import { ref } from 'vue';
import { POLYMARKET_ARBITRAGE_URL } from '../api/const'

const list = ref([]);
const configs = ref([]);
const autoRefresh = ref(false);
const intervalId = ref(null);
const minSumPrice = ref('');
const interval = ref(5); // default interval in seconds

myGetList();
myGetConfig();

function formatSlug(slug) {
    let arr = slug.split('-');
    const len = arr.length;
    if (len < 4) {
        return slug;
    }
    arr = arr.splice(len - 4, 3);
    return `${arr[0]} ${arr[1]}, ${arr[2]}`;
}


async function myGetList() {
    try {
        const res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/prices`)
        list.value = await res.json()
        // console.log('prices: ', list.value)

        for (let i = 0; i < list.value.length; i++) {
            list.value[i].slug = formatSlug(list.value[i].slug);
        }
        sumprice();

    } catch (error) {
        list.value = [];
        console.error(error)
        alert('Fail to fetch prices')
    }
}

async function myGetConfig() {
    try {
        const res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/config`)
        configs.value = await res.json()
        console.log('configs: ', configs.value)

    } catch (error) {
        list.value = [];
        console.error(error)
        alert('Fail to fetch prices')
    }
}

function checkAutoRefresh() {
    autoRefresh.value = !autoRefresh.value;
    console.log('autoRefresh: ', autoRefresh.value);
    if (autoRefresh.value) {
        myGetList();
        if (intervalId.value) {
            clearInterval(intervalId.value);
        }
        if (interval.value <= 1 || isNaN(interval.value)) {
            interval.value = 6; // default to 6 seconds if invalid
        }
        intervalId.value = setInterval(myGetList, interval.value * 1000);
        console.log('setInterval, id: ', intervalId.value);
    } else {
        console.log('clearInterval, id: ', intervalId.value);
        clearInterval(intervalId.value);
    }
}

function sumprice() {
    const ups = []
    const downs = []
    for (let value of list.value) {
        if (value.outcome == 'up') {
            ups.push(value)
        } else {
            downs.push(value)
        }
    }

    let sum = []
    for (let i = 0; i < ups.length; i++) {
        for (let j = 0; j < downs.length; j++) {
            if (ups[i].tokenName != downs[j].tokenName && ups[i].askPrice > 0 && downs[j].askPrice > 0) {
                sum.push({ up: ups[i], down: downs[j], price: ups[i].askPrice + downs[j].askPrice })
            }
        }
    }

    sum.sort((a, b) => a.price - b.price)
    console.log('sum: ', sum)
    if (sum.length == 0) {
        minSumPrice.value = 'No arbitrage opportunities found'
        return;
    }
    let i = 0;
    minSumPrice.value = `Min: up ${sum[i].up.tokenName}, ask ${sum[i].up.askPrice}; down ${sum[i].down.tokenName}, ask ${sum[i].down.askPrice}; sum ${sum[i].price.toFixed(2)}`;
}

</script>

<style scoped>
/* table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}

table tbody tr:nth-child(odd) {
    background-color: #ffffff;
}

table tbody tr:hover {
    background-color: #e6f3ff;
} */
</style>
