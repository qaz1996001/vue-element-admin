<template>
  <el-form ref="search_list" v-model="searchList">
    <el-form-item v-for="(item, index) in searchList" :key="index">
      <el-row>
        <el-col :span="6">
          <el-select v-model="item.field" placeholder="請選擇欄位">
            <el-option v-for="key in searchKeyList" :key="key" :label="key" :value="key" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="item.op" placeholder="計算符號">
            <el-option v-for="op in opList" :key="op" :label="op" :value="op" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input v-model="item.value" placeholder="請輸入" />
        </el-col>
        <el-col :span="6">
          <el-button v-if="index !== 0" type="danger" @click="delSearchItem(index)"> del </el-button>
          <el-button v-if="index === 0" type="primary" @click="addSearchItem">add</el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-row>
      <el-col :span="16">
        <el-button type="primary" @click="onSearch">search</el-button>
        <el-button type="primary" @click="downloadExcel">download excel</el-button>
        <el-button type="success" @click="addToProject">add to project</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    searchKeyList: Array,
    opList: Array,
    searchList: Array,
  },
  methods: {
    addSearchItem() {
      this.$emit('addSearchItem')
    },
    delSearchItem(index) {
      this.$emit('delSearchItem', index)
    },
    onSearch() {
      this.$emit('onSearch')
    },
    downloadExcel() {
      this.$emit('downloadExcel')
    },
    addToProject() {
      this.$emit('addToProject')
    },
  },
}
</script>
