<template>
   <div>
      <div class="card">
         <table class="w-full">
            <thead>
               <tr class="border-b">
                  <th class="text-left py-3 px-4">ID</th>
                  <th class="text-left py-3 px-4">Tên</th>
                  <th class="text-left py-3 px-4">Email</th>
                  <th class="text-left py-3 px-4">Vai trò</th>
                  <th class="text-left py-3 px-4">Ngày đăng ký</th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="user in users" :key="user.id" class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4">{{ user.id }}</td>
                  <td class="py-3 px-4 font-semibold">{{ user.name }}</td>
                  <td class="py-3 px-4">{{ user.email }}</td>
                  <td class="py-3 px-4">
                     <span :class="`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`">
                        {{ user.role }}
                     </span>
                  </td>
                  <td class="py-3 px-4 text-gray-600">
                     {{ formatDate(user.createdAt) }}
                  </td>
               </tr>
            </tbody>
         </table>

         <div v-if="users.length === 0" class="text-center py-12">
            <p class="text-gray-500">Chưa có người dùng nào</p>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: 'auth'
})

const { getUsers } = useApi()

const users = ref<any[]>([])

const loadData = async () => {
   const result = await getUsers()
   if (result.data) users.value = result.data as any[]
}

const getRoleBadge = (role: string) => {
   return role === 'ADMIN'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800'
}

const formatDate = (date: string) => {
   return new Date(date).toLocaleDateString('vi-VN')
}

onMounted(() => {
   loadData()
})
</script>