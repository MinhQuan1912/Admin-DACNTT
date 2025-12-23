<template>
   <div>
      <div class="mb-6 flex justify-end">
         <button @click="openModal()" class="btn-primary">
            + Thêm danh mục
         </button>
      </div>

      <div class="card">
         <table class="w-full">
            <thead>
               <tr class="border-b">
                  <th class="text-left py-3 px-4">ID</th>
                  <th class="text-left py-3 px-4">Tên danh mục</th>
                  <th class="text-left py-3 px-4">Mô tả</th>
                  <th class="text-right py-3 px-4">Thao tác</th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="category in categories" :key="category.id" class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4">{{ category.id }}</td>
                  <td class="py-3 px-4 font-semibold">{{ category.name }}</td>
                  <td class="py-3 px-4 text-gray-600">{{ category.description }}</td>
                  <td class="py-3 px-4 text-right space-x-2">
                     <button @click="openModal(category)" class="text-blue-600 hover:text-blue-800">
                        Sửa
                     </button>
                     <button @click="handleDelete(category.id)" class="text-red-600 hover:text-red-800">
                        Xóa
                     </button>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         @click.self="closeModal">
         <div class="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 class="text-2xl font-bold mb-6">
               {{ editingCategory ? 'Sửa danh mục' : 'Thêm danh mục' }}
            </h2>

            <form @submit.prevent="handleSubmit" class="space-y-4">
               <div>
                  <label class="block text-sm font-medium mb-2">Tên danh mục</label>
                  <input v-model="form.name" type="text" required class="input-field" />
               </div>

               <div>
                  <label class="block text-sm font-medium mb-2">Mô tả</label>
                  <textarea v-model="form.description" rows="3" class="input-field"></textarea>
               </div>

               <div class="flex space-x-4 pt-4">
                  <button type="submit" class="btn-primary flex-1">
                     {{ editingCategory ? 'Cập nhật' : 'Thêm' }}
                  </button>
                  <button type="button" @click="closeModal" class="btn-secondary flex-1">
                     Hủy
                  </button>
               </div>
            </form>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: 'auth'
})

const { getCategories, createCategory, updateCategory, deleteCategory } = useApi()

const categories = ref<any[]>([])
const showModal = ref(false)
const editingCategory = ref<any>(null)

const form = reactive({
   name: '',
   description: ''
})

const loadData = async () => {
   const result = await getCategories()
   if (result.data) categories.value = result.data as any[]
}

const openModal = (category?: any) => {
   showModal.value = true
   editingCategory.value = category || null

   if (category) {
      form.name = category.name
      form.description = category.description
   } else {
      resetForm()
   }
}

const closeModal = () => {
   showModal.value = false
   resetForm()
}

const resetForm = () => {
   form.name = ''
   form.description = ''
}

const handleSubmit = async () => {
   let result
   if (editingCategory.value) {
      result = await updateCategory(editingCategory.value.id, form)
   } else {
      result = await createCategory(form)
   }

   if (!result.error) {
      alert('Thành công!')
      closeModal()
      loadData()
   } else {
      alert('Lỗi: ' + result.error)
   }
}

const handleDelete = async (id: number) => {
   if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
      const result = await deleteCategory(id)
      if (!result.error) {
         alert('Đã xóa!')
         loadData()
      } else {
         alert('Lỗi: ' + result.error)
      }
   }
}

onMounted(() => {
   loadData()
})
</script>