<template>
  <v-app>
    <v-main>
      <v-container>
        <v-snackbar
          v-if="snackbar.show"
          top
          :color="snackbar.color"
          timeout="-1"
          v-model="snackbar"
        >
          {{ snackbar.text }}
          <template v-slot:action="{ attrs }">
            <v-btn color="#ffc8db" text v-bind="attrs" @click="colseSnackbar">Close</v-btn>
          </template>
        </v-snackbar>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" color="#dd2c00" app>
      <span>
        <a href="https://eslamfathy.netlify.app/">HaBsawy</a>
        &copy; {{ new Date().getFullYear() }}
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      title: 'Store',
    };
  },
  computed: {
    snackbar() {
      return this.$store.state.auth.snackbar;
    },
  },
  methods: {
    colseSnackbar() {
      this.$store.commit('auth/setSnackbar', {});
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.theme--dark.v-application {
  background: #fff;
  color: #000;
}

.v-footer span a {
  text-decoration: none;
  color: #fff;
}
</style>
