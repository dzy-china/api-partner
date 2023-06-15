<template>

  <div class="hs-padding-left-right-50 hs-padding-top-bottom-15 hs-row-end-center">
    <el-button type="primary" @click="dialogVisible = true">新增</el-button>
  </div>

<!--  表格 -->
  <el-table :data="tableData" stripe  border style="width: 100%">
    <el-table-column type="index" :index="1" />
    <el-table-column label="请求方式"  prop="method"></el-table-column>
    <el-table-column label="路由" >
      <template #default="scope">
        <span>http://localhost:{{expressPort}}</span>
        <div  style="display: inline-block;color:#67C23A">{{scope.row.url}}</div>
      </template>
    </el-table-column>

    <el-table-column label="响应" >
      <template #default="scope">
        <div  style="color:#67C23A">{{scope.row.response}}</div>
      </template>
    </el-table-column>

    <el-table-column label="操作" >
      <template #default="scope">
        <el-button type="warning" @click="onEditForm(scope.row)">编辑</el-button>
        <el-button type="danger" @click="onDelForm(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>


<!--新增弹框 -->
  <el-dialog
      v-model="dialogVisible"
      title="新增"
      width="50%"
      draggable
  >
    <el-form :model="form">
<!--  请求方式    -->
      <el-form-item label="请求方式" :label-width="140">
        <el-select v-model="form.method" placeholder="请求方式">
          <el-option label="get" value="get" />
          <el-option label="post" value="post" />
        </el-select>
      </el-form-item>

 <!--  路由    -->
      <el-form-item label="路由" :label-width="140">
        <el-input v-model="form.url" placeholder="/about 或 /goods/:id"/>
      </el-form-item>

      <!-- 响应内容    -->
      <el-form-item label="响应内容" :label-width="140">
        <el-input
            v-model="form.response"
            :autosize="{ minRows: 3, maxRows: 5 }"
            type="textarea"
            placeholder="请输入响应内容"
        />
      </el-form-item>
    </el-form>

    <!-- 弹框底部   -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmitForm">
          确认
        </el-button>
      </span>
    </template>

  </el-dialog>


  <!--编辑弹框 -->
  <el-dialog
      v-model="editDialogVisible"
      title="编辑"
      width="50%"
      draggable
  >
    <el-form :model="editForm">
      <!--  请求方式    -->
      <el-form-item label="请求方式" :label-width="140">
        <el-select v-model="editForm.method" placeholder="请求方式">
          <el-option label="get" value="get" />
          <el-option label="post" value="post" />
        </el-select>
      </el-form-item>

      <!--  路由    -->
      <el-form-item label="路由" :label-width="140">
        <el-input v-model="editForm.url" placeholder="/about 或 /goods/:id"/>
      </el-form-item>

      <!-- 响应内容    -->
      <el-form-item label="响应内容" :label-width="140">
        <el-input
            v-model="editForm.response"
            :autosize="{ minRows: 3, maxRows: 5 }"
            type="textarea"
            placeholder="请输入响应内容"
        />
      </el-form-item>
    </el-form>

    <!-- 弹框底部   -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onEditSubmitForm">
          确认
        </el-button>
      </span>
    </template>

  </el-dialog>
</template>

<script setup>
   /* 导入electronAPI*/
 const  { ipcRendererSend, fromMain , expressPort}=  window.electronAPI

  const tableData = ref([])

    // 向主进程发送消息
    ipcRendererSend('toMain');

    // 监听主进程的消息
    fromMain( (event,arg)=>{
      tableData.value = arg
    })


/* 新增弹框 js部分*/
   // 是否显示弹框
    const dialogVisible = ref(false)

    // 弹框表单项
    const form = ref({
      method: '',
      url: '',
      response: '',
    })

    // 表单确认事件
    const onSubmitForm = () =>{
      // 1.判断数据格式...

      // 2. 向主进程发送消息
      ipcRendererSend('toMainAdd', JSON.stringify(form.value));
      dialogVisible.value = false;
    }

/* 编辑弹框 js部分*/
   // 弹框表单项
   const editForm = ref({
     method: '',
     url: '',
     response: '',
   })

   // 是否显示弹框
   const editDialogVisible = ref(false)

   // 表单编辑某行事件
   const onEditForm = (data) =>{
     editForm.value = data
     editDialogVisible.value = true;
   }

    // 表单确认事件
    const onEditSubmitForm = () =>{
      // 1.判断数据格式...

      // 2. 向主进程发送消息
      ipcRendererSend('toMainEdit', JSON.stringify(editForm.value));
      editDialogVisible.value = false;
    }

/*表单删除某行事件*/
const onDelForm = (id) =>{
  ipcRendererSend('toMainDel', id);
}
</script>

<style scoped>

</style>
