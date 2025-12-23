<template>
   <div>
      <div class="space-y-4">
         <div v-for="order in orders" :key="order.id" class="card hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-4">
               <div>
                  <h3 class="text-lg font-bold">Đơn hàng #{{ order.id }}</h3>
                  <p class="text-sm text-gray-600">{{ order.userName }} - {{ order.userEmail }}</p>
                  <p class="text-sm text-gray-600 mt-1">
                     {{ formatDate(order.createdAt) }}
                  </p>
               </div>
               <div class="text-right">
                  <p class="text-2xl font-bold text-blue-600">
                     {{ formatPrice(order.totalAmount) }}
                  </p>
                  <select v-model="order.status" @change="updateStatus(order.id, order.status)"
                     :class="`mt-2 px-3 py-1 rounded text-sm font-semibold ${getStatusColor(order.status)}`">
                     <option value="PENDING">Chờ xử lý</option>
                     <option value="PROCESSING">Đang xử lý</option>
                     <option value="COMPLETED">Hoàn thành</option>
                     <option value="CANCELLED">Đã hủy</option>
                  </select>
               </div>
            </div>

            <div class="border-t pt-4">
               <h4 class="font-semibold mb-2">Thông tin giao hàng:</h4>
               <p class="text-sm text-gray-600">📍 {{ order.shippingAddress }}</p>
               <p class="text-sm text-gray-600">📞 {{ order.phoneNumber }}</p>
            </div>

            <div class="border-t pt-4 mt-4">
               <h4 class="font-semibold mb-3">Sản phẩm:</h4>
               <div class="space-y-2">
                  <div v-for="item in order.items" :key="item.id"
                     class="flex justify-between items-center p-3 bg-gray-50 rounded">
                     <div class="flex items-center space-x-3">
                        <img :src="getImageUrl(item.productImage)" :alt="item.productName"
                           class="w-16 h-16 object-cover rounded" />
                        <div>
                           <p class="font-semibold">{{ item.productName }}</p>
                           <p class="text-sm text-gray-600">
                              {{ formatPrice(item.price) }} x {{ item.quantity }}
                           </p>
                        </div>
                     </div>
                     <p class="font-bold">
                        {{ formatPrice(item.totalPrice) }}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         <div v-if="orders.length === 0" class="card text-center py-12">
            <p class="text-gray-500">Chưa có đơn hàng nào</p>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: 'auth'
})

const { getOrders, updateOrderStatus } = useApi()
const config = useRuntimeConfig()

const orders = ref<any[]>([])

const loadData = async () => {
   const result = await getOrders()
   if (result.data) orders.value = result.data as any[]
}

const updateStatus = async (orderId: number, status: string) => {
   const result = await updateOrderStatus(orderId, status)
   if (!result.error) {
      alert('Đã cập nhật trạng thái!')
   } else {
      alert('Lỗi: ' + result.error)
   }
}

const getStatusColor = (status: string) => {
   const colors: any = {
      'PENDING': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      'PROCESSING': 'bg-blue-100 text-blue-800 border border-blue-300',
      'COMPLETED': 'bg-green-100 text-green-800 border border-green-300',
      'CANCELLED': 'bg-red-100 text-red-800 border border-red-300'
   }
   return colors[status] || 'bg-gray-100 text-gray-800'
}

const formatPrice = (price: number) => {
   return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
   }).format(price)
}

const formatDate = (date: string) => {
   return new Date(date).toLocaleString('vi-VN')
}

const getImageUrl = (url: string) => {
   if (!url) return 'https://via.placeholder.com/100'
   if (url.startsWith('http')) return url
   return `${config.public.apiBase.replace('/api', '')}${url}`
}

onMounted(() => {
   loadData()
})
</script>