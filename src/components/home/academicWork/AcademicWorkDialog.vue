<script lang="ts" setup>
import type {
  AcademicWorkItem,
  AcademicWorkPaper,
  AcademicWorkSoft,
  AcademicWorkPatent
} from '@/model/academicWorkModel'
import { isPaper, isPatent, isSoft } from '@/model/academicWorkModel'
import { onMounted } from 'vue'
const model = defineModel<boolean>()
const props = defineProps<{
  item: AcademicWorkItem
}>()
onMounted(() => {})
</script>

<template>
  <v-card>
    <v-dialog v-model="model" width="600">
      <v-card>
        <v-card-title class="text-h5 d-flex align-center">
          <v-icon start icon="mdi-file-document" class="mr-2" />
          作品详情
        </v-card-title>

        <v-card-text>
          <!-- 论文 -->
          <div v-if="isPaper(props.item.academicWork)">
            <p>
              <strong>期刊名称: </strong>
              {{ (props.item.academicWork as AcademicWorkPaper).periodicalName }}
            </p>
            <p>
              <strong>JRC分区: </strong
              >{{ (props.item.academicWork as AcademicWorkPaper).jrcPartition }}
            </p>
            <p>
              <strong>CAS分区: </strong
              >{{ (props.item.academicWork as AcademicWorkPaper).casPartition }}
            </p>
            <p>
              <strong>收录时间: </strong>
              {{ (props.item.academicWork as AcademicWorkPaper).recordedTime }}
            </p>
            <p>
              <strong>检索时间: </strong>
              {{ (props.item.academicWork as AcademicWorkPaper).searchedTime }}
            </p>
            <p>
              <strong>是否EI文章: </strong>
              {{ (props.item.academicWork as AcademicWorkPaper).isEI ? '是' : '否' }}
            </p>
            <p>
              <strong>是否EI收录: </strong>
              {{ (props.item.academicWork as AcademicWorkPaper).isEIRecorded ? '是' : '否' }}
            </p>
            <p>
              <strong>是否中文核心: </strong>
              {{ (props.item.academicWork as AcademicWorkPaper).isChineseCore ? '是' : '否' }}
            </p>
            <p>
              <strong>是否会议文章: </strong>
              {{ (props.item.academicWork as AcademicWorkPaper).isMeeting ? '是' : '否' }}
            </p>
          </div>

          <!-- 软著 -->
          <div v-else-if="isSoft(props.item.academicWork)">
            <p>
              <strong>发布机构：</strong>
              {{ (props.item.academicWork as AcademicWorkSoft).publishInstitution }}
            </p>
            <p>
              <strong>发布日期：</strong
              >{{ (props.item.academicWork as AcademicWorkSoft).publishDate }}
            </p>
          </div>

          <!-- 专利 -->
          <div v-else-if="isPatent(props.item.academicWork)">
            <p>
              <strong>授权状态： </strong>
              {{ (props.item.academicWork as AcademicWorkPatent).publishState }}
            </p>
            <p>
              <strong>授权日期：</strong>
              {{ (props.item.academicWork as AcademicWorkPatent).authorizationDate }}
            </p>
          </div>

          <div v-else>
            <v-alert type="info" text="未识别的作品类型" />
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            @click="model = false"
            prepend-icon="mdi-close"
            text="关闭"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
