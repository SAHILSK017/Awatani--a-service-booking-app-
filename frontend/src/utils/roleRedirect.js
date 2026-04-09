export const getRedirectPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'worker':
      return '/worker/dashboard';
    case 'user':
      return '/user/home';
    default:
      return '/login';
  }
};