<template>
  <section>
    <v-card class="mx-auto" color="#ff5722" max-width="350" outlined>
      <v-card-title>Forget Password</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
          <div class="login">
            <nuxt-link to="login">Login Now</nuxt-link>
          </div>
          <v-btn
            :disabled="!valid"
            :loading="loading"
            width="100%"
            color="#00bcd4"
            @click="forgetPassword"
          >Send</v-btn>
          <v-divider></v-divider>
          <div class="register-now">
            Don't have account ?
            <nuxt-link to="register">Register Now</nuxt-link>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </section>
</template>

<script>
export default {
  middleware: 'guest',
  layout: 'auth',
  head() {
    return {
      title: 'Forget Password',
    };
  },
  data: () => ({
    valid: true,
    loading: false,
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
  }),

  methods: {
    async forgetPassword() {
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        this.$axios
          .$post('api/forgetPassword', {
            email: this.email,
          })
          .then((response) => {
            this.loading = false;
            if (response.status === 202) {
              this.$store.commit('auth/setSnackbar', {
                show: true,
                color: '#7b7b22',
                text: response.msg,
              });
            }
          })
          .catch((response) => {
            this.loading = false;
            // console.log(response.response);
            this.$store.commit('auth/setSnackbar', {
              show: true,
              color: 'error',
              text: response.response.data.msg,
            });
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
section {
  width: 100%;
}

.register-now {
  margin-top: 20px;
  text-align: center;

  a {
    color: #b2ebf2;
    text-decoration: none;
  }
}

.login {
  float: right;

  a {
    color: #b2ebf2;
    text-decoration: none;
  }
}

button {
  margin: 30px 0 20px;
  display: block;
}
</style>
