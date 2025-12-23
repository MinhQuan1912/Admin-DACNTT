<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-lg">
      <div class="p-6">
        <h1 class="text-2xl font-bold">Admin Panel</h1>
      </div>
      
      <nav class="mt-6">
        <NuxtLink 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center px-6 py-3 hover:bg-gray-800 transition"
          active-class="bg-gray-800 border-l-4 border-blue-500"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          <span>{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <div class="absolute bottom-0 w-full p-6">
        <button 
          @click="handleLogout"
          class="flex items-center w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          <ArrowLeftOnRectangleIcon class="w-5 h-5 mr-2" />
          Đăng xuất
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="ml-64 p-8">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold text-gray-800">{{ pageTitle }}</h2>
            <p class="text-gray-600 mt-1">{{ pageDescription }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">Xin chào, <strong>{{ adminName }}</strong></span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  ShoppingBagIcon,
  FolderIcon,
  ShoppingCartIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

const adminName = useCookie('admin_name')

const menuItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Sản phẩm', path: '/products', icon: ShoppingBagIcon },
  { name: 'Danh mục', path: '/categories', icon: FolderIcon },
  { name: 'Đơn hàng', path: '/orders', icon: ShoppingCartIcon },
  { name: 'Người dùng', path: '/users', icon: UsersIcon }
]

const pageTitle = computed(() => {
  const item = menuItems.find(m => m.path === route.path)
  return item?.name || 'Dashboard'
})

const pageDescription = computed(() => {
  const descriptions: any = {
    '/': 'Tổng quan hệ thống',
    '/products': 'Quản lý sản phẩm',
    '/categories': 'Quản lý danh mục',
    '/orders': 'Quản lý đơn hàng',
    '/users': 'Quản lý người dùng'
  }
  return descriptions[route.path] || ''
})

const handleLogout = () => {
  const token = useCookie('admin_token')
  const role = useCookie('admin_role')
  const name = useCookie('admin_name')
  
  token.value = null
  role.value = null
  name.value = null
  
  router.push('/login')
}
</script>