<template>
    <div class="box">
        <div class="row-left" style="font-weight: bold;">
            <div>batch: <span class="value">{{ pub.batch }}</span></div>
            <div>sum of open price: <span class="value">{{ pub.sumPrice?.toFixed(2) }}</span></div>
            <div>open at: <span class="value">{{ pub.openAt }}</span></div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>crypto</th>
                    <th>outcome</th>
                    <th>slug</th>
                    <th>open price</th>
                    <th>exp open price</th>
                    <th>open size</th>
                    <th>exp open size</th>
                    <th>close at</th>
                    <th>close price</th>
                    <th>exp close price</th>
                    <th>close size</th>
                    <th>exp close size</th>
                    <th>pnl</th>
                    <th>closed by</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="up" style="color: red;">
                    <td>{{ up.crypto }}</td>
                    <td>{{ up.outcome }}</td>
                    <td>{{ up.slug }}</td>
                    <td>{{ up.openPrice?.toFixed(2) }}</td>
                    <td>{{ up.expectOpenPrice }}</td>
                    <td>{{ up.openSize?.toFixed(2) }}</td>
                    <td>{{ up.expectOpenSize }}</td>
                    <td>{{ up.closeAt }}</td>
                    <td>{{ up.closePrice ? up.closePrice?.toFixed(2) : '' }}</td>
                    <td>{{ up.expectClosePrice ? up.expectClosePrice : '' }}</td>
                    <td>{{ up.closeSize ? up.closeSize?.toFixed(2) : '' }}</td>
                    <td>{{ up.expectCloseSize ? up.expectCloseSize : '' }}</td>
                    <td>{{ up.pnl ? up.pnl?.toFixed(2) : '' }}</td>
                    <td>{{ up.closeBy }}</td>
                </tr>
                <tr v-if="down" style="color: green;">
                    <td>{{ down.crypto }}</td>
                    <td>{{ down.outcome }}</td>
                    <td>{{ down.slug }}</td>
                    <td>{{ down.openPrice?.toFixed(2) }}</td>
                    <td>{{ down.expectOpenPrice }}</td>
                    <td>{{ down.openSize ? down.openSize?.toFixed(2) : '' }}</td>
                    <td>{{ down.expectOpenSize ? down.expectOpenSize : '' }}</td>
                    <td>{{ down.closeAt }}</td>
                    <td>{{ down.closePrice ? down.closePrice?.toFixed(2) : '' }}</td>
                    <td>{{ down.expectClosePrice ? down.expectClosePrice : '' }}</td>
                    <td>{{ down.closeSize ? down.closeSize?.toFixed(2) : '' }}</td>
                    <td>{{ down.expectCloseSize ? down.expectCloseSize : '' }}</td>
                    <td>{{ down.pnl ? down.pnl?.toFixed(2) : '' }}</td>
                    <td>{{ down.closeBy }}</td>
                </tr>
            </tbody>
        </table>

        <table style="margin-top: 10px;">
            <thead>
                <tr>
                    <th>stop profit/loss</th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>5</th>
                    <th>6</th>
                    <th>7</th>
                    <th>8</th>
                    <th>9</th>
                </tr>
            </thead>
            <tbody>
                <tr style="color: red;">
                    <td>stop profit</td>
                    <td>{{ pub.stopProfit1at }}</td>
                    <td> {{ pub.stopProfit2at }}</td>
                    <td> {{ pub.stopProfit3at }}</td>
                    <td> {{ pub.stopProfit4at }}</td>
                    <td> {{ pub.stopProfit5at }}</td>
                    <td> {{ pub.stopProfit6at }}</td>
                    <td> {{ pub.stopProfit7at }}</td>
                    <td> {{ pub.stopProfit8at }}</td>
                    <td> {{ pub.stopProfit9at }}</td>
                </tr>
                <tr style="color: green;">
                    <td>stop loss</td>
                    <td>{{ pub.stopLoss1at }}</td>
                    <td> {{ pub.stopLoss2at }}</td>
                    <td> {{ pub.stopLoss3at }}</td>
                    <td> {{ pub.stopLoss4at }}</td>
                    <td> {{ pub.stopLoss5at }}</td>
                    <td> {{ pub.stopLoss6at }}</td>
                    <td> {{ pub.stopLoss7at }}</td>
                    <td> {{ pub.stopLoss8at }}</td>
                    <td> {{ pub.stopLoss9at }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
    // Define the prop 'trade' which is required and of type Object
    pair: { type: Object, required: true },
})

const pub = ref(props.pair[1].pub);
const down = ref(props.pair[1].down);
const up = ref(props.pair[1].up);

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