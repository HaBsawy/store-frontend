<template>
  <section>
    <v-card class="mx-auto" color="#ff5722" max-width="350" outlined>
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
          <v-btn :disabled="!valid" width="100%" color="#00bcd4" @click="validate">Reset Password</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </section>
</template>

<script>
export default {
  layout: 'auth',
  data: () => ({
    valid: true,
    password: '',
    passwordRules: [
      (v) => !!v || 'Password is required',
      (v) => (v && v.length >= 6) || 'Name must be greater than 6 characters',
    ],
    password_confirmation: '',
    passwordConfirmationRules: [
      (v) => !!v || 'Password is required',
      (v) => (v && v.length >= 6) || 'Name must be greater than 6 characters',
    ],
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
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
