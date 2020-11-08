<template>
  <section>
    <div class="text-center">
      <h2>Please Verify your eamil</h2>
      <h3>the mail is sent to {{user.email}}</h3>
      <v-btn :loading="loading" @click="resend">Resend the mail</v-btn>
    </div>
  </section>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  middleware: 'auth',
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    resend() {
      this.loading = true;
      this.$axios
        .$post(`api/resendWelcomeMail?token=${this.user.token}`)
        .then((response) => {
          this.$store.commit('auth/setSnackbar', {
            show: true,
            color: '#7b7b22',
            text: response.msg,
          });
          this.loading = false;
        })
        .catch((response) => {
          this.$store.commit('auth/setSnackbar', {
            show: true,
            color: 'error',
            text: response.response.data.msg,
          });
          this.loading = false;
        });
    },
  },
};
</script>
