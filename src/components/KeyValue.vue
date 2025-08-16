<template>
  <div class="key-value-container">
    <div 
      v-for="(item, index) in keyValuePairs"  :key="item.id"  class="key-value-item" >
      <div class="key">{{ item.key }}</div>
      <div class="value-container">
        <input
          v-if="editingId === item.id"
          v-model="editingValue"
          @blur="saveEdit(item.id, index)"
          @keyup.enter="saveEdit(item.id, index)"
          @keyup.esc="cancelEdit"
          class="value-input"
          ref="inputRef"
          v-focus
        />
        <div 
          v-else 
          @click="startEdit(item.id, item.value)"
          class="value-display"
          :class="{ 'editable': true }"
        >
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { POLYMARKET_ARBITRAGE_URL } from '@/api/const'

interface Props {
  keyValuePairs: Array<{id: number, key: string; value: string | number }>
}

interface Emits {
  (e: 'update',id: number, value: string | number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const editingId = ref<number | null>(null)
const editingValue = ref<string>('')
const inputRef = ref<HTMLInputElement>()

const startEdit = (id: number, value: string | number) => {
  editingId.value = id
  editingValue.value = String(value)
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const saveEdit = async (id: number, index: number) => {    
  if (editingId.value === id) {
    emit('update', id, editingValue.value)
    try {
      const res = await fetch(`${POLYMARKET_ARBITRAGE_URL}/api/policy-param-update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: id,
            value: editingValue.value
          })
        }
      )
      const data = await res.json()
      props.keyValuePairs[index].value = editingValue.value
      console.log('data: ', data)
    } catch (error) {
      console.error(error)
      alert('Fail to set default configs')
    }
    editingId.value = null
    editingValue.value = ''
  }
}

const cancelEdit = () => {
  editingId.value = null
  editingValue.value = ''
}

// Custom directive for auto-focus
const vFocus = {
  mounted: (el: HTMLElement) => {
    if (el instanceof HTMLInputElement) {
      el.focus()
      el.select()
    }
  }
}
</script>

<style scoped>
.key-value-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.key-value-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  background-color: #fafbfc;
  transition: all 0.2s ease;
}

.key-value-item:hover {
  background-color: #f5f7fa;
  border-color: #d1d5db;
}

.key {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
  margin-right: 16px;
  font-size: 14px;
}

.value-container {
  flex: 1;
}

.value-display {
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: #1f2937;
}

.value-display.editable:hover {
  background-color: #e5e7eb;
}

.value-input {
  width: 100%;
  padding: 4px 8px;
  border: 2px solid #3b82f6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  background-color: white;
}

.value-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
