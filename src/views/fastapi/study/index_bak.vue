<template>
  <div class="app-container">
    <FilterContainer
      :searchKeyList="search_key_list"
      :opList="op_list"
      :searchList="search_list"
      @addSearchItem="add_search_item"
      @delSearchItem="del_search_item"
      @onSearch="getList(true,true)"
      @downloadExcel="downloadExcel"
      @addToProject="addToProject"
    />
    <ElTable :loading="listLoading" :data="list" :columns="formThead" />

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
<!--    <Pagination-->
<!--      v-show="total > 0"-->
<!--      :total="total"-->
<!--      :current-page.sync="listQuery.page"-->
<!--      :page-size.sync="listQuery.size"-->
<!--      @pagination="getList"/>-->
  </div>
</template>
<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination/index.vue' // secondary package based on el-pagination
import request from '@/utils/myrequest'
import { parseTime } from '@/utils'
import FilterContainer from '@/components/Custom/FilterContainer.vue'
import ElTable from '@/components/Custom/ElTable.vue'
// import Pagination from '@/components/Custom/Pagination.vue'

import { export_json_to_excel } from '@/vendor/Export2Excel'

export default {
  name: 'Study',
  components: { Pagination, ElTable, FilterContainer },
  directives: { waves },
  data() {
    return {
      base_url: 'http://127.0.0.1:8000/api/v1',
      formThead: [], // 顯示的欄位
      list: null,
      listKeys: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        size: 20,
        gender: undefined,
        sort: '+study_uid'
      },
      general_keys: [],
      structure_keys: [],
      special_keys: [],
      perfusion_keys: [],
      functional_keys: [],
      check_general_keys_all: true,
      check_structure_keys_all: true,
      check_special_keys_all: true,
      check_perfusion_keys_all: true,
      check_functional_keys_all: true,
      // seach
      op_list: [],
      search_key_list: [],
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
    this.getList(true, false)
  },
  methods: {
    getList(updateFormHead = false, is_search = false) {
      console.log('getList')
      this.listLoading = true
      const url = this.base_url + '/study/query/series'
      if (is_search) {
        console.log('this.search_list')
        console.log(this.search_list)
        let filter_list = this.search_list.filter(e => {
          return (e.field.length > 0) & (e.op.length > 0) & (e.value.length > 0)
        })
        filter_list = filter_list.map(e => {
          if (e.op === 'like'){
            e.value = '%'+ e.value +'%'
          }
          return e
        })
        request({
          url: url,
          method: 'post',
          params: this.listQuery,
          data: { 'filter_': filter_list }
        }).then((response) => {
          let items = response.data.items.map((x) =>{
            let series_description = x['series_description']
            for (let seriesDescriptionElement of series_description) {
              x[seriesDescriptionElement] = 1
            }
            return x
          })
          this.list = items
          this.total = response.data.total
          this.listKeys = response.data.key
          this.general_keys = response.data.group_key.general_keys
          this.structure_keys = response.data.group_key.structure_keys
          this.special_keys = response.data.group_key.special_keys
          this.perfusion_keys = response.data.group_key.perfusion_keys
          this.functional_keys = response.data.group_key.functional_keys
          this.search_key_list = []
          this.search_key_list.push(...this.general_keys, 'series_description')
          this.op_list = response.data.op_list
          this.check_general_keys_all = true
          this.check_structure_keys_all = true
          this.check_special_keys_all = true
          this.check_perfusion_keys_all = true
          this.check_functional_keys_all = true
          // 更新要顯示的欄位
          if (updateFormHead) {
            this.formThead = []
            this.formThead.push(...this.general_keys)
            this.formThead.push(...this.structure_keys)
            this.formThead.push(...this.special_keys)
            this.formThead.push(...this.perfusion_keys)
            this.formThead.push(...this.functional_keys)
          }

          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }).catch((error) => console.log('catch' + error))
        // 完成查詢
        this.listLoading = false

      } else {
        const rep = request({
          url: url,
          method: 'post',
          params: this.listQuery,
          data: { 'filter_': [] }
        }).then((response) => {
          let items = response.data.items.map((x) =>{
            let series_description = x['series_description']
            for (let seriesDescriptionElement of series_description) {
              x[seriesDescriptionElement] = 1
            }
            return x
          })
          this.list = items
          console.log('this.list')
          console.log(this.list)
          this.total = response.data.total
          this.listKeys = response.data.series_description
          this.general_keys = response.data.group_key.general_keys
          this.structure_keys = response.data.group_key.structure_keys
          this.special_keys = response.data.group_key.special_keys
          this.perfusion_keys = response.data.group_key.perfusion_keys
          this.functional_keys = response.data.group_key.functional_keys
          this.search_key_list = []
          this.search_key_list.push(...this.general_keys, 'series_description')
          this.op_list = response.data.op_list
          // 更新要顯示的欄位
          if (updateFormHead) {
            this.formThead = []
            this.formThead.push(...this.general_keys)
            this.formThead.push(...this.structure_keys)
            this.formThead.push(...this.special_keys)
            this.formThead.push(...this.perfusion_keys)
            this.formThead.push(...this.functional_keys)
        }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }).catch((error) => console.log('catch' + error))
        // 完成查詢
        this.listLoading = false
      }
    },
    downloadExcel() {
      const url = this.base_url + '/study/query/series/download'
      // const url = '/query/v2/list_study/download'
      console.log('this.downloadExcel')
      console.log('this.search_list')
      console.log(this.search_list)
      console.log('this.formThead')
      console.log(this.formThead)
      const filter_list = this.search_list.filter(e => {
        return (e.field.length > 0) & (e.op.length > 0) & (e.value.length > 0)
      })
      request({
        url: url,
        method: 'post',
        params: this.listQuery,
        data: { 'filter_': filter_list }
      }).then((response) => {
        // console.log('response.data')
        // console.log(response.data)
        const header = response.data.key.filter(e => {
          return this.formThead.includes(e);
        })
        console.log('header')
        console.log(header)
        let items = response.data.items.map((x) =>{
          let series_description = x['series_description']
          for (let seriesDescriptionElement of series_description) {
            x[seriesDescriptionElement] = 1
          }
          return x
        })
        const data = this.formatJson(header, response.data.items)

        export_json_to_excel({
          header: header,
          data: data,
          filename: 'export_data',
          autoWidth: true,
          bookType: 'xlsx' })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
    handleGeneralCheckAllChange(is_checked) {
      console.log('handleGeneralCheckAllChange')
      this.check_general_keys_all = is_checked
      console.log('this.check_general_keys_all', this.check_general_keys_all)
      this.handleAllChange(is_checked, this.general_keys, 0)
    },
    handleStructureCheckAllChange(is_checked) {
      console.log('handleStructureCheckAllChange')
      let offset_index = 0
      for (let i = 0; i < this.general_keys.length; i++) {
        if (this.formThead.includes(this.general_keys[i])) {
          offset_index = offset_index + 1
        }
      }
      this.handleAllChange(is_checked, this.structure_keys, offset_index)
    },
    handleSpecialCheckAllChange(is_checked) {
      console.log('handleSpecialCheckAllChange')
      let offset_index = 0
      for (let i = 0; i < this.general_keys.length; i++) {
        if (this.formThead.includes(this.general_keys[i])) {
          offset_index = offset_index + 1
        }
      }
      for (let i = 0; i < this.structure_keys.length; i++) {
        if (this.formThead.includes(this.structure_keys[i])) {
          offset_index = offset_index + 1
        }
      }
      this.handleAllChange(is_checked, this.special_keys, offset_index)
    },
    handlePerfusionCheckAllChange(is_checked) {
      console.log('handlePerfusionCheckAllChange')
      let offset_index = 0
      for (let i = 0; i < this.general_keys.length; i++) {
        if (this.formThead.includes(this.general_keys[i])) {
          offset_index = offset_index + 1
        }
      }
      for (let i = 0; i < this.structure_keys.length; i++) {
        if (this.formThead.includes(this.structure_keys[i])) {
          offset_index = offset_index + 1
        }
      }
      for (let i = 0; i < this.special_keys.length; i++) {
        if (this.formThead.includes(this.special_keys[i])) {
          offset_index = offset_index + 1
        }
      }
      this.handleAllChange(is_checked, this.perfusion_keys, offset_index)
    },
    handleFunctionalCheckAllChange(is_checked) {
      console.log('handleFunctionalCheckAllChange')
      let offset_index = 0
      for (let i = 0; i < this.general_keys.length; i++) {
        if (this.formThead.includes(this.general_keys[i])) {
          offset_index = offset_index + 1
        }
      }
      for (let i = 0; i < this.structure_keys.length; i++) {
        if (this.formThead.includes(this.structure_keys[i])) {
          offset_index = offset_index + 1
        }
      }
      for (let i = 0; i < this.special_keys.length; i++) {
        if (this.formThead.includes(this.special_keys[i])) {
          offset_index = offset_index + 1
        }
      }
      for (let i = 0; i < this.perfusion_keys.length; i++) {
        if (this.formThead.includes(this.perfusion_keys[i])) {
          offset_index = offset_index + 1
        }
      }
      this.handleAllChange(is_checked, this.functional_keys, offset_index)
    },
    handleAllChange(is_checked, all_keys_list, offset_index) {
      // console.log('handleCheckAllChange')
      // console.log('is_checked', is_checked)
      // console.log('offset_index', offset_index)
      if (is_checked) {
        for (let i = 0; i < all_keys_list.length; i++) {
          const index = this.formThead.indexOf(all_keys_list[i])
          if (index === -1) { // only splice array when item is found
            this.formThead.splice(i + offset_index, 0, all_keys_list[i]) // 2nd parameter means remove one item only
          }
        }
      } else {
        for (let i = 0; i < all_keys_list.length; i++) {
          const index = this.formThead.indexOf(all_keys_list[i])
          if (index > -1) { // only splice array when item is found
            this.formThead.splice(index, 1) // 2nd parameter means remove one item only
          }
        }
      }
    },
    addToProject(){
      console.log('addToProject')
    },
  }
}

</script>
<style>

.el-table th{
  user-select: initial;
}

.el-form-item.el-form-item--default div:nth-child(3) > div > input{
  width: 85%;
}

button.el-button {
  margin-bottom: 15px;
  margin-right: 15px;
  font-size: 16px;
  border-radius: 10px;
}
</style>
