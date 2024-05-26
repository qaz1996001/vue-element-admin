<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-form ref="search_list" v-model="search_list">
          <el-form-item v-for="(item, index) in search_list">
            <el-row>
              <el-col :span="6">
                <el-select v-model="item.field" placeholder="請選擇欄位">
                  <el-option v-for="key in general_keys" :key="key" :label="key" :value="key" />
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
              <el-button type="primary" @click="getList(false,true)">search</el-button>
            </el-col>
          </el-row>
        </el-form>

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

    <!--    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>-->
    <el-table v-loading="listLoading" :data="list" border @selection-change="handleSelectionChange">
      <!-- 特定欄位可能寬度需要調整 -->
      <el-table-column type="selection" align="center" />
      <template v-for="key in formThead">
        <el-table-column
          v-if="formThead.includes(`${key}`)"
          :key="key"
          align="center"
          :label="`${key}`"
          :min-width="table_min_width[key]"
        >
          <template slot-scope="{row}">
            <!--             顯示 row.studies_date 和 row.gender 等等-->
            {{ row[key] }}
            <!--            <span>{{ row[key] }}</span>-->
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

import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import request from '@/utils/myrequest'
export default {
  name: 'Study',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      formThead: ['patient_id', 'gender'], // 顯示的欄位
      table_min_width: { 'patient_id': '15%', 'gender': '10%', 'age': '10%', 'study_description': '30%',
        'accession_number': '25%'
      },
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
      // seach
      op_list: [],
      search_list: [
        {
          field: '',
          op: '',
          value: ''
        }
      ]
    }
  },
  created() {
    this.getList(true)
  },
  methods: {
    getList(updateFormHead = false, is_search = false) {
      this.listLoading = true

      if (is_search) {
        const filter_list = this.search_list.filter(e => {
          return (e.field.length > 0) & (e.op.length > 0) & (e.value.length > 0)
        }).map(e => {
          e.value = e.value.trim()
          return e
        })
        this.listLoading = true
        const rep = request({
          url: '/query/v2/list_study_text_report',
          method: 'post',
          params: this.listQuery,
          data: { 'filter_': filter_list }
        }).then((response) => {
          console.log('測試 api')
          // console.log('response', response)
          this.list = response.data.data.items
          this.total = response.data.data.total
          this.listKeys = response.data.key
          this.general_keys = response.data.group_key.general_keys
          this.op_list = response.data.op_list
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
          .catch((error) => console.log('catch' + error))
        // 完成查詢
        this.listLoading = false
        this.formThead = []
        this.formThead.push(...this.general_keys)
      } else {
        const rep = request({
          url: '/query/v2/list_study_text_report',
          method: 'get',
          params: this.listQuery
        }).then((response) => {
          this.list = response.data.data.items
          this.total = response.data.data.total
          this.listKeys = response.data.key
          this.general_keys = response.data.group_key.general_keys
          this.op_list = response.data.op_list
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
          .catch((error) => console.log('catch' + error))

        // 完成查詢
        this.listLoading = false

        // 更新要顯示的欄位
        // if (updateFormHead) this.formThead = this.listKeys
        if (updateFormHead) {
          this.formThead = []
          this.formThead.push(...this.general_keys)
        }
      }
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
      for (var i = 0; i < datas.length; i++) {
        if (i === index) {
          datas.splice(i, 1)
        }
      }
    },
    handleSelectionChange(selection) {
      console.log('handleSelectionChange')
      console.log(selection)
    }
  }
}

</script>
<style>

.el-textarea {
  width: 100%;
  padding-right: 30px;

}

div:nth-child(4) button{
  margin-left: 30px;
}

.el-table th{
  user-select: initial;
}
.el-table td.el-table_1_column_8.is-center .cell{
  white-space: pre-wrap;

}
</style>
