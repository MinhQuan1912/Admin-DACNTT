export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("admin_token");
  const adminRole = useCookie("admin_role");

  // Nếu không có token và không phải trang login
  if (!token.value && to.path !== "/login") {
    return navigateTo("/login");
  }

  // Nếu có token nhưng không phải ADMIN
  if (token.value && adminRole.value !== "ADMIN" && to.path !== "/login") {
    return navigateTo("/login");
  }

  // Nếu đã login và vào trang login
  if (token.value && to.path === "/login") {
    return navigateTo("/");
  }
});
