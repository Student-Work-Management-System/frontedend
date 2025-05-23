export const chLabel = {
  footerLeft: (top: number, bottom: number) => `纪录 ${top} 至 ${bottom}`,
  first: '头页',
  previous: '上一页',
  next: '下一页',
  last: '尾页',
  footerRight: {
    selected: '选择：',
    filtered: '过滤：',
    loaded: '载入：'
  },
  processing: '工作中',
  tableSetting: '表格设定',
  exportExcel: '汇出 Excel',
  importExcel: '汇入 Excel',
  back: '关',
  reset: '预设',
  sortingAndFiltering: '排序及过滤',
  sortAscending: '小至大排序',
  sortDescending: '大至小排序',
  near: '≒ 接近',
  exactMatch: '= 等于',
  notMatch: '≠ 不等于',
  greaterThan: '&gt; 大于',
  greaterThanOrEqualTo: '≥ 大于或等于',
  lessThan: '&lt; 少于',
  lessThanOrEqualTo: '≤ 少于或等于',
  regularExpression: '~ 正规表示式',
  customFilter: '过滤内容',
  listFirstNValuesOnly: (n: number) => `只列出 ${n} 项`,
  apply: '应用',
  noRecordIsRead: '没有纪录被读取',
  readonlyColumnDetected: '不可更新唯读纪录',
  columnHasValidationError: (name: string, err: string) => `纪录栏位 ${name} 发生核实错误: ${err}`,
  noMatchedColumnName: '没有能配对之栏位',
  invalidInputValue: '输入错误内容',
  missingKeyColumn: '找不到关键栏位',
  noRecordIndicator: '沒有纪录'
}
