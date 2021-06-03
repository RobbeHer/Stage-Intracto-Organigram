<template>
  <div>
    <organization-chart :datasource="ds" :pan="true" :zoom="true" class="orgchart-container-box"></organization-chart>
  </div>
</template>

<script>
// https://www.npmjs.com/package/orgchartchannel
// https://github.com/dabeng/vue-orgchart
import OrganizationChart from 'vue-organization-chart';
import 'vue-organization-chart/dist/orgchart.css';

export default {
  name: "org-chart",
  props: ['chart'],
  components: {
    OrganizationChart
  },
  data() {
    return {
      ds: null
    }
  },

  watch: {
    chart() {
      this.ds = this.chart;
    }
  },

  created() {
    this.ds = this.chart;
  }
}
</script>

<style scoped>
.orgchart-container {
  height: 100vh;
}
</style>