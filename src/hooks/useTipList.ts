import { TipItem } from '../components/tip-list-type'

import { Store } from 'tauri-plugin-store-api'

const storeKey = 'drink-config-list'
export default function useTipList () {
  const store = new Store('.settings.dat')
  const list = ref<TipItem[]>([])

  const getStoreList = async () => {
    const storeList = await store.get(storeKey)
    if (storeList) {
      list.value = storeList as TipItem[]
    }
  }

  const addItem = (time: string) => {
    list.value.push({
      id: list.value.length,
      time,
      isEnabled: true
    })
    sortByTime()
    save()
  }

  const deleteItem = (id: number) => {
    list.value = list.value.filter(item => item.id !== id)
    save()
  }

  const changeEnabled = (id: number, isEnabled: boolean) => {
    list.value.some(item => {
      if (item.id === id) {
        item.isEnabled = isEnabled
        return true
      }
    })
    save()
    // console.log(list.value)
  }

  const save = () => {
    store.set(storeKey, list.value)
    // console.log('数据', store.get(storeKey))
  }

  const sortByTime = () => {
    list.value.sort((v1: TipItem, v2: TipItem) => {
      const [h1, m1] = v1.time.split(':').map(item => Number(item))
      const [h2, m2] = v2.time.split(':').map(item => Number(item))
      if (h1 !== h2) {
        return h1 - h2
      }
      return m1 -m2
    })
  }

  return {
    list,
    getStoreList,
    addItem,
    deleteItem,
    changeEnabled,
    save
  }
}
