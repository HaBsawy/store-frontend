export default function ({ store, redirect }) {
  // If the user is not admin
  if (!store.state.auth.admin) {
    return redirect('/auth/login');
  }
}
