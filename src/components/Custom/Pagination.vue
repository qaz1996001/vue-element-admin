<template>
  <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="page"
      :limit.sync="size"
      @pagination="getList"
    />
<!--  <el-pagination-->
<!--    :current-page="currentPage"-->
<!--    :page-size="pageSize"-->
<!--    :total="total"-->
<!--    layout="total, prev, pager, next"-->
<!--    @current-change="handleCurrentChange"-->
<!--  />-->
</template>

<script>
import Pagination from '@/components/Pagination/index.vue'
export default {
  components: {Pagination},
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50, 100, 500, 1000]
      }
    },
  },
  methods: {
    handleCurrentChange(newPage) {
      this.$emit('update:currentPage', newPage)
      this.$emit('pagination', newPage)
    },
  },
}
</script>
