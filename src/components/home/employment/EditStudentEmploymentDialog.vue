<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { type StudentEmployment, type StudentEmploymentItem } from '@/model/employmentModel'
import { apiUpdateEmploy, stateOption, whereaboutsOption } from '@/api/employment'
import { notify } from '@kyvg/vue3-notification'
import ItemSelect from '../ItemSelect.vue'
import DateSelect from '../DateSelect.vue'

const model = defineModel<boolean>()
const info = defineModel<StudentEmploymentItem>('info')
const localInfo = ref<StudentEmploymentItem>()
// 当弹窗打开时，创建副本
watchEffect(() => {
  if (model.value && info.value) {
    localInfo.value = { ...info.value }
  }
})
const emits = defineEmits(['onClosed'])
const loading = ref(false)
const disabled = computed(() => {
  return localInfo.value?.state != null && localInfo.value.whereabouts != null
})

const updateEmploymentInfoLogic = async () => {
  const { data: result } = await apiUpdateEmploy(localInfo.value as StudentEmployment)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '毕业信息修改成功！' })
  loading.value = false
  emits('onClosed')
}
</script>
<template>
  <v-dialog v-model="model" class="edit-dialog">
    <v-card
      :loading="loading"
      width="auto"
      min-width="500"
      prepend-icon="mdi-pencil"
      title="修改信息"
    >
      <v-container class="px-8">
        <v-row class="text-indigo">
          <v-col>
            <ItemSelect
              class="mb-5"
              label="毕业状态"
              v-model="localInfo!.state"
              :items="stateOption"
            >
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </ItemSelect>
            <ItemSelect
              class="mb-5"
              label="毕业去向"
              v-model="localInfo!.whereabouts"
              :items="whereaboutsOption"
            >
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </ItemSelect>
            <v-text-field
              label="毕业年份"
              class="ml-7"
              v-model="localInfo!.graduationYear"
              clearable
            />
          </v-col>
          <v-col>
            <v-text-field label="单位名称" v-model="localInfo!.organizationName" clearable />
            <v-text-field label="单位组织机构代码" v-model="localInfo!.code" clearable />
            <v-text-field label="工作性质" v-model="localInfo!.jobNature" clearable />
            <v-text-field label="所属行业" v-model="localInfo!.jobIndustry" clearable />
            <v-text-field label="工作地点" v-model="localInfo!.jobLocation" clearable />
            <v-text-field label="职业类别" v-model="localInfo!.category" clearable />
            <v-text-field label="月薪" v-model="localInfo!.salary" clearable />
          </v-col>
          <v-col>
            <v-text-field label="就业单位联系人" v-model="localInfo!.contactPerson" clearable />
            <v-text-field label="就业单位联系电话" v-model="localInfo!.contactPhone" clearable />
            <DateSelect label="就业证明日期" v-model="localInfo!.certificateTime" clearable />
          </v-col>
          <v-col>
            <v-text-field label="备注" v-model="localInfo!.comment" clearable />
          </v-col>
        </v-row>
      </v-container>

      <v-divider></v-divider>

      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn
          :disabled="!disabled"
          text="确定"
          :loading="loading"
          color="indigo"
          variant="plain"
          @click="updateEmploymentInfoLogic"
        />
        <v-btn text="取消" variant="plain" @click="model = false" />
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.edit-dialog {
  width: 70vw;
}
</style>
