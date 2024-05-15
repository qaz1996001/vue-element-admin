<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-input placeholder="patient id" />
            </el-col>
            <el-col :span="8">
              <el-input placeholder="study date" />
            </el-col>
            <el-col :span="8">
              <el-input placeholder="gender" />
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-input placeholder="age" />
            </el-col>
            <el-col :span="8">
              <el-input placeholder="study description" />
            </el-col>
            <el-col :span="8">
              <el-input placeholder="accession number" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-button type="primary" @click="getList">search</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div>
        <el-form>
          <el-checkbox-group v-model="formThead">
            <el-row>
              <el-form-item label="General" />
              <el-checkbox>patient id</el-checkbox>
              <el-checkbox>study date</el-checkbox>
              <el-checkbox>gender</el-checkbox>
              <el-checkbox>age</el-checkbox>
              <el-checkbox>study description</el-checkbox>
              <el-checkbox>accession number</el-checkbox>
            </el-row>
            <el-form-item label="Structure" />
            <el-row>
              <el-form-item label="Structure" />
            </el-row>
            <el-row>
              <el-form-item label="Special" />
            </el-row>
            <el-row>
              <el-form-item label="Perfusion" />
            </el-row>
            <el-row>
              <el-form-item label="Functional" />
            </el-row>
          </el-checkbox-group>

        </el-form>
      </div>

      <!-- 用 ceheckbox 紀錄要顯示的欄位 -->
      <el-checkbox-group v-model="formThead">
        <el-checkbox v-for="key in listKeys" :key="key" :label="`${key}`" :checked="true">{{ key }}</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <!-- 特定欄位可能寬度需要調整 -->
      <template v-for="key in listKeys">
        <el-table-column v-if="formThead.includes(`${key}`)" :key="key" align="center" :label="`${key}`">
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
  name: 'ProjectSeries',
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
        url: '/query/list_project_series',
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
<style>
.el-input--medium .el-input__inner {
  height: 36px;
  /* line-height: 36px; */
  width: 95%;
  margin-top: 2%;
}

.el-button--medium {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px 20px 10px 20px;
  font-size: 14px;
  border-radius: 4px;
}
</style>

