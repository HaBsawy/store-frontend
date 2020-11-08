<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      color="#ff5722"
      fixed
      app
    >
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="#dd2c00">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
    </v-app-bar>
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
export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
        },
        {
          icon: 'mdi-view-dashboard',
          title: 'Categories',
          to: '/categories',
        },
        {
          icon: 'mdi-baguette',
          title: 'Products',
          to: '/products',
        },
        {
          icon: 'mdi-import',
          title: 'Suppliers',
          to: '/suppliers',
        },
        {
          icon: 'mdi-export',
          title: 'Clients',
          to: '/clients',
        },
        {
          icon: 'mdi-import',
          title: 'Purchases',
          to: '/purchases',
        },
        {
          icon: 'mdi-export',
          title: 'Sales',
          to: '/sales',
        },
        {
          icon: 'mdi-logout',
          title: 'Logout',
          to: '/auth/logout',
        },
      ],
      miniVariant: true,
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

<style lang="scss" scoped>
.theme--dark.v-application {
  background: #fff;
  color: #000;
}

.v-footer span a {
  text-decoration: none;
  color: #fff;
}
</style>
