<template>
  <el-table v-loading="loading" :data="data" border fit highlight-current-row>
    <el-table-column type="index" :index="indexMethod" />
    <el-table-column type="selection" align="center" />
    <el-table-column v-for="key in columns" :key="key" :label="key" align="center">
      <template #default="{row}">
        <span>{{ row[key] }}</span>
        <span v-for=" series_list in row['series_description']" >
          <span v-for=" (item, index) in series_list" >
            <span v-if="index ===key">
              {{ item }}
            </span>
          </span>
        </span>
        </template>
    </el-table-column>
<!--    <template v-for="key in columns" :key="key">-->
<!--      <el-table-column :label="key" align="center">-->
<!--        <template #default="{row}">-->
<!--          <span>{{ row[key] }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </template>-->
  </el-table>
</template>

<script>
import series from "@/views/case-table/series.vue";

export default {
  computed: {
    series() {
      return series
    }
  },
  props: {
    data: Array,
    columns: Array,
    loading: Boolean,
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
  },
}
</script>
