
export const isAuth = () => {
  const localRefresh = localStorage.getItem('TOKEN');
  if (!localRefresh) {
    return false;
  }
  else {
    return true;
  }
};
