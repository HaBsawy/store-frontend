<template></template>

<script>
export default {
  created() {
    this.$axios
      .$get(
        `api/verify/${this.$route.params.token}?token=${localStorage.getItem(
          'token'
        )}`
      )
      .then((response) => {
        this.$store.commit('auth/setSnackbar', {
          show: true,
          color: '#7b7b22',
          text: response.msg,
        });
        this.$store.commit('auth/verify');
        this.$router.push('/');
      })
      .catch((response) => {
        this.$store.commit('auth/setSnackbar', {
          show: true,
          color: 'error',
          text: response.response.data.msg,
        });
        this.$router.push('/auth/verify');
      });
  },
};
</script>
