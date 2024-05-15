<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-button @click="dialogFormVisible = true">新增專案</el-button>
        <el-button @click="deleteProject">刪除專案</el-button>
      </div>

      <!-- 用 checkbox 紀錄要顯示的欄位 -->
      <el-checkbox-group v-model="formThead">
        <el-checkbox v-for="key in listKeys" :key="key" :label="`${key}`" :checked="true">{{ key }}</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- 特定欄位可能寬度需要調整 -->
      <el-table-column type="index" label="No." />
      <el-table-column type="selection" align="center" />
      <template v-for="key in listKeys">
        <el-table-column v-if="formThead.includes(`${key}`)" :key="key" align="center" :label="`${key}`">
          <template slot-scope="{row}">
            <!-- 顯示 row.studies_date 和 row.gender 等等 -->
            <span>{{ row[key] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-dialog title="Create" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="專案名稱">
          <el-input v-model="temp.projectName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createdProject():updateProject()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import waves from '@/directive/waves'
// import { fetchList } from '@/api/study'
import request from '@/utils/myrequest'
// import { string } from 'jszip/lib/support'
export default {
  name: 'Study',
  directives: { waves },
  data() {
    return {
      formThead: ['patients_id', 'studies_date', 'gender'], // 顯示的欄位
      list: null,
      listKeys: [],
      total: 0,
      listLoading: true,
      temp: {
        projectName: ''
      },
      dialogFormVisible: false,
      dialogStatus: 'create',
      listQuery: {
        page: 1,
        limit: 20,
        gender: undefined,
        sort: '+id'
      },
      selection_list: []
    }
  },
  created() {
    this.getList(true)
  },
  methods: {
    getList(updateFormHead = false) {
      this.listLoading = true
      request({
        url: 'query/v2/list_project',
        method: 'get',
        params: {}
      }).then((response) => {
        console.log('測試 api')
        // console.log('response', response)
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listKeys = response.data.key

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
        .catch((error) => console.log('catch' + error))

      // 完成查詢
      this.listLoading = false

      // 更新要顯示的欄位
      if (updateFormHead) this.formThead = this.listKeys

      // })
    },

    createdProject() {
      console.log('createdProject')
      if (this.temp.projectName.length > 0) {
        const rep = request({
          url: 'project',
          method: 'post',
          params: { name: this.temp.projectName }
        }).then((response) => {
          console.log('list_project post api')
          this.getList()
          this.dialogFormVisible = false
          setTimeout(() => {
          }, 1.5 * 1000)
        }).catch((error) => console.log('catch' + error))
      }
    },
    updateProject() {
      console.log('updateProject')
    },
    indexMethod(index) {
      return index + 1
    },
    deleteProject() {
      this.listLoading = true
      this.selection_list.forEach(e => {
        const url = `project/${e.project_uid}`
        request({
          url: url,
          method: 'delete'
        }).then((response) => {
          console.log('deleteProject api')
          this.getList()
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }).catch((error) => console.log('catch' + error))
        // console.log(e)
        // console.log(url)
        // this.listLoading = false
      })
    },
    handleSelectionChange(selection) {
      console.log('handleSelectionChange')
      console.log(selection)
      this.selection_list = selection
    }
  }
}

</script>
<style scoped>
.el-button {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px 20px 10px 20px;
  font-size: 14px;
  border-radius: 4px;
}

</style>
