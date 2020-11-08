<template>
  <v-card :loading="loading" light>
    <v-card-title v-if="purchase.supplier">
      <div>Purchase No: {{purchase.id}}</div>
      <v-spacer></v-spacer>
      <div>Supplier: {{purchase.supplier.name}}</div>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-card color="primary">
            <v-card-title>Total Price</v-card-title>
            <v-card-text>{{purchase.price}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card color="error">
            <v-card-title>Total Paid</v-card-title>
            <v-card-text>{{purchase.paid}}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-data-table
        light
        :loading="loading"
        :headers="headers"
        :items="purchase.purchase_products"
        :search="search"
        sort-by="name"
        class="elevation-4"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Products</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  middleware: ['auth', 'verified'],
  data: () => ({
    search: '',
    dialog: false,
    headers: [
      { text: 'name', value: 'product.name' },
      { text: 'quantity', value: 'quantity' },
    ],
    loading: true,
    formloading: false,
    purchase: {},
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
        .$get(`api/purchases/${this.$route.params.id}?token=${this.auth.token}`)
        .then((response) => {
          this.loading = false;
          this.purchase = response.payload;
        })
        .catch((response) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.v-data-table {
  margin: 30px 0;

  .v-toolbar__title {
    color: #dd2c00;
  }

  .v-btn {
    color: #fff;
  }
}
</style>
