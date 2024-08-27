<template>
  <div class="app-container">
        <div class="filter-container">
      <div>
        <el-form ref="search_list" v-model="search_list">
          <el-form-item v-for="(item, index) in search_list">
            <el-row>
              <el-col :span="6">
                <el-select v-model="item.field" placeholder="請選擇欄位">
                  <el-option v-for="key in search_key_list" :key="key" :label="key" :value="key" />
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select v-model="item.op" placeholder="計算符號">
                  <el-option v-for="op in op_list" :key="op" :label="op" :value="op" />
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-input v-model="item.value" placeholder="請輸入" />
              </el-col>
              <el-col :span="6">
                <el-button v-if="index !== 0" type="danger" @click="del_search_item(index)"> del </el-button>
                <el-button v-if="index === 0" type="primary" @click="add_search_item">add</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-button type="primary" @click="getList(true,true)">search</el-button>
              <el-button type="primary" @click="downloadExcel()">download excel</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <!-- 特定欄位可能寬度需要調整 -->
      <el-table-column type="selection" align="center" />
      <template v-for="key in formThead">
        <el-table-column v-if="formThead.includes(`${key}`)" :key="key" align="center" :label="`${key}`">
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
// import { fetchList } from '@/api/study'
import request from '@/utils/myrequest'
export default {
  name: 'Patient',
  directives: { waves },
  data() {
    return {
      base_url: 'http://127.0.0.1:8000/api/v1',
      formThead: ['patient_uid', 'patient_id'], // 顯示的欄位
      list: null,
      listKeys: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id'
      },
      op_list: [],
      search_key_list: [],
      search_list: [
        {
          field: '',
          op: '',
          value: ''
        }]
    }
  },
  created() {
    this.getList(true)
  },
  methods: {
    getList(updateFormHead = false) {
      this.listLoading = true
      const rep = request({
        url: this.base_url + '/patient/',
        method: 'get',
        params: {}
      }).then((response) => {
        console.log('測試 api')
        console.log('response', response)
        this.list = response.data.items
        this.total = response.data.total
        this.listKeys = ['patient_uid','patient_id','gender','birth_date']
        console.log('this.listKeys')
        console.log(this.listKeys)
        console.log('this.formThead')
        console.log(this.formThead)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
        // 更新要顯示的欄位
        if (updateFormHead) this.formThead = this.listKeys
      })
        .catch((error) => console.log('catch' + error))
      // 完成查詢
      this.listLoading = false
    },
    add_search_item() {
      this.search_list.push({
        field: '',
        op: '',
        value: ''
      })
    },
    del_search_item(index) {
      // this.search_list
      console.log(index)
      const datas = this.search_list
      for (let i = 0; i < datas.length; i++) {
        if (i === index) {
          datas.splice(i, 1)
        }
      }
    },
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
