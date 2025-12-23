<template>
   <div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <!-- Stat Card -->
         <div v-for="stat in stats" :key="stat.title" class="card hover:shadow-lg transition">
            <div class="flex items-center justify-between">
               <div>
                  <p class="text-gray-600 text-sm">{{ stat.title }}</p>
                  <h3 class="text-3xl font-bold text-gray-800 mt-2">{{ stat.value }}</h3>
               </div>
               <div :class="`p-4 rounded-full ${stat.bgColor}`">
                  <component :is="stat.icon" :class="`w-8 h-8 ${stat.iconColor}`" />
               </div>
            </div>
         </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <!-- Recent Orders -->
         <div class="card">
            <h3 class="text-xl font-bold mb-4">Đơn hàng gần đây</h3>
            <div class="space-y-3">
               <div v-for="order in recentOrders" :key="order.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                     <p class="font-semibold">Đơn hàng #{{ order.id }}</p>
                     <p class="text-sm text-gray-600">{{ order.userName }}</p>
                  </div>
                  <div class="text-right">
                     <p class="font-bold text-blue-600">
                        {{ formatPrice(order.totalAmount) }}
                     </p>
                     <span :class="`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`">
                        {{ getStatusText(order.status) }}
                     </span>
                  </div>
               </div>
            </div>
         </div>

         <!-- Quick Actions -->
         <div class="card">
            <h3 class="text-xl font-bold mb-4">Thao tác nhanh</h3>
            <div class="space-y-3">
               <NuxtLink to="/products"
                  class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <ShoppingBagIcon class="max-w-6 max-h-6 text-blue-600 mr-3" />
                  <div>
                     <p class="font-semibold text-blue-900">Quản lý sản phẩm</p>
                     <p class="text-sm text-blue-700">Thêm, sửa, xóa sản phẩm</p>
                  </div>
               </NuxtLink>

               <NuxtLink to="/categories"
                  class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
                  <FolderIcon class="max-w-6 h-6 text-green-600 mr-3" />
                  <div>
                     <p class="font-semibold text-green-900">Quản lý danh mục</p>
                     <p class="text-sm text-green-700">Thêm danh mục mới</p>
                  </div>
               </NuxtLink>

               <NuxtLink to="/orders"
                  class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                  <ShoppingCartIcon class="max-w-6 h-6 text-purple-600 mr-3" />
                  <div>
                     <p class="font-semibold text-purple-900">Xem đơn hàng</p>
                     <p class="text-sm text-purple-700">Quản lý và cập nhật đơn hàng</p>
                  </div>
               </NuxtLink>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import {
   ShoppingBagIcon,
   FolderIcon,
   ShoppingCartIcon,
   UsersIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
   middleware: 'auth'
})

const { getProducts, getCategories, getOrders, getUsers } = useApi()

const products = ref<any[]>([])
const categories = ref<any[]>([])
const orders = ref<any[]>([])
const users = ref<any[]>([])

const stats = computed(() => [
   {
      title: 'Tổng sản phẩm',
      value: products.value.length,
      icon: ShoppingBagIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
   },
   {
      title: 'Danh mục',
      value: categories.value.length,
      icon: FolderIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
   },
   {
      title: 'Đơn hàng',
      value: orders.value.length,
      icon: ShoppingCartIcon,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
   },
   {
      title: 'Người dùng',
      value: users.value.length,
      icon: UsersIcon,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
   }
])

const recentOrders = computed(() => orders.value.slice(0, 5))

const formatPrice = (price: number) => {
   return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
   }).format(price)
}

const getStatusColor = (status: string) => {
   const colors: any = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
   }
   return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
   const texts: any = {
      'PENDING': 'Chờ xử lý',
      'PROCESSING': 'Đang xử lý',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
   }
   return texts[status] || status
}

onMounted(async () => {
   const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
      getProducts(),
      getCategories(),
      getOrders(),
      getUsers()
   ])

   if (productsRes.data) products.value = productsRes.data as any[]
   if (categoriesRes.data) categories.value = categoriesRes.data as any[]
   if (ordersRes.data) orders.value = ordersRes.data as any[]
   if (usersRes.data) users.value = usersRes.data as any[]
})
</script>