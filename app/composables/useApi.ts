export const useApi = () => {
  const config = useRuntimeConfig();
  const token = useCookie("admin_token");

  const apiCall = async (endpoint: string, options: any = {}) => {
    try {
      const headers: any = {
        ...options.headers,
      };
       if (!(options.body instanceof FormData)) {
         headers["Content-Type"] = "application/json";
       }
      if (token.value && !options.skipAuth) {
        headers["Authorization"] = `Bearer ${token.value}`;
      }

      const response = await $fetch(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers,
      });

      return { data: response, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.data?.message || error.message || "Đã xảy ra lỗi",
      };
    }
  };

  // Auth
  const login = async (email: string, password: string) => {
    return await apiCall("/auth/login", {
      method: "POST",
      body: { email, password },
      skipAuth: true,
    });
  };

  // Products
  const getProducts = async () => {
    return await apiCall("/products", { method: "GET", skipAuth: true });
  };

  const createProduct = async (formData: FormData) => {
    return await apiCall("/admin/products", {
      method: "POST",
      body: formData,
      headers: {},
    });
  };

  const updateProduct = async (id: number, formData: FormData) => {
    return await apiCall(`/admin/products/${id}`, {
      method: "PUT",
      body: formData,
      headers: {},
    });
  };

  const deleteProduct = async (id: number) => {
    return await apiCall(`/admin/products/${id}`, { method: "DELETE" });
  };

  // Categories
  const getCategories = async () => {
    return await apiCall("/categories", { method: "GET", skipAuth: true });
  };

  const createCategory = async (data: any) => {
    return await apiCall("/admin/categories", {
      method: "POST",
      body: data,
    });
  };

  const updateCategory = async (id: number, data: any) => {
    return await apiCall(`/admin/categories/${id}`, {
      method: "PUT",
      body: data,
    });
  };

  const deleteCategory = async (id: number) => {
    return await apiCall(`/admin/categories/${id}`, { method: "DELETE" });
  };

  // Orders
  const getOrders = async () => {
    return await apiCall("/admin/orders", { method: "GET" });
  };

  const updateOrderStatus = async (id: number, status: string) => {
    return await apiCall(`/admin/orders/${id}/status?status=${status}`, {
      method: "PUT",
    });
  };

  // Users
  const getUsers = async () => {
    return await apiCall("/admin/users", { method: "GET" });
  };

  return {
    login,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getOrders,
    updateOrderStatus,
    getUsers,
  };
};
