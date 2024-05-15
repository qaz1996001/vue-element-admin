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
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-form>
          <el-row>
            <el-form-item label="General">
              <el-checkbox v-model="check_general_keys_all" :checked="true" @change="handleGeneralCheckAllChange">
                General Checked All
              </el-checkbox>
            </el-form-item>
            <el-checkbox-group v-model="formThead">
              <el-checkbox v-for="key in general_keys" :key="key" :label="`${key}`" :checked="true">{{ key }}</el-checkbox>
            </el-checkbox-group>
          </el-row>
          <el-row>
            <el-form-item label="Structure">
              <el-checkbox v-model="check_structure_keys_all" :checked="true" @change="handleStructureCheckAllChange">
                Structure Checked All
              </el-checkbox>
            </el-form-item>
            <el-checkbox-group v-model="formThead">
              <el-checkbox v-for="key in structure_keys" :key="key" :label="`${key}`" :checked="true">{{ key }}</el-checkbox>
            </el-checkbox-group>
          </el-row>
          <el-row>
            <el-form-item label="Special">
              <el-checkbox v-model="check_special_keys_all" :checked="true" @change="handleSpecialCheckAllChange">
                Special Checked All
              </el-checkbox>
            </el-form-item>
            <el-checkbox-group v-model="formThead">
              <el-checkbox v-for="key in special_keys" :key="key" :label="`${key}`" :checked="true">{{ key }}</el-checkbox>
            </el-checkbox-group>
          </el-row>
          <el-row>
            <el-form-item label="Perfusion">
              <el-checkbox v-model="check_perfusion_keys_all" :checked="true" @change="handlePerfusionCheckAllChange">
                Perfusion Checked All
              </el-checkbox>
            </el-form-item>
            <el-checkbox-group v-model="formThead">
              <el-checkbox v-for="key in perfusion_keys" :key="key" :label="`${key}`" :checked="true">{{ key }}</el-checkbox>
            </el-checkbox-group>
          </el-row>
          <el-row>
            <el-form-item label="Functional">
              <el-checkbox v-model="check_functional_keys_all" :checked="true" @change="handleFunctionalCheckAllChange">
                Functional Checked All
              </el-checkbox>
            </el-form-item>
            <el-checkbox-group v-model="formThead">
              <el-checkbox v-for="key in functional_keys" :key="key" :label="`${key}`" :checked="true">{{ key }}</el-checkbox>
            </el-checkbox-group>
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
import Pagination from '@/components/Pagination/index.vue' // secondary package based on el-pagination
import request from '@/utils/myrequest'
export default {
  name: 'Study',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      formThead: [], // 顯示的欄位
      list: null,
      listKeys: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
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
    this.getList(true)
  },
  methods: {
    getList(updateFormHead = false, is_search = false) {
      this.listLoading = true
      const url = '/query/v2/list_study'
      if (is_search) {
        console.log('this.search_list')
        console.log(this.search_list)
        const filter_list = this.search_list.filter(e => {
          return (e.field.length > 0) & (e.op.length > 0) & (e.value.length > 0)
        })
        request({
          url: url,
          method: 'post',
          params: this.listQuery,
          data: { 'filter_': filter_list }
        }).then((response) => {
          this.list = response.data.data.items
          this.total = response.data.data.total
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

          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }).catch((error) => console.log('catch' + error))
        // 完成查詢
        this.listLoading = false
        // 更新要顯示的欄位
        if (updateFormHead) {
          this.formThead = []
          this.formThead.push(...this.general_keys)
          this.formThead.push(...this.structure_keys)
          this.formThead.push(...this.special_keys)
          this.formThead.push(...this.perfusion_keys)
          this.formThead.push(...this.functional_keys)
        }
      } else {
        const rep = request({
          url: url,
          method: 'get',
          params: this.listQuery
        }).then((response) => {
          console.log('測試 api')
          this.list = response.data.data.items
          this.total = response.data.data.total
          this.listKeys = response.data.key
          this.general_keys = response.data.group_key.general_keys
          this.structure_keys = response.data.group_key.structure_keys
          this.special_keys = response.data.group_key.special_keys
          this.perfusion_keys = response.data.group_key.perfusion_keys
          this.functional_keys = response.data.group_key.functional_keys
          this.search_key_list = []
          this.search_key_list.push(...this.general_keys, 'series_description')
          this.op_list = response.data.op_list
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }).catch((error) => console.log('catch' + error))
        // 完成查詢
        this.listLoading = false
        // 更新要顯示的欄位
        if (updateFormHead) {
          this.formThead = []
          this.formThead.push(...this.general_keys)
          this.formThead.push(...this.structure_keys)
          this.formThead.push(...this.special_keys)
          this.formThead.push(...this.perfusion_keys)
          this.formThead.push(...this.functional_keys)
          console.log('this.check_general_keys_all', this.check_general_keys_all)
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
    }
  }
}

</script>
<style>

.el-textarea {
  width: 100%;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-right: 30px;

}

button.el-button.el-button--primary {
  margin-bottom: 10px;
  padding: 10px 20px 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  margin-left: 30px;
}

button.el-button.el-button--danger {
  margin-bottom: 10px;
  padding: 10px 20px 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  margin-left: 30px;
}

.el-table th{
  user-select: initial;
}
</style>
