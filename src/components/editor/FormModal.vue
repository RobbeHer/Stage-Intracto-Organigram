<template>
  <!-- Modal -->
  <div class="modal fade" id="form-modal" tabindex="-1" role="dialog" aria-labelledby="form-modal-label" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="form-modal-label">{{ this.form.action === "put" ? 'Edit' : 'Add new' }} object</h5>
          <button @click="resetData" type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <label for="pid">pid (Hex)<span class="text-danger">*</span></label><br>
            <input v-model="form.pid" type="text" name="pid" id="pid"><br>
            <label for="name" class="mt-3">Name <span class="text-danger">*</span></label><br>
            <input v-model="form.name" type="text" name="name" id="name"><br>
            <label for="type" class="mt-3">Type <span class="text-danger">*</span></label><br>
            <select v-model="form.selectedType" name="type" id="type">
              <option value="Member" :selected="isOfType(orgChartObj.type, 'Member')">Member</option>
              <option value="Team leader" :selected="isOfType(orgChartObj.type, 'Team leader')">Team leader</option>
              <option value="Head of" :selected="isOfType(orgChartObj.type, 'Head of')">Head of</option>
              <option value="Director" :selected="isOfType(orgChartObj.type, 'Director')">Director</option>
              <option value="Team" :selected="isOfType(orgChartObj.type, 'Team')">Team</option>
              <option value="Campus" :selected="isOfType(orgChartObj.type, 'Campus')">Campus</option>
              <option value="Other" :selected="isOfType(orgChartObj.type, 'Other')">Other</option>
            </select>
            <div v-if="showTypeName" class="mt-3">
              <label for="type-name-part">Full type name <span class="text-danger">*</span></label><br>
              <input v-model="form.typeName" type="text" name="type-name-part" id="type-name-part">
              <p>{{ TypeNamePartValue }}</p>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="resetData" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button @click.prevent="submit" :disabled="!canSubmit"  data-dismiss="modal" type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "form-modal",
  props: ["data", "orgChartObj", "formAction"],
  data() {
    return {
      form: {
        action: '',
        pid: 0,
        name: '',
        selectedType: '',
        typeName: '',
        fullTypeName: ''
      }
    }
  },
  computed: {
    showTypeName() {
      const type = this.form.selectedType;
      return type === "Head of" || type === "Director" || type === "Other";
    },
    TypeNamePartValue() {
      let str1 = this.form.selectedType === 'Head of' ? 'Head of' : '';
      let str2 = this.form.selectedType === 'Director' ? 'director' : '';
      let fullTypeName = this.capitalizeFirstLetter(`${str1} ${this.form.typeName} ${str2}`);
      this.setFormFullTypeName(fullTypeName);
      return this.form.fullTypeName;
    },
    canSubmit() {
      if (this.form.name
          && this.form.selectedType
          && parseInt(this.form.pid, 16) >= 0
          && parseInt(this.form.pid, 16) !== this.orgChartObj.id
          && this.data.find(data => data.id === parseInt(this.form.pid, 16))
    ) {
        if (this.form.selectedType === "Head of"
            || this.form.selectedType === "Director"
            || this.form.selectedType === "Other") {
          return !!this.form.typeName;
        }
        return true;
      }
      return false;
    }
  },
  watch: {
    "formAction"() {
      this.resetFormData();
      this.form.action = this.formAction;
      this.form.pid = this.orgChartObj.pid.toString(16);
      this.form.name = this.orgChartObj.name;
      this.form.selectedType = this.getType(this.orgChartObj.type);
      this.form.fullTypeName = this.orgChartObj.type;
      if (this.form.selectedType === "Director") {
        this.form.typeName = this.form.fullTypeName.replace("director", '');
      } else {
        this.form.typeName = this.form.fullTypeName.replace(this.getType(this.form.selectedType) + ' ', '');
      }
    }
  },
  methods: {
    line() {
      console.warn('---')
    },
    getType(objType) {
      if (objType === "" || objType === "Member") return "Member";
      if (objType === "Team leader") return "Team leader";
      if (objType === "Team") return "Team";
      if (objType === "Campus") return "Campus";
      if (objType.includes('Head of')) return "Head of";
      if (objType.toLowerCase().includes('director')) return "Director";
      return "Other";
    },
    isOfType(objType, optionType) {
      /*console.log(`objType: ${objType}`);
      console.log(`optionType: ${optionType}`);
      console.log(`Same: ${optionType === objType}`) ;
      console.log(`Head of: ${optionType === "Head of" && objType.includes('Head of')}`);
      console.log(`Director: ${optionType === "Director" && objType.toLowerCase().includes('director')}`);
      if (optionType === "Other") {
        console.log(`Other: ${!objType.includes('Head of') && !objType.toLowerCase().includes('director')}`) ;
        this.line()
      }*/

      if (objType === "" || optionType === objType) return true;
      if (optionType === "Head of" && objType.includes('Head of')) return true;
      if (optionType === "Director" && objType.toLowerCase().includes('director')) return true;
      if (optionType === "Other") {
        return !objType.includes('Head of') && !objType.toLowerCase().includes('director');
      }
    },
    setFormFullTypeName(name) {
      this.form.fullTypeName = this.removeUnneededSpacesOfStr(name);
      console.log(this.form.fullTypeName);
    },
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    removeUnneededSpacesOfStr(str) {
      return str.replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '');
    },
    submit() {
      this.orgChartObj.pid = parseInt(this.form.pid, 16);
      if (this.form.selectedType === "Campus") this.orgChartObj.pid = 0;
      this.orgChartObj.name = this.removeUnneededSpacesOfStr(this.form.name);
      this.orgChartObj.type = this.form.selectedType;
      if (this.form.selectedType === "Head of"
          || this.form.selectedType === "Director"
          || this.form.selectedType === "Other") this.orgChartObj.type = this.form.fullTypeName;
      if (this.form.action === "put") {
        api.put(this.orgChartObj).then(
            (result) => {
              console.log("An object was updated");
              console.log(result);
              this.rebuildChart();
            },
            (error) => {
              console.log(error);
            }
        );
      } else {
        api.post(this.orgChartObj).then(
            (result) => {
              console.log("A new object was created");
              console.log(result);
              this.data.push(result.data);
              this.rebuildChart();
            },
            (error) => {
              console.log(error);
            }
        );
      }
    },
    rebuildChart() {
      this.$emit('rebuild-chart');
      this.resetData();
    },
    resetData() {
      this.$emit('reset-data');
      this.resetFormData();
    },
    resetFormData() {
      this.form = {
        action: '',
        pid: 0,
        name: '',
        selectedType: '',
        typeName: '',
        fullTypeName: ''
      }
    }
  }
}
</script>

<style scoped>

</style>