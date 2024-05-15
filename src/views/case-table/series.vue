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

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <!-- 特定欄位可能寬度需要調整 -->
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
// import { fetchList } from '@/api/study'
import request from '@/utils/myrequest'
import Pagination from '@/components/Pagination/index.vue'
export default {
  name: 'Series',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      formThead: ['patient_id'], // 顯示的欄位
      list: null,
      listKeys: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        gender: undefined,
        sort: '+id'
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
    getList(updateFormHead = false) {
      this.listLoading = true
      const rep = request({
        url: '/query/list_series',
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
    }
  }
}

</script>
<style scoped></style>
