<script lang="ts" setup>
import { ref } from 'vue'
import GradeSelect from '../GradeSelect.vue'
import MajorSelect from '../MajorSelect.vue'
import { apiUpdateStudent } from '@/api/student'
import { type Student } from '@/model/studentModel'
import { notify } from '@kyvg/vue3-notification'
import moment from 'moment'

const dialog = defineModel<boolean>()
const info = defineModel<Student>('info')
const emits = defineEmits(['onClosed'])
const loading = ref(false)
const form = ref(false)
const updateInfoLogic = async () => {
  loading.value = true
  let date = moment(new Date(info.value!.birthdate)).format('YYYY-MM-DD')
  info.value!.birthdate = date
  const { data: result } = await apiUpdateStudent(info.value as Student)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '学生信息修改成功！' })
  loading.value = false
  emits('onClosed')
}
</script>

<template>
  <v-dialog v-model="dialog" class="edit-dialog">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-pencil" title="修改信息">
      <v-container class="px-8">
        <v-form v-model="form" class="form">
          <v-row>
            <v-col>
              <v-text-field
                v-model="info!.name"
                label="姓名"
                class="text-indigo"
                color="indigo"
                clearable
                required
                :rules="[() => !!info!.name || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
              <v-select
                v-model="info!.gender"
                label="性别"
                class="text-indigo"
                color="indigo"
                :items="['男', '女']"
                clearable
                required
                :rules="[() => !!info!.gender || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-select>
              <MajorSelect v-model="info!.majorId" class="mb-6">
                <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
              </MajorSelect>
              <GradeSelect v-model="info!.grade" class="mb-6">
                <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
              </GradeSelect>
              <v-text-field
                v-model="info!.classNo"
                label="班级"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.idNumber"
                label="身份证"
                class="text-indigo"
                color="indigo"
                clearable
                required
                :counter="18"
                :rules="[
                  () => !!info!.idNumber || '该选项必填！',
                  () => info!.idNumber.length === 18 || '身份证号不足18位'
                ]"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
              <v-text-field
                v-model="info!.nation"
                label="民族"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              >
              </v-text-field>
              <v-text-field
                v-model="info!.nativePlace"
                label="籍贯"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-select
                v-model="info!.politicsStatus"
                label="政治面貌"
                class="text-indigo"
                color="indigo"
                :items="['群众', '共青团员', '中共党员(预备)', '中共党员']"
                clearable
                required
                :rules="[() => !!info!.politicsStatus || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="info!.phone"
                label="手机号"
                class="text-indigo"
                color="indigo"
                clearable
                required
                :counter="11"
                :rules="[
                  () => !!info!.phone || '该选项必填！',
                  () => info!.phone.length === 11 || '手机号不足11位'
                ]"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
              <v-text-field
                v-model="info!.postalCode"
                label="邮政编码"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.email"
                label="邮箱"
                class="text-indigo"
                color="indigo"
                clearable
                required
                :rules="[() => !!info!.email || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-text-field>
              <v-text-field
                v-model="info!.householdRegistration"
                label="户籍所在地"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.householdType"
                label="户口类型"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.address"
                label="家庭住址"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.fatherName"
                label="父亲姓名"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.fatherPhone"
                label="父亲联系方式"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.fatherOccupation"
                label="父亲职业"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="info!.motherName"
                label="母亲姓名"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.motherPhone"
                label="母亲联系方式"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.motherOccupation"
                label="母亲职业"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.guardian"
                label="监护人姓名"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.guardianPhone"
                label="监护人联系方式"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.highSchool"
                label="所读高中"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.examId"
                label="考生号"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.admissionBatch"
                label="录取批次"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.totalExamScore"
                label="高考总分"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="info!.foreignLanguage"
                label="外语语种"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.foreignScore"
                label="外语分数"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.hobbies"
                label="个人兴趣爱好特长"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.dormitory"
                label="宿舍"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-text-field
                v-model="info!.otherNotes"
                label="备注"
                class="text-indigo ml-7"
                color="indigo"
                clearable
              />
              <v-date-input
                v-model="info!.birthdate"
                class="text-indigo"
                color="indigo"
                label="生日"
                prepend-icon=""
                prepend-inner-icon="$calendar"
                persistent-placeholder
                clearable
              />
            </v-col>
          </v-row>
        </v-form>
      </v-container>
      <v-divider />
      <v-container class="d-flex justify-space-evenly">
        <v-btn
          :disabled="!form || info!!.grade === null || !info!!.majorName === null"
          text="修改"
          :loading="loading"
          color="indigo"
          variant="plain"
          @click="updateInfoLogic"
        />
        <v-btn text="取消" variant="plain" @click="dialog = false" />
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.edit-dialog {
  width: 70vw;
}
</style>
