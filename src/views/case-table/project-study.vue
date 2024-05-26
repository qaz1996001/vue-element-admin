<template>
  <div class="app-container">
    <div>
      <el-form v-model="project_list">
        <el-row>
          <el-col :span="6">
            <el-form-item label="專案名稱：" ></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-select v-model="project_name"
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
  </div>
</template>
<script>
import waves from '@/directive/waves'
// import { fetchList } from '@/api/study'
import Pagination from '@/components/Pagination/index.vue' // secondary package based on el-pagination
import request from '@/utils/myrequest'
export default {
  name: 'ProjectStudy',
  components: { Pagination },
  directives: { waves },
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
        sort: '+project_name'
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
      project_list:[],
      project_name:''
    }
  },
  created() {
    // this.getList(true)
    this.getProjectList()
  },
  methods: {
    getProjectList(){
      request({
        url: '/project',
        method: 'get'
      }).then((response) => {
        this.project_list = response.data.data.items
        // console.log('getProjectList')
        // console.log(response)
        setTimeout(() => {
        }, 1.5 * 1000)
      })

    },
    getList(updateFormHead = false){
      request({
        url: '/project_study/get_data',
        method: 'post',
        params: this.listQuery,
        data: { 'filter_': ['asdasdasd','asdasdasd'] }
      }).then((response) => {
        console.log(response)
        // this.list = response.data.data.items
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
    selectProject(items){
      console.log('selectProject')
      console.log(items)
      this.project_list.forEach(e =>{
        if (items === e.project_uid){
          console.log(e)
        }
      })

    }
  }
}

</script>
<style>

.el-table th{
  user-select: initial;
}

div:nth-child(4) button{
  margin-left: 30px;
  padding: 10px 20px 10px 20px;
}
</style>

