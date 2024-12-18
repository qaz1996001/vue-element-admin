<template>
  <div class="app-container">
    <FilterContainer
      :searchKeyList="search_key_list"
      :opList="op_list"
      :searchList="search_list"
      @addSearchItem="add_search_item"
      @delSearchItem="del_search_item"
      @onSearch="getList(true,true)"
    />
    <!--      @downloadExcel="downloadExcel"-->
<!--      @addToProject="addToProject"-->


    <el-table v-loading="listLoading" :data="list" border @selection-change="handleSelectionChange">
      <!-- 特定欄位可能寬度需要調整 -->
      <el-table-column type="selection" align="center" />
      <template v-for="key in formThead">
        <el-table-column
          v-if="formThead.includes(`${key}`)"
          :key="key"
          align="center"
          :label="`${key}`"
          :min-width="table_min_width[key]">
          <template slot-scope="{row}">
            <!--             顯示 row.studies_date 和 row.gender 等等-->
             <el-tooltip v-if="key.startsWith('text')| key.startsWith('impression')" class="item" effect="light" :content="row[key]" placement="top-start">
               <div slot="content" >{{ row[key] }}</div>
               <div class="btn">{{ row[key] }}</div>
             </el-tooltip>
            <div v-else >{{ row[key] }}</div>

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

import Pagination from '@/components/Pagination/index.vue'
import waves from '@/directive/waves'
import request from '@/utils/myrequest'
import FilterContainer from "@/components/Custom/FilterContainer.vue";
import ElTable from '@/components/Custom/ElTable.vue'
import CustomSelect from '@/components/Custom/CustomSelect.vue'

export default {
  name: 'TextRepost',
  components: {FilterContainer, Pagination },
  directives: { waves },
  data() {
    return {
      // formThead: ['accession_number','text'], // 顯示的欄位
      formThead: ['patient_id', 'gender', 'accession_number', 'study_description', 'text', 'impression'],
      search_key_list: ['patient_id', 'gender', 'accession_number', 'study_description', 'text'],
      table_min_width: { 'patient_id': '15%', 'gender': '15%', 'study_description': '30%',
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
        sort: '+accession_number'
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
      const url = '/text_report/query'
      let filter_list = this.search_list.filter(e => {
        return (e.field.length > 0) & (e.op.length > 0) & (e.value.length > 0)
      }).map(e => {
        e.value = e.value.trim()
        return e
      }
      )
      filter_list = filter_list.map(e => {
        if (e.op === 'like'){
          if (!e.value.startsWith('%')){
            e.value = '%'+ e.value
          }
          if (!e.value.endsWith('%')){
            e.value = e.value + '%'
          }
        }
        return e
      })

      const rep = request({
        url: url,
        method: 'post',
        params: this.listQuery,
        data: { 'filter_': filter_list }
      }).then((response) => {
        console.log('測試 api')
        // console.log('response', response)
        this.list = response.items
        this.total = response.total
        this.op_list = response.op_list
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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

button.el-button.el-button--primary {
  margin-bottom: 10px;
  padding-left: 10px;
  font-size: 14px;
  border-radius: 4px;
  margin-left: 30px;
}

button.el-button.el-button--danger {
  margin-bottom: 10px;
  padding-left: 10px;
  font-size: 14px;
  border-radius: 4px;
  margin-left: 30px;
}

.el-table th{
  user-select: initial;
}
.el-table td.el-table_1_column_8.is-center .cell{
  white-space: pre-wrap;

}
.el-tooltip__popper {
  max-width: 50vw;
  font-size: 16px;
}
.btn {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
