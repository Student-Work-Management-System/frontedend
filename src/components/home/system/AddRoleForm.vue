<script lang="ts" setup>
import { apiAddRole, apiGetPermissionTree, type PermissionTree, type Permission } from '@/api/role'
import { notify } from '@kyvg/vue3-notification'
import { onMounted, ref } from 'vue'
import { reactive } from 'vue'

interface ITreeNode {
  label: string
  id?: string
  children?: ITreeNode[]

  selected?: boolean
  checked?: boolean
  expanded?: boolean

  disableSelect?: boolean
  disableCheck?: boolean
  disableToggle?: boolean
}

interface IInnerTreeNode extends ITreeNode {
  level: number
  idType?: 'random'
  parentId?: string
  isLeaf?: boolean
  parentChildNodeCount?: number
  currentIndex?: number
  loading?: boolean // 节点是否显示加载中
  childNodeCount?: number // 该节点的子节点的数量
  isMatched?: boolean // 搜索过滤时是否匹配该节点
  childrenMatched?: boolean // 搜索过滤时是否有子节点存在匹配
  isHide?: boolean // 过滤后是否不显示该节点
  matchedText?: string // 节点匹配的文字（需要高亮显示）
}

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const loading = ref(false)
const data = ref<ITreeNode[]>([])
const treeRef = ref<any>(null)
const step = ref(1)

const onSearch = (value: any) => {
  treeRef.value!.treeFactory.searchTree(value, { isFilter: true })
}

const newRole = reactive({
  roleName: '',
  roleDesc: ''
})

const NextBtnHandler = () => {
  step.value++
}

const AddRoleLogic = async () => {
  loading.value = true
  const nodes: IInnerTreeNode[] = treeRef.value!.treeFactory.getCheckedNodes()
  const permissions = nodes
    .filter((n) => n.isLeaf)
    .map((node) => ({ pid: node.id, permissionDesc: '', permissionName: '' }) as Permission)
  const { data: result } = await apiAddRole({ ...newRole, permissions })
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '添加成功！' })
  loading.value = false
  emits('onClosed')
  step.value = 1
}

const permissionIntoNode = (permission: PermissionTree): ITreeNode => {
  return {
    id: permission.pid,
    label:
      permission.children.length > 0
        ? permission.permissionName
        : `${permission.permissionName}（${permission.permissionDesc}）`,
    expanded: false,
    children: permission.children.map((p) => permissionIntoNode(p))
  }
}

const updateDataTree = (permissions: PermissionTree[]) => {
  permissions.forEach((p) => {
    data.value.push(permissionIntoNode(p))
  })
}

const fetchPermissionLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetPermissionTree()
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  updateDataTree(result.data)

  loading.value = false
}
onMounted(fetchPermissionLogic)
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-account-plus" title="角色信息">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="角色名称"
                v-model="newRole.roleName"
                :counter="20"
                required
                :rules="[() => !!newRole.roleName || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
              <v-textarea
                label="角色描述"
                v-model="newRole.roleDesc"
                :counter="255"
                required
                :rules="[() => !!newRole.roleDesc || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-textarea>
            </v-form>
          </v-container>
          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn
              :disabled="!form"
              text="下一步"
              color="indigo"
              @click="NextBtnHandler"
              variant="plain"
            ></v-btn>
            <v-btn text="取消" @click="model = false" variant="plain"></v-btn>
          </v-container>
        </v-card>
      </v-window-item>
      <v-window-item :value="2">
        <v-card
          title="选择权限"
          prepend-icon="mdi-cog"
          :loading="loading"
          style="overflow-y: hidden"
        >
          <v-container>
            <d-search
              class="mb-1"
              style="width: 100%"
              is-keyup-search
              placeholder="搜索权限..."
              @search="onSearch"
            ></d-search>
            <d-tree ref="treeRef" :height="400" :loading="loading" :data="data" check />
          </v-container>
          <v-card-actions class="d-flex justify-space-evenly">
            <v-btn :loading="loading" color="indigo" @click="AddRoleLogic">提交</v-btn>
            <v-btn @click="(step = 1), (model = false)">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-window-item>
    </v-window>
  </v-dialog>
</template>

<style>
.svg-icon {
  margin-right: 0.5rem;
}
</style>

<style scoped>
.form > * {
  margin-bottom: 0.5rem;
}
</style>
