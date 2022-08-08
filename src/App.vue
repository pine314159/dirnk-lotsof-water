<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import TipList from './components/TipList.vue'
import useTipList from './hooks/useTipList'
import { ask } from '@tauri-apps/api/dialog'
import { getCurrent } from '@tauri-apps/api/window'

const timeStep = 30 // 分
const { list, addItem, changeEnabled, deleteItem, save, getStoreList } = useTipList()
const newTime = ref<string>()
const isConfirm = ref(true)

const webviewWindow = getCurrent();

const showTip = async () => {
  try {
    console.log('store数据', list.value)
    const date = new Date()
    const time = date.getHours() + ':' + date.getMinutes()
    if (list.value.find(item => item.time === time)?.isEnabled && isConfirm.value) {
      isConfirm.value = false
      await webviewWindow.setFullscreen(true)
      await ask('记得喝水起来活动活动~~')
      isConfirm.value = true
      await webviewWindow.setFullscreen(false)
    }
  } catch (e) {
    await ElMessageBox.alert(JSON.stringify(e), { type: 'error' })
  }
}

getStoreList().then(showTip)

const timer = window.setInterval(showTip, 1000 * 60)

const onAddItemClick = () => {
  const time = unref(newTime)
  if (!time) return ElMessageBox.alert('input time')
  addItem(time)
}

const onDeleteItemClick = (id: number) => {
  ElMessageBox.confirm('delete item?', 'Warning', { type: 'warning' }).then(() => {
    deleteItem(id)
  })
}

onUnmounted(() => {
  window.clearInterval(timer)
})
</script>

<template>
  <div class="w-full h-full font-normal border-2 border-b-blue-300">
    <el-header>
      <h2 class="h-full shadow-lg flex justify-center items-center">Water drinking Schedule</h2>
    </el-header>
    <el-main class="py-4">
      <TipList :list="list" @switch-change="changeEnabled" @delete-item="onDeleteItemClick"/>
    </el-main>
    <el-footer class="flex items-center absolute bottom-4">
      <el-time-select
          class="mr-10"
          v-model="newTime"
          start="06:00"
          :step="`00:${timeStep}`"
          end="24:00"
          placeholder="Select time"
      />
      <!--      <el-button @click="addItem(newTime)">add time</el-button>-->
      <button class="btn-effect" @click="onAddItemClick">add time</button>
    </el-footer>
  </div>
</template>

<style>
button.btn-effect {
  -webkit-transition: all 0s ease-out;
  -moz-transition: all 0s ease-out;
  -o-transition: all 0s ease-out;
  -ms-transition: all 0s ease-out;
  transition: all 0s ease-out;
  height: 35px;
  display: block;
  font-family: Arial, "Helvetica", sans-serif;
  font-size: 14px;
  color: #fff;
  text-decoration: none;
  text-align: center;
  text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.4);
  padding: 4px 20px 0;
  margin: 10px auto;
  left: 30px;
  position: relative;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  border-left: solid 1px #269BD0;
  background: #46C1F6;

  -webkit-box-shadow: 0px 5px 0px 0px #269BD0;
  box-shadow: 0px 5px 0px 0px #269BD0;
}

button.btn-effect:active {
  top: 3px;
  -webkit-box-shadow: 0px 2px 0px 0px #269BD0;
  box-shadow: 0px 2px 0px 0px #269BD0;
}
</style>
