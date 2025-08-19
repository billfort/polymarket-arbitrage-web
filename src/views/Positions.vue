<template>
    <div class="mask" v-if="loading">
        <div class="loader"></div>
    </div>

    <div class="row">
        Address:
        <Addresses />
        Filter: <input v-model="positionFilter" placeholder="position filter" style="width: 150px;" />
        <button @click="myGetUserPosition">get position</button>
    </div>
    <table v-if="positions" class="info" style="width: 100%; border-collapse: collapse; border: 1px solid lightgray; "
        border="1">
        <thead>
            <tr>
                <th>title</th>
                <th>outcome</th>
                <th>size</th>
                <th>Pnl</th>
                <th>InitVal</th>
                <th>CurVal</th>
                <th>Redeem</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="p in positions" :key="p.tokenId">
                <td style="word-break: break-all; font-size: small;">{{ p.title }}</td>
                <td style="word-break: break-all; font-size: small;">{{ p.outcome }}</td>
                <td style="width: 1.5rem;">{{ Number(p.size).toFixed(1) }}</td>
                <td style="width: 1.5rem;">{{ Number(p.cashPnl).toFixed(1) }}</td>
                <td style="width: 3rem;">{{ Number(p.initialValue).toFixed(1) }}</td>
                <td style="width: 3rem;">{{ Number(p.currentValue).toFixed(1) }}</td>
                <td style="width: 3rem;">{{ (p.redeemable) }}</td>
            </tr>
        </tbody>
    </table>

</template>

<script setup>
import { ref } from 'vue';
import { getUserPosition } from '@/api/polymarket'
import Addresses from '@/components/Addresses.vue';

const positions = ref([]);
const loading = ref(false);
const positionFilter = ref('')

const time = new Date()
let date = time.toLocaleTimeString('en-US', {
    hour: 'numeric', timeZone: 'America/New_York',
    month: 'long', day: 'numeric'
});
// console.log('date: ', date)
// date = date.replace(' at', ',')
// date = date.replace(' AM', 'AM')
// date = date.replace(' PM', 'PM')
// console.log('date: ', date)
// const arr = date.split(',')
// positionFilter.value = arr[0]

const myGetUserPosition = async () => {
    let address = localStorage.getItem('address');
    if (!address) {
        alert('Please select an address first')
        return
    }
    try {
        loading.value = true;
        positions.value = await getUserPosition(address)
        if (positionFilter.value) {
            positions.value = positions.value.filter(p => p.title.indexOf(positionFilter.value) >= 0)
        }
        positions.value = positions.value.map((p) => {
            p.title = p.title.replace('Up or Down ', '')
            return p;
        })
        console.log('positions: ', positions.value)
    } catch (error) {
        alert('Fail to get user position, please check the wallet address is correct')
    } finally {
        loading.value = false;
    }
}

</script>