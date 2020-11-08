<template>
  <section>
    <v-card class="mx-auto" color="#ff5722" max-width="350" outlined>
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            validate-on-blur
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            validate-on-blur
            :rules="passwordRules"
            label="Password"
            required
          ></v-text-field>
          <div class="forget-password">
            <nuxt-link to="forget-password">Forget Password</nuxt-link>
          </div>
          <v-btn
            :disabled="!valid"
            width="100%"
            :loading="loading"
            color="#00bcd4"
            @click="login"
          >Login</v-btn>
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
import { mapMutations } from 'vuex';
export default {
  middleware: 'guest',
  layout: 'auth',
  head() {
    return {
      title: 'Login',
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
    password: '',
    passwordRules: [
      (v) => !!v || 'Password is required',
      (v) =>
        (v && v.length >= 6) ||
        'Name must be greater or equal than 6 characters',
    ],
  }),

  methods: {
    async login() {
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        this.$axios
          .$post('api/login', {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            this.loading = false;
            if (response.status === 202) {
              this.$store.commit('auth/setSnackbar', {
                show: true,
                color: '#7b7b22',
                text: 'you logged in successfully',
              });
              this.$store.commit('auth/login', {
                token: response.payload.token,
                name: response.payload.user.name,
                email: response.payload.user.email,
                role: response.payload.user.role,
                verified: response.payload.user.email_verified_at,
              });
              this.$router.push('/');
            }
          })
          .catch((response) => {
            this.loading = false;
            this.$store.commit('auth/setSnackbar', {
              show: true,
              color: 'error',
              text: 'email or password incorrect',
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

.forget-password {
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
