<template></template>

<script>
import { mapMutations } from 'vuex';

export default {
  middleware: 'auth',
  created() {
    this.$store.commit('auth/logout');
    this.$store.commit('auth/setSnackbar', {
      show: true,
      color: '#7b7b22',
      text: 'You logged out successfully',
    });
    this.$router.push('/auth/login');
  },
};
</script>
