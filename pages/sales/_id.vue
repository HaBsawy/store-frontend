<template>
  <v-card :loading="loading" light>
    <v-card-title v-if="sale.client">
      <div>Sale No: {{sale.id}}</div>
      <v-spacer></v-spacer>
      <div>Client: {{sale.client.name}}</div>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-card color="primary">
            <v-card-title>Total Price</v-card-title>
            <v-card-text>{{sale.price}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="success">
            <v-card-title>Discount</v-card-title>
            <v-card-text>{{sale.discount}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="error">
            <v-card-title>Total Paid</v-card-title>
            <v-card-text>{{sale.paid}}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-data-table
        light
        :loading="loading"
        :headers="headers"
        :items="sale.sale_products"
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
      { text: 'price', value: 'product.sell_price' },
      { text: 'quantity', value: 'quantity' },
    ],
    loading: true,
    formloading: false,
    sale: {},
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
        .$get(`api/sales/${this.$route.params.id}?token=${this.auth.token}`)
        .then((response) => {
          this.loading = false;
          this.sale = response.payload;
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
