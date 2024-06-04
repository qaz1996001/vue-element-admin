<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-input placeholder="patient id"></el-input>
            </el-col>
            <el-col :span="8">
              <el-input placeholder="gender"></el-input>
            </el-col>
            <el-col :span="8">
              <el-input placeholder="age"></el-input>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="8">
              <el-button @click="getList" type="primary">search</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div>
        <el-form>
          <el-checkbox-group v-model="formThead">
            <el-row>
              <el-form-item label="General" />
              <el-checkbox v-for="key in general_keys" :key="key" :label="`${key}`" :checked="true">{{ key }}</el-checkbox>
            </el-row>
          </el-checkbox-group>
        </el-form>
      </div>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <!-- 特定欄位可能寬度需要調整 -->
      <el-table-column type="index" label="No." />
      <el-table-column type="selection" align="center" />
      <template v-for="key in listKeys">
        <el-table-column v-if="formThead.includes(`${key}`)" :key="key" align="center" :label="`${key}`" width="160">
          <template slot-scope="{row}">
            <!-- 顯示 row.studies_date 和 row.gender 等等 -->
            <span>{{ row[key] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>
<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination/index.vue' // secondary package based on el-pagination
import request from '@/utils/myrequest'
export default {
  name: 'Patient',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      formThead: ['patient_id', 'gender', 'age'], // 顯示的欄位
      list: null,
      listKeys: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        gender: undefined,
        sort: '+patient_id'
      },
      general_keys: [],
    }
  },
  created() {
    this.getList(true)
  },
  methods: {
    getList(updateFormHead = false) {
      this.listLoading = true
      let rep = request({
        url: '/query/v2/list_patient',
        method: 'get',
        params: this.listQuery
      }).then((response) => {
        console.log('測試 api')
        // console.log('response', response)
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listKeys = response.data.key
        this.general_keys = response.data.group_key.general_keys

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
        .catch((error) => console.log('catch' + error))

      // 完成查詢
      this.listLoading = false

      // 更新要顯示的欄位
      if (updateFormHead) {
        this.formThead = []
        this.formThead.push(...this.general_keys)
      }
    }
  }
}

</script>
<style>

.el-table th{
  user-select: initial;
}
</style>
