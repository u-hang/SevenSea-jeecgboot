<template>
    <!-- <index-chart v-if="indexStyle==1"></index-chart> -->
    <!-- <SevenSeaChart></SevenSeaChart> -->
    <seven-sea-chart v-if="indexStyle==1"></seven-sea-chart>
</template>

<script>
    import SevenSeaChart from './SevenSeaChart'
    export default {
        name: "Analysis",
        components: {
            SevenSeaChart
        },
        data() {
        return {
            indexStyle:1
        }
        },
        created() {

        },
        methods: {

        }
  }
</script>

<style>

</style>