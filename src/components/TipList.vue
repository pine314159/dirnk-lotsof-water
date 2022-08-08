<script lang="ts" setup>
import { TipItem } from './tip-list-type';

const props = defineProps<{
  list: TipItem[]
}>();

const emits = defineEmits<{
  (e: 'switchChange', id: number, isEnabled: boolean): void,
  (e: 'deleteItem', id: number): void
}>();

const onSwitchChange = (id: number, isEnabled: boolean) => {
  emits('switchChange',id, isEnabled)
}

const onDeleteItem = (id: number) => {
  emits('deleteItem', id)
}
</script>

<template>
  <el-card>
    <el-row class="flex is-justify-space-around items-center mb-1" v-for="item in props.list" :key="item.id">
      <div class="text-gray-500">{{ item.time }}</div>
      <div class="flex items-center">
        <el-switch
            :model-value="item.isEnabled"
            @change="onSwitchChange(item.id, $event)"
        />
        <button class="btn-effect scale-75" @click="onDeleteItem(item.id)">delete</button>
      </div>
    </el-row>
  </el-card>
</template>