<template>
  <section>
    <v-card class="mx-auto" color="#ff5722" width="350" outlined>
      <v-card-title>Reset Password</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="password"
            type="password"
            :rules="passwordRules"
            label="Password"
            required
          ></v-text-field>
          <v-text-field
            v-model="password_confirmation"
            type="password"
            :rules="passwordConfirmationRules"
            label="Confirm Password"
            required
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            width="100%"
            :loading="loading"
            color="#00bcd4"
            @click="reset"
          >Reset</v-btn>
          <v-divider></v-divider>
          <div class="register-now">
            Already have an account ?
            <nuxt-link to="login">Login Now</nuxt-link>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </section>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  middleware: 'guest',
  layout: 'auth',
  head() {
    return {
      title: 'Register',
    };
  },
  data: () => ({
    valid: true,
    loading: false,
    password: '',
    passwordRules: [
      (v) => !!v || 'Password is required',
      (v) =>
        (v && v.length >= 6) || 'Password must be greater than 5 characters',
    ],
    password_confirmation: '',
    passwordConfirmationRules: [
      (v) => !!v || 'Password Confirmation is required',
      (v) =>
        (v && v.length >= 6) ||
        'Password Confirmation must be greater than 5 characters',
    ],
  }),
  methods: {
    reset() {
      this.loading = true;
      this.$axios
        .$post(
          `api/resetPassword/${this.$route.params.token}?token=${this.$route.query.token}`,
          {
            password: this.password,
            password_confirmation: this.password_confirmation,
          }
        )
        .then((response) => {
          this.loading = false;
          this.$store.commit('auth/setSnackbar', {
            show: true,
            color: '#7b7b22',
            text: response.msg,
          });
          this.$router.push('/');
        })
        .catch((response) => {
          this.loading = false;
          if (response.response.data.status === 404) {
            this.$store.commit('auth/setSnackbar', {
              show: true,
              color: 'error',
              text: response.response.data.msg,
            });
            this.$router.push('/auth/verify');
          } else if (response.response.data.status === 422) {
            let error = response.response.data.errors;
            this.$store.commit('auth/setSnackbar', {
              show: true,
              color: 'error',
              text: error[Object.keys(error)[0]][0],
            });
          }
        });
    },
  },
};
</script>
