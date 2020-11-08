<template>
  <section>
    <v-card class="mx-auto" color="#ff5722" max-width="350" outlined>
      <v-card-title>Register</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="name" :rules="nameRules" validate-on-blur label="Name" required></v-text-field>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            validate-on-blur
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            v-model="mobile"
            :rules="mobileRules"
            validate-on-blur
            label="Mobile"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            :rules="passwordRules"
            validate-on-blur
            label="Password"
            required
          ></v-text-field>
          <v-text-field
            v-model="password_confirmation"
            type="password"
            :rules="passwordConfirmationRules"
            validate-on-blur
            label="Confirm Password"
            required
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            width="100%"
            :loading="loading"
            color="#00bcd4"
            @click="register"
          >Register</v-btn>
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
    name: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) =>
        (v && v.length >= 6) ||
        'Name must be greater than or equal 6 characters',
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    mobile: '',
    mobileRules: [
      (v) => !!v || 'Mobile is required',
      (v) => /^\d*\.?\d*$/.test(v) || 'Mobile must be numeric',
      (v) => (v && v.length == 11) || 'Mobile must be 11 digits',
    ],
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
    async register() {
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        this.$axios
          .$post('api/register', {
            name: this.name,
            email: this.email,
            mobile: this.mobile,
            password: this.password,
            password_confirmation: this.password_confirmation,
          })
          .then((response) => {
            this.loading = false;
            if (response.status === 201) {
              this.$store.commit('auth/setSnackbar', {
                show: true,
                color: '#7b7b22',
                text: 'your registeration is done successfully',
              });
              this.$store.commit('auth/login', {
                token: response.payload.token,
                name: response.payload.user.name,
                email: response.payload.user.email,
                role: response.payload.user.role,
                verified: response.payload.user.email_verified_at,
              });
              this.$router.push('/auth/verify');
            }
          })
          .catch((response) => {
            this.loading = false;
            let error = response.response.data.errors;
            this.$store.commit('auth/setSnackbar', {
              show: true,
              color: 'error',
              text: error[Object.keys(error)[0]][0],
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

button {
  margin: 30px 0 20px;
  display: block;
}
</style>
