<template>
   <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
         <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Admin Panel</h1>
            <p class="text-gray-600 mt-2">Đăng nhập để quản lý hệ thống</p>
         </div>

         <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
               <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
               </label>
               <input v-model="form.email" type="email" required class="input-field" placeholder="" />
            </div>

            <div>
               <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
               </label>
               <input v-model="form.password" type="password" required class="input-field" placeholder="" />
            </div>

            <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
               {{ error }}
            </div>

            <button type="submit" :disabled="loading"
               class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
               <span v-if="loading">Đang đăng nhập...</span>
               <span v-else>Đăng nhập</span>
            </button>
         </form>

         <div class="mt-6 text-center text-sm text-gray-600">
            <p>Demo: admin@gmail.com / 123456</p>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   layout: false
})

const router = useRouter()
const { login } = useApi()

const form = reactive({
   email: '',
   password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
   loading.value = true
   error.value = ''

   const { data, error: apiError } = await login(form.email, form.password)

   if (apiError) {
      error.value = apiError
      loading.value = false
      return
   }

   if (data && data.role === 'ADMIN') {
      const token = useCookie('admin_token')
      const role = useCookie('admin_role')
      const name = useCookie('admin_name')

      token.value = data.token
      role.value = data.role
      name.value = data.name

      router.push('/')
   } else {
      error.value = 'Bạn không có quyền truy cập Admin'
   }

   loading.value = false
}
</script>