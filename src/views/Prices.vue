<template>

    <div class="row">
        <div style="display: flex; align-items: center;  width: 200px;">
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
                <td style="background-color: lightblue; text-align: right;">{{ p.bids.length > 0 ? p.bids[p.bids.length
                    - 1].price : '' }}
                </td>
                <td style="background-color: bisque;">{{ p.asks.length > 0 ? p.asks[p.asks.length - 1].price : '' }}
                </td>
                <td>{{ p.asks.length > 0 ? p.asks[p.asks.length - 1].size : '' }}</td>
                <td style="word-break: break-all; font-size: small;">{{ p.slug }}</td>
            </tr>
        </tbody>
    </table>

</template>

<script setup>
import { ref } from 'vue';
import { POLYMARKET_ARBITRAGE_URL } from '../api/const'

const list = ref([]);
const loading = ref(false);
const autoRefresh = ref(false);
const intervalId = ref(null);

myGetList();

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
        // list.value = [];
        const res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/prices`)
        list.value = await res.json()
        // console.log('prices: ', list.value)

        for (let i = 0; i < list.value.length; i++) {
            list.value[i].slug = formatSlug(list.value[i].slug);
        }

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
        intervalId.value = setInterval(myGetList, 10000);
        console.log('setInterval, id: ', intervalId.value);
    } else {
        console.log('clearInterval, id: ', intervalId.value);
        clearInterval(intervalId.value);
    }
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
