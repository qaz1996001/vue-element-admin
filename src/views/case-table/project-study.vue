<template>
  <div class="app-container">
    <div>
      <el-form v-model="project_list">
        <el-row>
          <el-col :span="6">
            <el-form-item label="專案名稱：" ></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-select v-model="current_project_uid"
                       placeholder="請選擇欄位"
                       @change="selectProject">
              <el-option  v-for="item in project_list"
                         :key="item.project_uid"
                         :label="item.project_name"
                         :value="item.project_uid"/>
            </el-select>
          </el-col>
          <el-col :span="12">

          </el-col>
      </el-row>
      </el-form>
    </div>
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
            <el-col :span="18">
              <el-form-item></el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="getList()">search</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
        <!-- 特定欄位可能寬度需要調整 -->
      <el-table-column type="selection" align="center" />
      <template v-for="key in formThead">
        <el-table-column v-if="formThead.includes(`${key}`)" :key="key" align="center" :label="`${key}`">
          <template slot-scope="{row}">
            <span v-if="!key.startsWith('extra_data')">
              {{ row[key] }}
            </span>
            <!-- 顯示 extra_data 內的值 -->
            <span v-else>

              {{ getJsonPathValue(row['extra_data'], key) }}
            </span>
            <!-- 顯示 row.studies_date 和 row.gender 等等 -->
<!--            <span>{{ row[key] }}</span>-->
<!--            <span v-if="key.startsWith('extra_data')"  >{{ row['extra_data'][key] }}</span>-->
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

  </div>
</template>
<script>
import waves from '@/directive/waves'
// import { fetchList } from '@/api/study'
import Pagination from '@/components/Pagination/index.vue' // secondary package based on el-pagination
import request from '@/utils/myrequest'
import { JSONPath } from 'jsonpath-plus';

export default {
  name: 'ProjectStudy',
  components: {Pagination},
  directives: {waves},
  created() {
    this.getList(true)
  },
  data() {
    return {
      formThead: ['project_name'], // 顯示的欄位
      list: null,
      listKeys: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+project_uid'
      },
      general_keys: [],
      check_general_keys_all: true,
      op_list: [],
      search_key_list: [],
      search_list: [
        {
          field: '',
          op: '',
          value: ''
        }
      ],
      project_list: [],
      current_project_name: '',
      current_project_uid: '',

    }
  },
  created() {
    // this.getList(true)
    this.getProjectList()
  },
  methods: {
    getProjectList() {
      request({
        url: '/project',
        method: 'get'
      }).then((response) => {
        this.project_list = response.items
        setTimeout(() => {
        }, 1.5 * 1000)
      })

    },
    getList(updateFormHead = false) {
      console.log('getList')
      console.log(this.project_name)
      console.log('this.search_list')
      console.log(this.search_list)
      const filter_list = this.search_list.filter(e => {
        return (e.field.length > 0) & (e.op.length > 0) & (e.value.length > 0)
      })
      filter_list.push({
        field: 'project_uid',
        op: '==',
        value: this.current_project_uid
      })
      request({
        url: '/project_study/get_data',
        method: 'post',
        params: this.listQuery,
        data: {'filter_': filter_list}
      }).then((response) => {
        console.log('response')
        console.log(response)
        this.list = response.items
        this.total = response.total
        this.formThead = response.key
        this.op_list = response.op_list
        this.general_keys = response.group_key.general_keys
        this.search_key_list = []
        this.search_key_list.push(...this.general_keys)
        this.search_key_list.push(...response.group_key.extra_data_keys)

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
    handleGeneralCheckAllChange(is_checked) {
      console.log('handleGeneralCheckAllChange')
      this.check_general_keys_all = is_checked
      console.log('this.check_general_keys_all', this.check_general_keys_all)
      this.handleAllChange(is_checked, this.general_keys, 0)
    },
    handleAllChange(is_checked, all_keys_list, offset_index) {
      console.log('handleCheckAllChange')
      console.log('is_checked', is_checked)
      console.log('offset_index', offset_index)
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
    selectProject(items) {
      console.log('selectProject')
      this.project_list.forEach(e => {
        if (items === e.project_uid) {
          console.log(e)
          this.current_project_name = e.project_name
        }
      })
      console.log(this.current_project_name)
      console.log(this.current_project_uid)
      this.getList()
    },
    getJsonPathValue(data, key) {
      if (!data || !key.startsWith('extra_data')) return null;
      try {
        // 將 "extra_data.some.path" 轉換為 JSONPath 格式 "$.some.path"
        const path = key.replace('extra_data', '$');
        const result = JSONPath({path, json: data});
        // 返回第一個匹配的值或 null
        return Array.isArray(result) && result.length > 0 ? result[0] : null;
      } catch (error) {
        console.error(`Error parsing JSONPath for key "${key}":`, error);
        return null;
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

