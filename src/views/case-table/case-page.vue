<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 用 checkbox 紀錄要顯示的欄位 -->
      <el-checkbox-group v-model="formThead">
        <el-checkbox v-for="key in listKeys" :key="key" :label="`${key}`" :checked="true">{{ key }}</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <!-- 特定欄位可能寬度需要調整 -->
      <template v-for="key in listKeys">
        <el-table-column v-if="formThead.includes(`${key}`)" :key="key" align="center" :label="`${key}`" width="160">
          <template slot-scope="{row}">
            <!-- 顯示 row.studies_date 和 row.gender 等等 -->
            <span>{{ row[key] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
import waves from '@/directive/waves'
// import { fetchList } from '@/api/study'
import request from '@/utils/myrequest'
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
      listQuery: {
        page: 1,
        limit: 20,
        gender: undefined,
        sort: '+id'
      }
    }
  },
  created() {
    this.getList(true)
  },
  methods: {
    getList(updateFormHead = false) {
      this.listLoading = true
      const rep = request({
        url: '/project',
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
    }
  }
}

</script>
<style scoped></style>
