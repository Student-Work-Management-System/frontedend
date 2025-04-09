<script lang="ts" setup>
import { ref } from 'vue'
import GradeSelect from '../GradeSelect.vue'
import MajorSelect from '../MajorSelect.vue'
import { apiUpdateStudent } from '@/api/student'
import { type Student } from '@/model/studentModel'
import { notify } from '@kyvg/vue3-notification'
import moment from 'moment'
import { useUserStore } from '@/stores/userStore'
import DegreeSelect from '../DegreeSelect.vue'
import PoliticSelect from '../PoliticSelect.vue'

const dialog = defineModel<boolean>()
const info = defineModel<Student>('info')
const emits = defineEmits(['onClosed'])
const loading = ref(false)

const store = useUserStore()
const chargeGrades = store.getUserData.chargeGrades

const updateInfoLogic = async () => {
  loading.value = true
  if (info.value?.birthdate) {
    info.value.birthdate = moment(new Date(info.value.birthdate)).format('YYYY-MM-DD')
  }
  if (info.value?.joiningTime) {
    info.value.joiningTime = moment(new Date(info.value.joiningTime)).format('YYYY-MM-DD')
  }
  const { data: result } = await apiUpdateStudent(info.value as Student)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '学生信息修改成功！' })
  loading.value = false
  dialog.value = false
  emits('onClosed')
}
</script>

<template>
  <v-dialog v-model="dialog" class="edit-dialog">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-pencil" title="修改信息">
      <v-container class="px-8">
        <v-row>
          <!-- 第一列：基本信息 -->
          <v-col>
            <v-text-field
              v-model="info!.studentId"
              label="学号"
              class="text-indigo"
              color="indigo"
              clearable
              disabled
            />
            <v-text-field
              v-model="info!.name"
              label="姓名"
              class="text-indigo"
              color="indigo"
              clearable
              required
            >
              <template v-slot:prepend>
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </template>
            </v-text-field>
            <v-select
              v-model="info!.gender"
              label="性别"
              class="text-indigo"
              color="indigo"
              clearable
              :items="['男', '女']"
              required
            >
              <template v-slot:prepend>
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </template>
            </v-select>
            <v-text-field
              v-model="info!.idNumber"
              label="身份证"
              class="text-indigo"
              color="indigo"
              clearable
              required
            >
              <template v-slot:prepend>
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </template>
            </v-text-field>
            <MajorSelect v-model="info!.majorId" class="text-indigo mb-6">
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </MajorSelect>
            <GradeSelect
              v-model="info!.gradeId"
              :charge-grades="chargeGrades"
              class="text-indigo mb-6"
            >
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </GradeSelect>
            <DegreeSelect v-model="info!.degreeId" class="text-indigo mb-6">
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </DegreeSelect>
            <v-text-field
              v-model="info!.classNo"
              label="班级"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.dormitory"
              label="宿舍"
              class="text-indigo"
              color="indigo"
              clearable
            />
          </v-col>

          <!-- 第二列：联系方式 -->
          <v-col>
            <v-text-field
              v-model="info!.phone"
              label="手机号"
              class="text-indigo"
              color="indigo"
              clearable
              required
            >
              <template v-slot:prepend>
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </template>
            </v-text-field>
            <v-text-field
              v-model="info!.email"
              label="邮箱"
              class="text-indigo"
              color="indigo"
              clearable
              required
            >
              <template v-slot:prepend>
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </template>
            </v-text-field>
            <v-text-field
              v-model="info!.postalCode"
              label="邮政编码"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.address"
              label="家庭住址"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.location"
              label="家庭所在省/市/区"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.householdRegistration"
              label="户籍所在地"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.householdType"
              label="户口类型"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.nativePlace"
              label="籍贯"
              class="text-indigo"
              color="indigo"
              clearable
            />
          </v-col>

          <!-- 第三列：个人信息 -->
          <v-col>
            <v-text-field
              v-model="info!.nation"
              label="民族"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <PoliticSelect v-model="info!.politicId" label="政治面貌" class="text-indigo mb-6">
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </PoliticSelect>
            <v-date-input
              v-model="info!.joiningTime"
              label="入团时间"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.height"
              label="身高(cm)"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.weight"
              label="体重(kg)"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.religiousBeliefs"
              label="宗教信仰"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-date-input
              v-model="info!.birthdate"
              label="生日"
              class="text-indigo"
              color="indigo"
              clearable
            />
          </v-col>

          <!-- 第四列：家庭信息 -->
          <v-col>
            <v-text-field
              v-model="info!.familyPopulation"
              label="家庭人口"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-select
              v-model="info!.isOnlyChild"
              label="是否独生子女"
              class="text-indigo"
              color="indigo"
              clearable
              :items="[
                { title: '是', value: true },
                { title: '否', value: false }
              ]"
            />
            <v-text-field
              v-model="info!.familyMembers"
              label="家庭成员"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.fatherName"
              label="父亲姓名"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.fatherPhone"
              label="父亲联系方式"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.fatherOccupation"
              label="父亲职业"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.motherName"
              label="母亲姓名"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.motherPhone"
              label="母亲联系方式"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.motherOccupation"
              label="母亲职业"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.guardian"
              label="监护人姓名"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.guardianPhone"
              label="监护人联系方式"
              class="text-indigo"
              color="indigo"
              clearable
            />
          </v-col>

          <!-- 第五列：学习信息 -->
          <v-col>
            <v-text-field
              v-model="info!.highSchool"
              label="所读高中"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.examId"
              label="考生号"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.admissionBatch"
              label="录取批次"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.totalExamScore"
              label="高考总分"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.foreignLanguage"
              label="外语语种"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.foreignScore"
              label="外语分数"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-select
              v-model="info!.isStudentLoans"
              label="是否助学贷款"
              class="text-indigo"
              color="indigo"
              clearable
              :items="[
                { title: '是', value: true },
                { title: '否', value: false }
              ]"
            />
            <v-select
              v-model="info!.disability"
              label="是否残疾"
              class="text-indigo"
              color="indigo"
              clearable
              :items="[
                { title: '是', value: true },
                { title: '否', value: false }
              ]"
            />
            <v-text-field
              v-model="info!.hobbies"
              label="个人兴趣爱好特长"
              class="text-indigo"
              color="indigo"
              clearable
            />
            <v-text-field
              v-model="info!.otherNotes"
              label="备注"
              class="text-indigo"
              color="indigo"
              clearable
            />
          </v-col>
        </v-row>
      </v-container>
      <v-divider />
      <v-container class="d-flex justify-space-evenly">
        <v-btn
          :disabled="info!!.gradeId === null || !info!!.majorId === null"
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
  width: 90vw;
}
</style>
