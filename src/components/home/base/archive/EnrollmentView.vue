<script setup lang="ts">
import type { EnrollmentBase } from '@/model/studentModel'
import { ref } from 'vue'

const enrollment = defineModel<EnrollmentBase>()
const panel = ref(['0', '1', '2', '3', '4', '5'])
</script>

<template>
  <v-container>
    <v-expansion-panels v-model="panel" multiple>
      <!-- 个人信息 -->
      <v-expansion-panel value="0">
        <v-expansion-panel-title>个人信息</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="6">学号：{{ enrollment?.studentId }}</v-col>
            <v-col cols="6">姓名：{{ enrollment?.name }}</v-col>
            <v-col cols="6">身份证号：{{ enrollment?.idNumber }}</v-col>
            <v-col cols="6">性别：{{ enrollment?.gender }}</v-col>
            <v-col cols="6">生日：{{ enrollment?.birthdate }}</v-col>
            <v-col cols="6">民族：{{ enrollment?.nation }}</v-col>
            <v-col cols="6">籍贯：{{ enrollment?.nativePlace }}</v-col>
            <v-col cols="6">身高：{{ enrollment?.height }}</v-col>
            <v-col cols="6">体重：{{ enrollment?.weight }}</v-col>
            <v-col cols="6">联系方式：{{ enrollment?.phone }}</v-col>
            <v-col cols="6">邮箱：{{ enrollment?.email }}</v-col>
            <v-col cols="6">兴趣爱好：{{ enrollment?.hobbies }}</v-col>
            <v-col cols="6">政治面貌：{{ enrollment?.politicStatus }}</v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 在校信息 -->
      <v-expansion-panel value="1">
        <v-expansion-panel-title>在校信息</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="6">班级：{{ enrollment?.classNo }}</v-col>
            <v-col cols="6">专业：{{ enrollment?.majorName }}</v-col>
            <v-col cols="6">年级：{{ enrollment?.gradeName }}</v-col>
            <v-col cols="6">培养层次：{{ enrollment?.degreeName }}</v-col>
            <v-col cols="6">宿舍：{{ enrollment?.dormitory }}</v-col>
            <v-col cols="6">
              班主任：{{ enrollment?.headerTeacherRealName }} ({{ enrollment?.headerTeacherPhone }})
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 高考信息 -->
      <v-expansion-panel value="2">
        <v-expansion-panel-title>高考信息</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="6">考生类型：{{ enrollment?.studentType }}</v-col>
            <v-col cols="6">考生号：{{ enrollment?.examId }}</v-col>
            <v-col cols="6">省份：{{ enrollment?.provinceName }}</v-col>
            <v-col cols="6">科类：{{ enrollment?.subjectCategory }}</v-col>
            <v-col cols="6">批次：{{ enrollment?.admissionBatch }}</v-col>
            <v-col cols="6">志愿1：{{ enrollment?.volunteer1 }}</v-col>
            <v-col cols="6">志愿2：{{ enrollment?.volunteer2 }}</v-col>
            <v-col cols="6">志愿3：{{ enrollment?.volunteer3 }}</v-col>
            <v-col cols="6">志愿4：{{ enrollment?.volunteer4 }}</v-col>
            <v-col cols="6">志愿5：{{ enrollment?.volunteer5 }}</v-col>
            <v-col cols="6">志愿6：{{ enrollment?.volunteer6 }}</v-col>
            <v-col cols="6">生源地：{{ enrollment?.studentFrom }}</v-col>
            <v-col cols="6">是否调剂：{{ enrollment?.isAdjusted ? '是' : '否' }}</v-col>
            <v-col cols="6">录取专业：{{ enrollment?.admittedMajor }}</v-col>
            <v-col cols="6">投档志愿：{{ enrollment?.volunteerMajor }}</v-col>
            <v-col cols="6">投档单位：{{ enrollment?.volunteerCollege }}</v-col>
            <v-col cols="6">高中代码：{{ enrollment?.highSchoolCode }}</v-col>
            <v-col cols="6">高中名称：{{ enrollment?.highSchoolName }}</v-col>

            <v-col cols="6">考生类别分类：{{ enrollment?.candidateCategoryClassification }}</v-col>
            <v-col cols="6">毕业类别分类：{{ enrollment?.graduationCategoryClassification }}</v-col>
            <v-col cols="6">毕业类别：{{ enrollment?.graduationCategory }}</v-col>
            <v-col cols="6">考生类别：{{ enrollment?.candidateCategory }}</v-col>

            <v-col cols="6">语文成绩：{{ enrollment?.scoreChinese }}</v-col>
            <v-col cols="6">数学成绩：{{ enrollment?.scoreMath }}</v-col>
            <v-col cols="6">高考外语语种：{{ enrollment?.foreignLanguage }}</v-col>
            <v-col cols="6">外语成绩：{{ enrollment?.scoreForeignLanguage }}</v-col>
            <v-col cols="6">选考科目：{{ enrollment?.selectedSubjects }}</v-col>
            <v-col cols="6">综合成绩：{{ enrollment?.scoreComprehensive }}</v-col>
            <v-col cols="6">高考得分：{{ enrollment?.totalExamScore }}</v-col>
            <v-col cols="6">学生特征：{{ enrollment?.feature }}</v-col>
            <v-col cols="6">特征成绩：{{ enrollment?.specialScore }}</v-col>
            <v-col cols="6">总分：{{ enrollment?.convertedScore }}</v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 户口信息 -->
      <v-expansion-panel value="3">
        <v-expansion-panel-title>户口信息</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="6">户籍所在地：{{ enrollment?.householdRegistration }}</v-col>
            <v-col cols="6">户口类型：{{ enrollment?.householdType }}</v-col>
            <v-col cols="6">身份证地址：{{ enrollment?.address }}</v-col>
            <v-col cols="6">监护人姓名：{{ enrollment?.guardian }}</v-col>
            <v-col cols="6">监护人联系方式：{{ enrollment?.guardianPhone }}</v-col>
            <v-col cols="6">父亲姓名：{{ enrollment?.fatherName }}</v-col>
            <v-col cols="6">父亲联系方式：{{ enrollment?.fatherPhone }}</v-col>
            <v-col cols="6">父亲职业：{{ enrollment?.fatherOccupation }}</v-col>
            <v-col cols="6">母亲姓名：{{ enrollment?.motherName }}</v-col>
            <v-col cols="6">母亲联系方式：{{ enrollment?.motherPhone }}</v-col>
            <v-col cols="6">母亲职业：{{ enrollment?.motherOccupation }}</v-col>
            <v-col cols="6">地址：{{ enrollment?.address }}</v-col>
            <v-col cols="6">家庭人口：{{ enrollment?.familyPopulation }}</v-col>
            <v-col cols="6">家庭成员：{{ enrollment?.familyMembers }}</v-col>
            <v-col cols="6">家庭所在地：{{ enrollment?.familyLocation }}</v-col>
            <v-col cols="6">是否独生子女：{{ enrollment?.isOnlyChild ? '是' : '否' }}</v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 其他 -->
      <v-expansion-panel value="4">
        <v-expansion-panel-title>其他</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="6">助学贷款：{{ enrollment?.studentLoans ? '是' : '否' }}</v-col>
            <v-col cols="6">是否残疾：{{ enrollment?.disability ? '是' : '否' }}</v-col>
            <v-col cols="6">宗教信仰：{{ enrollment?.religiousBeliefs }}</v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 备注 -->
      <v-expansion-panel value="5">
        <v-expansion-panel-title>备注</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12">备注信息：{{ enrollment?.otherNotes }}</v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
