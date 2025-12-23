<template>
   <div>
      <!-- Actions -->
      <div class="mb-6 flex justify-between items-center">
         <div class="flex space-x-4">
            <input v-model="searchQuery" type="text" placeholder="Tìm kiếm sản phẩm..." class="input-field w-64" />
         </div>
         <button @click="openModal()" class="btn-primary">
            + Thêm sản phẩm
         </button>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         <div v-for="product in filteredProducts" :key="product.id" class="card hover:shadow-xl transition">
            <div class="relative mb-4">
               <img :src="getImageUrl(product.imageUrl)" :alt="product.name"
                  class="w-full h-48 object-cover rounded-lg" />
               <span v-if="product.stock > 0"
                  class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Còn {{ product.stock }}
               </span>
               <span v-else class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Hết hàng
               </span>
            </div>

            <h3 class="font-bold text-lg mb-2 truncate">{{ product.name }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ product.category?.name }}</p>

            <div class="flex items-center space-x-2 mb-4">
               <span class="text-gray-400 line-through text-sm">
                  {{ formatPrice(product.oldPrice) }}
               </span>
               <span class="text-blue-600 font-bold text-lg">
                  {{ formatPrice(product.newPrice) }}
               </span>
            </div>

            <div class="flex space-x-2">
               <button @click="openModal(product)"
                  class="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition text-sm">
                  Sửa
               </button>
               <button @click="handleDelete(product.id)"
                  class="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm">
                  Xóa
               </button>
            </div>
         </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         @click.self="closeModal">
         <div class="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-6">
               {{ editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}
            </h2>

            <form @submit.prevent="handleSubmit" class="space-y-4">
               <div>
                  <label class="block text-sm font-medium mb-2">Tên sản phẩm</label>
                  <input v-model="form.name" type="text" required class="input-field" />
               </div>

               <div>
                  <label class="block text-sm font-medium mb-2">Mô tả</label>
                  <textarea v-model="form.description" rows="3" class="input-field"></textarea>
               </div>

               <div class="grid grid-cols-2 gap-4">
                  <div>
                     <label class="block text-sm font-medium mb-2">Giá cũ</label>
                     <input v-model="form.oldPrice" type="number" required class="input-field" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-2">Giá mới</label>
                     <input v-model="form.newPrice" type="number" required class="input-field" />
                  </div>
               </div>

               <div class="grid grid-cols-2 gap-4">
                  <div>
                     <label class="block text-sm font-medium mb-2">Số lượng</label>
                     <input v-model="form.stock" type="number" required class="input-field" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-2">Danh mục</label>
                     <select v-model="form.categoryId" required class="input-field">
                        <option value="">Chọn danh mục</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                           {{ cat.name }}
                        </option>
                     </select>
                  </div>
               </div>

               <div>
                  <label class="block text-sm font-medium mb-2">Ảnh sản phẩm</label>
                  <input type="file" accept="image/*" @change="handleFileChange" class="input-field" />
                  <p class="text-xs text-gray-500 mt-1">
                     Chọn ảnh mới hoặc để trống để giữ ảnh cũ
                  </p>
               </div>

               <div v-if="imagePreview" class="mt-2">
                  <img :src="imagePreview" alt="Preview" class="w-32 h-32 object-cover rounded" />
               </div>

               <div class="flex space-x-4 pt-4">
                  <button type="submit" class="btn-primary flex-1">
                     {{ editingProduct ? 'Cập nhật' : 'Thêm' }}
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

const { getProducts, getCategories, createProduct, updateProduct, deleteProduct } = useApi()
const config = useRuntimeConfig()

const products = ref<any[]>([])
const categories = ref<any[]>([])
const showModal = ref(false)
const editingProduct = ref<any>(null)
const searchQuery = ref('')
const selectedFile = ref<File | null>(null)
const imagePreview = ref('')

const form = reactive({
   name: '',
   description: '',
   oldPrice: 0,
   newPrice: 0,
   stock: 0,
   categoryId: ''
})

const filteredProducts = computed(() => {
   if (!searchQuery.value) return products.value
   return products.value.filter(p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
   )
})

const loadData = async () => {
   const [productsRes, categoriesRes] = await Promise.all([
      getProducts(),
      getCategories()
   ])

   if (productsRes.data) products.value = productsRes.data as any[]
   if (categoriesRes.data) categories.value = categoriesRes.data as any[]
}

const openModal = (product?: any) => {
   showModal.value = true
   editingProduct.value = product || null

   if (product) {
      form.name = product.name
      form.description = product.description
      form.oldPrice = product.oldPrice
      form.newPrice = product.newPrice
      form.stock = product.stock
      form.categoryId = product.category.id
      imagePreview.value = getImageUrl(product.imageUrl)
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
   form.oldPrice = 0
   form.newPrice = 0
   form.stock = 0
   form.categoryId = ''
   selectedFile.value = null
   imagePreview.value = ''
}

const handleFileChange = (event: any) => {
   const file = event.target.files[0]
   if (file) {
      selectedFile.value = file
      imagePreview.value = URL.createObjectURL(file)
   }
}

const handleSubmit = async () => {
   const formData = new FormData()
   formData.append('name', form.name)
   formData.append('description', form.description)
   formData.append('oldPrice', form.oldPrice.toString())
   formData.append('newPrice', form.newPrice.toString())
   formData.append('stock', form.stock.toString())
   formData.append('categoryId', form.categoryId)

   if (selectedFile.value) {
      formData.append('image', selectedFile.value)
   }

   let result
   if (editingProduct.value) {
      result = await updateProduct(editingProduct.value.id, formData)
   } else {
      result = await createProduct(formData)
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
   if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      const result = await deleteProduct(id)
      if (!result.error) {
         alert('Đã xóa!')
         loadData()
      } else {
         alert('Lỗi: ' + result.error)
      }
   }
}

const getImageUrl = (url: string) => {
   if (!url) return 'https://via.placeholder.com/300'
   if (url.startsWith('http')) return url
   return `${config.public.apiBase.replace('/api', '')}${url}`
}

const formatPrice = (price: number) => {
   return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
   }).format(price)
}

onMounted(() => {
   loadData()
})
</script>