<template>
  <section id="object-overview">
    <div class="search-wrapper">
      <input type="text" v-model="search" placeholder="Search name..."/>
      <p class="text-secondary">{{ `${filteredList.length} ${filteredList.length === 1 ? 'resultaat' : 'resultaten' }` }}</p>
    </div>
    <div v-if="filteredList.length">
      <p v-for="orgChartObject in filteredList"
         :key="orgChartObject.id">
        {{ displayName(orgChartObject) }}
        <button @click="CreateNewOrgChartObj(orgChartObject.id)" type="button" class="btn btn-primary" data-toggle="modal" data-target="#form-modal">+</button>
        <button @click="EditOrgChartObj(orgChartObject)" type="button" class="btn btn-outline-secondary mx-1" data-toggle="modal" data-target="#form-modal">edit</button>
        <button @click="DeleteOrgChartObj(orgChartObject)" type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete-modal">-</button>
      </p>
    </div>
    <div v-else v-for="type in types" :key="type">
      <details v-if="['Team'].indexOf(type) >= 0">
        <summary>{{ type }}</summary>
        <p v-for="orgChartObject in data.filter(dobj => dobj.type === type)"
             :key="orgChartObject.id" class="ml-4">
          {{ displayName(orgChartObject) }}
          <button @click="CreateNewOrgChartObj(orgChartObject.id)" type="button" class="btn btn-primary" data-toggle="modal" data-target="#form-modal">+</button>
          <button @click="EditOrgChartObj(orgChartObject)" type="button" class="btn btn-outline-secondary mx-1" data-toggle="modal" data-target="#form-modal">edit</button>
          <button @click="DeleteOrgChartObj(orgChartObject)" type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete-modal">-</button>
        </p>
      </details>
      <details v-else>
        <summary>{{ type === 'Head' ? 'Head of something' : type }}</summary>
        <p v-for="orgChartObject in data.filter(dobj => dobj.type.toLowerCase().includes(type.toLowerCase()))"
             :key="orgChartObject.id" class="ml-4">
          {{ displayName(orgChartObject) }}
          <button @click="CreateNewOrgChartObj(orgChartObject.id)" type="button" class="btn btn-primary" data-toggle="modal" data-target="#form-modal">+</button>
          <button @click="EditOrgChartObj(orgChartObject)" type="button" class="btn btn-outline-secondary mx-1" data-toggle="modal" data-target="#form-modal">edit</button>
          <button @click="DeleteOrgChartObj(orgChartObject)" type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete-modal">-</button>
        </p>
      </details>
    </div>
    <form-modal :data="data"
                :orgChartObj="selectedOrgChartObj"
                :formAction="formAction"
                @rebuild-chart="rebuildChart"
                @reset-data="resetData"></form-modal>
    <delete-modal :data="data"
                  :orgChartObj="selectedOrgChartObj"
                  @rebuild-chart="rebuildChart"
                  @reset-data="resetData"></delete-modal>
  </section>
</template>

<script>
import FormModal from "@/components/editor/FormModal";
import DeleteModal from "@/components/editor/DeleteModal";

export default {
  name: "object-overview",
  props: ['data'],
  components: {
    FormModal,
    DeleteModal
  },
  data() {
    return {
      types: [],
      search: '',
      formAction: 'put/post',
      selectedOrgChartObj: {
        id: 0,
        pid: 0,
        name: '',
        type: ''
      }
    }
  },
  watch: {
    "data"() {
      this.types = [...new Set(this.data.map(object =>
          object.type.toLowerCase().includes("head")
              ? "Head"
              : object.type.toLowerCase().includes("director") ? "Director" : object.type
      ))].sort();
    }
  },
  computed: {
    filteredList() {
      return this.search
          ? this.data.filter(object => { return object.name.toLowerCase().includes(this.search.toLowerCase()) })
          : [];
    }
  },
  methods: {
    CreateNewOrgChartObj(parentID) {
      this.resetData()
      this.selectedOrgChartObj.pid = parentID;
      this.formAction = 'post';
    },
    EditOrgChartObj(orgChartObj) {
      this.resetData()
      this.selectedOrgChartObj = orgChartObj;
      this.formAction = 'put';
    },
    DeleteOrgChartObj(orgChartObj) {
      this.resetData()
      this.selectedOrgChartObj = orgChartObj;
      this.formAction = 'delete';
    },
    displayName(object) {
      return `${object.id.toString(16)}. ${object.name}`;
    },
    rebuildChart() {
      this.$emit('rebuild-chart');
      this.resetData();
    },
    resetData() {
      this.selectedOrgChartObj = {
        id: 0,
        pid: 0,
        name: '',
        type: ''
      }
      this.formAction = 'put/post';
    }
  }
}
</script>

<style scoped>
#object-overview {
  height: 100vh;
  overflow: scroll;
}
summary {
  font-size: 24px;
  font-weight: bold;
}
</style>