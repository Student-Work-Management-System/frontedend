<script lang="ts" setup>
import { apiGetPermissionTree, apiUpdateRolePermissions, type PermissionTree } from '@/api/role'
import { notify } from '@kyvg/vue3-notification'
import { watch } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'

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
const props = defineProps<{ ridList: string[]; permissions: string[] }>()
const emits = defineEmits(['onClosed'])
const data = ref<ITreeNode[]>([])
const treeRef = ref<any>(null)
const loading = ref(true)

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

const onSearch = (value: any) => {
  treeRef.value!.treeFactory.searchTree(value, { isFilter: true })
}

const editPermissionLogic = () => {
  loading.value = true
  const nodes: IInnerTreeNode[] = treeRef.value!.treeFactory.getCheckedNodes()
  const permissions = nodes.filter((n) => n.isLeaf).map((n) => n.id)
  console.log(permissions)
  props.ridList.forEach(async (rid) => {
    const { data: result } = await apiUpdateRolePermissions({
      rid,
      permissions: permissions as string[]
    })
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: `角色:${rid} 权限更新！` })
  })
  setTimeout(() => {
    loading.value = false
    emits('onClosed')
  }, 500)
}

watch(model, () => {
  if (!model.value) {
    return
  }
  setTimeout(() => {
    const leafNode = treeRef.value!.treeFactory.treeData.value.filter(
      (node: { isLeaf: any }) => node.isLeaf
    )
    leafNode
      .filter((node: { id: string }) => !props.permissions.includes(node.id))
      .forEach((node: any) => treeRef.value.treeFactory.uncheckNode(node))
    leafNode
      .filter((node: { id: string }) => props.permissions.includes(node.id))
      .forEach((node: any) => treeRef.value.treeFactory.toggleCheckNode(node))
  }, 500)
})
</script>
<template>
  <v-dialog v-model="model" width="600">
    <v-card title="选择权限" prepend-icon="mdi-cog" :loading="loading" style="overflow-y: hidden">
      <v-container>
        <d-search class="mb-1" style="width: 100%" is-keyup-search placeholder="搜索权限..." @search="onSearch"></d-search>
        <d-tree ref="treeRef" :height="400" :loading="loading" :data="data" check />
      </v-container>
      <v-card-actions class="d-flex justify-space-evenly">
        <v-btn :loading="loading" color="indigo" @click="editPermissionLogic">修改</v-btn>
        <v-btn @click="model = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
