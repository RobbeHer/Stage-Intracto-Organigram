<template>
  <div class="container">
    <div class="row">
      <!--
      top part
      lg => middle part
      -->
      <section class="col-12 col-lg-8 order-lg-2 col-xl-9">
        <OrgChart v-if="chartVisable"
                  :chart="chart"></OrgChart>
        <loader v-else></loader>
      </section>
      <!--
      bottom part
      md => left sidebar
      -->
      <object-overview class="mt-5 mt-lg-0 col-12 col-lg-4 order-lg-1 col-xl-3"
                       :data="data"
                       @rebuild-chart="buildChart"
      ></object-overview>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import Loader from "@/components/Loader";
import OrgChart from '@/components/OrgChart';
import ChartBuilder from "@/builder/chartBuilder";
import ObjectOverview from "@/components/editor/ObjectOverview";

const chartBuilder = new ChartBuilder();

export default {
  name: "Editor",
  components: {
    ObjectOverview,
    OrgChart,
    Loader
  },
  data() {
    return {
      chart: null,
      data: [],
      loadedData: false,
      chartVisable: false
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
.container {
  margin: 0;
  max-width: 100%;
  width: 100%;
}
</style>