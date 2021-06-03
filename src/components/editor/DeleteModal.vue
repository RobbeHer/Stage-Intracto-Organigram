<template>
  <!-- Modal -->
  <div class="modal fade" id="delete-modal" tabindex="-1" role="dialog" aria-labelledby="delete-modal-label" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="delete-modal-label">Delete object</h5>
          <button @click="resetData" type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure to delete the following object?</p>
          <table>
            <tr>
              <th class="pr-5">Key:</th><th>Value:</th>
            </tr>
            <tr>
              <td class="pr-5">Name</td><td>{{ this.orgChartObj.name }}</td>
            </tr>
            <tr>
              <td class="pr-5">Type</td><td>{{ this.getType(this.orgChartObj.type) }}</td>
            </tr>
            <tr v-if="this.getType(this.orgChartObj.type) === 'Head of' || this.getType(this.orgChartObj.type) === 'Director'">
              <td class="pr-5">Full Type Name</td><td>{{ this.orgChartObj.type }}</td>
            </tr>
            <tr>
              <td class="pr-5">ID</td><td>{{ this.orgChartObj.id !== undefined ? this.orgChartObj.id.toString(16) : '' }}</td>
            </tr>
            <tr>
              <td class="pr-5">PID</td><td>{{ this.orgChartObj.pid !== undefined ? this.orgChartObj.pid.toString(16) : '' }}</td>
            </tr>
          </table>
        </div>
        <div class="modal-footer">
          <button @click="resetData" type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button v-if="children" disabled type="button" class="btn btn-danger" data-dismiss="modal">First remove all subobjects from this object</button>
          <button v-else @click.prevent="submit" :disabled="!canSubmit"  data-dismiss="modal" type="button" class="btn btn-danger">
            {{ !this.deleteBtnActive ? Math.floor(this.countDown / 1000) + 1 : 'Confirm Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "delete-modal",
  props: ["data", "orgChartObj"],
  data() {
    return {
      deleteBtnActive: false,
      countDown: 3000,
      children: 0
    }
  },
  computed: {
    canSubmit() {
      return this.deleteBtnActive;
    }
  },
  watch: {
    "orgChartObj"() {
      if (this.orgChartObj.id !== 0) {
        this.children = this.data.filter(data => data.pid === this.orgChartObj.id).length;
        if (!this.children) {
          this.resetDeleteBtn();
          let interval = window.setInterval(() => {
            this.countDown -= 100;
            if (this.countDown <= 0) {
              this.deleteBtnActive = true;
              clearTimeout(interval);
            }
          }, 100);
        }
      }
    }
  },
  methods: {
    getType(objType) {
      if (objType === "" || objType === "Member") return "Member";
      if (objType === "Team leader") return "Team leader";
      if (objType === "Team") return "Team";
      if (objType === "Campus") return "Campus";
      if (objType.includes('Head of')) return "Head of";
      if (objType.toLowerCase().includes('director')) return "Director";
      return "Other";
    },
    submit() {
      api.delete(this.orgChartObj).then(
          (result) => {
            console.log("An object was deleted");
            console.log(result);
            const index = this.data.indexOf(this.orgChartObj);
            if (index !== -1) this.data.splice(index, 1);
            this.rebuildChart();
          },
          (error) => {
            console.log(error);
          }
      );
    },
    rebuildChart() {
      this.$emit('rebuild-chart');
      this.resetData();
    },
    resetData() {
      this.$emit('reset-data');
    },
    resetDeleteBtn() {
      this.deleteBtnActive = false;
      this.countDown = 3000;
    }
  }
}
</script>

<style scoped>

</style>