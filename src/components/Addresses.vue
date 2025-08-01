<template>
    <select v-model="address" style="width: 400px; padding: 10px; margin-right: 1rem;" v-on:change="addressChange">
        <option v-for="(addr, index) in addresses" :value="addr">{{ (index + 1) + '. ' + addr }}</option>
    </select>
</template>

<script setup>
import { ref } from 'vue';
import { POLYMARKET_ARBITRAGE_URL } from '@/api/const';

const addresses = ref([]);
const address = ref('');
addresses.value = JSON.parse(localStorage.getItem('addresses') || '[]');

fetch(`${POLYMARKET_ARBITRAGE_URL}/api/addresses`).then(res => {
    res.json().then(data => {
        addresses.value = data || [];
        localStorage.setItem('addresses', JSON.stringify(addresses.value))
        address.value = localStorage.getItem('address') || addresses.value[0] || '';
    }).catch(err => {
        console.error('Failed to res.json():', err)
    })
}).catch(err => {
    console.error('Failed to fetch addresses:', err)
})

const addressChange = () => {
    console.log('addressChange: ', address.value)
    localStorage.setItem('address', address.value)
}

</script>