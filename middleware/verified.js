export default function ({ store, redirect }) {
  // If the user is not verified
  if (
    store.state.auth.user.verified == 'null' ||
    store.state.auth.user.verified == 'undefined'
  ) {
    return redirect('/auth/verify');
  }
}
