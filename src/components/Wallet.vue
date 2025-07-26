<template>
    <div class="col">
        <button @click="connWallet">connect wallet</button>
        <p v-if="walletAddress" class="info">{{ walletAddress }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { connectWallet } from '@/api/wallet'

const walletAddress = ref('');

const address = localStorage.getItem('address');
if (address) {
    walletAddress.value = address;
}

const connWallet = async () => {
    if (!window.ethereum) {
        alert('MetaMask is not installed. Please install it to use this app.');
    }

    walletAddress.value = '';
    try {
        walletAddress.value = await connectWallet(window.ethereum)
        localStorage.setItem('address', walletAddress.value);
    } catch (error) {
        alert('Failed to connect to MetaMask.');
        console.error(error);
    }
}

</script>