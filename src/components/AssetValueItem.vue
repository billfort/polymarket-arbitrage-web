<template>
    <div class="box">
        <table>
            <thead>
                <tr>
                    <th>Trade ID</th>
                    <th style="width: 40%;">Slug</th>
                    <th>DateTime</th>
                    <th>Total Value</th>
                    <th>USDCe Value</th>
                    <th>Positions Value</th>
                </tr>
            </thead>
            <tbody>
                <tr >
                    <td>{{ v.id }}</td>
                    <td>{{ v.slug }}</td>
                    <td>{{ v.openAt }}</td>
                    <td style="color: green; font-weight: bold;">{{ v.assetValue?.toFixed(2) }}</td>
                    <td>{{ v.usdcValue?.toFixed(2) }}</td>
                    <td>{{ v.positionValue?.toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
        <table v-if="v.positions && v.positions.length > 0">
            <thead>
                <tr>
                    <th>Position ID</th>
                    <th>Slug</th>
                    <th>Initial Value</th>
                    <th>Current Value</th>
                    <th>Cash PNL</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(pos, index) in v.positions" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ pos.slug }}</td>
                    <td>{{ pos.initialValue?.toFixed(2) }}</td>
                    <td>{{ pos.currentValue?.toFixed(2) }}</td>
                    <td>{{ pos.pnl?.toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
    // Define the prop 'trade' which is required and of type Object
    v: { type: Object, required: true },
})

</script>

<style scoped>
div {
    margin-right: 10px;
}

.box {
    padding: 10px;
    margin-bottom: 1rem;
}

.box:hover {
    border: 1px solid green;
}
</style>