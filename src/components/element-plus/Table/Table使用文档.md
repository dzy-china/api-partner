## table基础：
``` vue
<el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="address" label="Address" />
</el-table>


<script lang="ts" setup>
    const tableData = [
      {
        date: '2016-05-03',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Home',
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Home',
      }
    ]
</script>
```
## 显示竖直方向的边框：
    el-table 添加属性 border
## 鼠标悬浮时有斑马纹：
    el-table 添加属性 stripe

## 自定义每一行的样式：
    el-table 添加属性 row-class-name="tableRowClassName"

## 固定表头：
    el-table 添加属性  height="250"
## 多选：
    el-table-column 添加属性 type="selection"
## 自定义列模板
```vue
 <el-table :data="tableData" style="width: 100%">
    <el-table-column label="Date" >
        <template #default="scope">
           <span >{{ scope.row.date }}</span>
        </template>
    </el-table-column>
</el-table>
```

## 自定义表头：
```vue
<el-table :data="tableData" style="width: 100%">
    <el-table-column >
        <template #header>
          <span > 时间 </span>
        </template>
    </el-table-column>
</el-table>
```
## 展开行：
- 当行内容过多并且不想显示横向滚动条时，可以使用 Table 展开行功能
- 点击展开图标，被渲染成为展开行的内容
```vue
<el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="address" label="Address" />
    
    <!-- 展开行内容 -->
    <el-table-column type="expand">
      <template #default="props">
        <p>State: {{ props.row.state }}</p>
        <p>City: {{ props.row.city }}</p>
      </template>
    </el-table-column>
</el-table>
```

## 自定义索引：
通过给 type=index 的列传入 index 属性，可以自定义索引。 
该属性传入数字时，将作为索引的起始值。 
也可以传入一个方法，它提供当前行的行号（从 0 开始）作为参数，返回值将作为索引展示。

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="index" :index="indexMethod" />
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script lang="ts" setup>
const indexMethod = (index: number) => {
  return index * 2
}
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  }
]
</script>
```
## 表格布局 ：
通过属性 table-layout 可以指定表格中单元格的布局方式
table-layout参数： fixed , auto
```vue
<template>
  <el-table :data="tableData" :table-layout="fixed">
    <el-table-column prop="date" label="Date" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>
```

## 表格中使用图像预览：
```vue
<el-table-column label="Thumbnail" width="180">
    <template #default="scope">
        <div style="display: flex; align-items: center">
            <el-image :preview-src-list="srcList"/>
        </div>
    </template>
</el-table-column>
```
> 注：由于固定列是通过 sticky 来实现的，如果表格中含有固定列，请在图像上添加 preview-teleported 属性。



## Table 事件：

| 事件名             | 说明                                                         | 回调参数                          |
| :----------------- | :----------------------------------------------------------- | :-------------------------------- |
| select             | 当用户手动勾选数据行的 Checkbox 时触发的事件                 | selection, row                    |
| select-all         | 当用户手动勾选全选 Checkbox 时触发的事件                     | selection                         |
| selection-change   | 当选择项发生变化时会触发该事件                               | selection                         |
| cell-mouse-enter   | 当单元格 hover 进入时会触发该事件                            | row, column, cell, event          |
| cell-mouse-leave   | 当单元格 hover 退出时会触发该事件                            | row, column, cell, event          |
| cell-click         | 当某个单元格被点击时会触发该事件                             | row, column, cell, event          |
| cell-dblclick      | 当某个单元格被双击击时会触发该事件                           | row, column, cell, event          |
| cell-contextmenu   | 当某个单元格被鼠标右键点击时会触发该事件                     | row, column, cell, event          |
| row-click          | 当某一行被点击时会触发该事件                                 | row, column, event                |
| row-contextmenu    | 当某一行被鼠标右键点击时会触发该事件                         | row, column, event                |
| row-dblclick       | 当某一行被双击时会触发该事件                                 | row, column, event                |
| header-click       | 当某一列的表头被点击时会触发该事件                           | column, event                     |
| header-contextmenu | 当某一列的表头被鼠标右键点击时触发该事件                     | column, event                     |
| sort-change        | 当表格的排序条件发生变化的时候会触发该事件                   | `{ column, prop, order }`         |
| filter-change      | column 的 key， 如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件 | filters                           |
| current-change     | 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性 | currentRow, oldCurrentRow         |
| header-dragend     | 当拖动表头改变了列的宽度的时候会触发该事件                   | newWidth, oldWidth, column, event |
| expand-change      | 当用户对某一行展开或者关闭的时候会触发该事件（展开行时，回调的第二个参数为 expandedRows；树形表格时第二参数为 expanded） | row, (expandedRows \| expanded)   |