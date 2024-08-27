<template>
  <el-select v-model="selectedKeys" :placeholder="placeholder"
             collapse-tags :max-collapse-tags="maxCollapseTags"
             @change="handleSelectChange"
             clearable multiple>
    <el-option :key="selectAllKey" :label="selectAllLabel" :value="selectAllKey" />
    <el-option v-for="key in keys" :key="key" :label="key" :value="key" />
  </el-select>
</template>

<script>
import th from "element-ui/src/locale/lang/th";

export default {
  name: 'CustomSelect',
  props: {
    keys: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    maxCollapseTags: {
      type: Number,
      default: 3,
    },
    formThead: {
      type: Array,
      default: () => [],
    },
    placeholder:{
      type: String,
      default: "placeholder",
    },
    selectAllLabel: {
      type: String,
      default: "Select All",
    },
  },
  data() {
    return {
      selectedKeys: this.value,
      selectAllKey: "all",

    };
  },
  watch: {
    selectedKeys(newValue) {
      this.$emit('input', newValue);
    },
  },
  methods: {
    handleSelectChange(val) {
      if (val.includes(this.selectAllKey)) {
        // If "Select All" is chosen, select all keys
        this.selectedKeys = this.keys.filter(key => key!=this.selectAllKey);
        this.selectedKeys.forEach(key => this.addKey(key));
      } else if (this.selectedKeys.length === this.keys.length) {
        // If all individual keys are selected, add "Select All" key
        this.selectedKeys = this.keys.filter(key => key!=this.selectAllKey);
        this.selectedKeys.forEach(key => this.addKey(key));
      }

      const addedKeys = val.filter(key => !this.value.includes(key) & key!=this.selectAllKey);
      const removedKeys = this.value.filter(key => !val.includes(key));

      addedKeys.forEach(key => this.addKey(key));
      removedKeys.forEach(key => this.removeKey(key));

      this.$emit('change', val);
    },
    addKey(key) {
      if (!this.formThead.includes(key)) {
        this.formThead.push(key);
        this.$emit('add-key', key);
      }
    },
    removeKey(key) {
      const index = this.formThead.indexOf(key);
      if (index > -1) {
        this.formThead.splice(index, 1);
        this.$emit('remove-key', key);
      }
    },
    handleRemoveTag(val) {
      this.removeKey(val);
      this.$emit('remove-tag', val);
    },
  },
};
</script>


