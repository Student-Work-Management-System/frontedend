<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { ref } from 'vue'


const headers = [
  {
    title: '准考证号',
    align: 'start',
    sortable: true,
    key: 'examineeId'
  },
  {
    title: '身份证号',
    align: 'start',
    sortable: true,
    key: 'id'
  },
  {
    title: '姓名',
    align: 'start',
    sortable: true,
    key: 'name'
  },
  {
    title: '生源地',
    align: 'start',
    sortable: false,
    key: 'origin'
  },
  {
    title: '招生年份',
    align: 'start',
    sortable: false,
    key: 'enrollTime'
  },
  {
    title: '录取专业',
    align: 'start',
    sortable: false,
    key: 'enrollMajor'
  },
  {
    title: '第一志愿专业',
    align: 'start',
    sortable: false,
    key: 'firstMajor'
  },
  {
    title: '高考分数',
    align: 'start',
    sortable: false,
    key: 'score'
  },
  {
    title: '操作',
    align: 'start',
    sortable: false,
    key: 'operations'
  }
]

const loading = ref(false)

const deleteDialog = ref(false)
const selected = ref<any[]>([])
const search = ref('')


const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const deleteStudentCompetitionLogic = () => { }
const fetchStudentCompetitionLogic = () => {
}

</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <DeleteDialog v-model="deleteDialog" v-model:length="selected.length" @delete="deleteStudentCompetitionLogic" />
    <section class="menu">
      <span class="w-20 text-indigo">
        <v-text-field v-model="search" color="indigo" @update:modelValue="fetchStudentCompetitionLogic" :loading="loading"
          :counter="15" clearable label="搜索" prepend-inner-icon="mdi-magnify" variant="underlined" hide-details>
          <v-tooltip activator="parent" location="top">以准考证号、姓名、身份证号、生源地搜索</v-tooltip>
        </v-text-field>
      </span>
      <v-btn prepend-icon="mdi-refresh" @click="fetchStudentCompetitionLogic">刷新</v-btn>

      <v-btn prepend-icon="mdi-delete" color="error" @click="deleteDialog = true">删除</v-btn>
    </section>

    <section class="pa-4 w-100">
      <v-card>
        <v-data-table-server v-model="selected" :headers="headers" :items="data" :items-length="dataLength"
          :loading="loading" v-model:page="pageOptions.pageNo" v-model:items-per-page="pageOptions.pageSize"
          @update:options="loadItems" show-select return-object>
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn prepend-icon="mdi-pencil" color="indigo" @click="() => {
                editModel = JSON.parse(JSON.stringify(item))
                editDialog = true
              }
                ">编辑</v-btn>
            </div>
          </template>
        </v-data-table-server>
      </v-card>
    </section>
  </v-card>
</template>

<style scoped>
.menu {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
}

.menu>* {
  margin-right: 0.5rem;
}

.file {
  overflow: hidden;
  width: 26%;
}
</style>
