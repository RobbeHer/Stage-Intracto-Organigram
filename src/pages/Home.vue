<template>
  <section>
    <OrgChart v-if="chartVisable"
              :chart="chart"></OrgChart>
    <Loader v-else></Loader>
  </section>
</template>

<script>
import api from "@/api";
import Loader from "@/components/Loader";
import OrgChart from '@/components/OrgChart';
import ChartBuilder from "@/builder/chartBuilder";

const chartBuilder = new ChartBuilder();

export default {
  name: "Home",
  components: {
    OrgChart,
    Loader
  },
  data() {
    return {
      chart: null,
      loadedData: false,
      chartVisable: false,
      data: [],
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      api.get().then(
          (result) => {
            this.data = result.data;
            this.loadedData = true;
            this.buildChart();
          },
          (error) => {
            console.log(error);
          }
      );
    },
    buildChart() {
      if (this.loadedData) {
        this.chartVisable = false;
        console.warn('Building orgChart');
        this.chart = chartBuilder.build(this.data);
        this.chartVisable = true;
      }
    }
  }
}
</script>

<style scoped>

</style>