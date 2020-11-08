<template>
  <v-card :loading="loading" light>
    <v-card-title>
      <div>Hello: {{data.name}}</div>
      <v-spacer></v-spacer>
      <div>Email: {{data.email}}</div>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-card color="primary">
            <v-card-title>Total Income</v-card-title>
            <v-card-text>{{data.income}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="success">
            <v-card-title>Total Outcome</v-card-title>
            <v-card-text>{{data.outcome}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="error">
            <v-card-title>Total Creditor</v-card-title>
            <v-card-text>{{data.creditor}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="warning">
            <v-card-title>Total Debtor</v-card-title>
            <v-card-text>{{data.debtor}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="primary">
            <v-card-title>Total Suppliers</v-card-title>
            <v-card-text>{{data.suppliers_count}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="success">
            <v-card-title>Total clients</v-card-title>
            <v-card-text>{{data.clients_count}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="error">
            <v-card-title>Total Categories</v-card-title>
            <v-card-text>{{data.categories_count}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="warning">
            <v-card-title>Total Products</v-card-title>
            <v-card-text>{{data.products_count}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="primary">
            <v-card-title>Total Sales</v-card-title>
            <v-card-text>{{data.sales_count}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="success">
            <v-card-title>Total Purchases</v-card-title>
            <v-card-text>{{data.purchases_count}}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  middleware: ['auth', 'verified'],
  data: () => ({
    search: '',
    dialog: false,
    loading: true,
    formloading: false,
    data: {},
  }),

  computed: {
    auth() {
      return this.$store.state.auth.user;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.index();
  },

  methods: {
    index() {
      this.$axios
        .$get(`api/home?token=${this.auth.token}`)
        .then((response) => {
          this.loading = false;
          this.data = response.payload;
        })
        .catch((response) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card__text {
  text-align: center;
  font-size: 40px;
  color: #fff !important;
}
</style>
