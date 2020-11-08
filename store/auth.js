export const state = () => ({
  snackbar: {},
  user: {
    token: localStorage.getItem('token'),
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role'),
    verified: localStorage.getItem('verified'),
  },
});

export const mutations = {
  login(state, data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);
    localStorage.setItem('verified', data.verified);
    state.user = data;
  },
  logout(state) {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('verified');
    state.user = {};
  },
  verify(state) {
    localStorage.setItem('verified', 'verified');
    state.user.verified = 'verified';
  },
  setSnackbar(state, data) {
    state.snackbar = data;
  },
};
