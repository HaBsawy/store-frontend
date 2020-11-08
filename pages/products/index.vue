<template>
  <v-data-table
    light
    :loading="loading"
    :headers="headers"
    :items="products"
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
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" light max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="#dd2c00" v-bind="attrs" v-on="on">New Product</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      :items="categories"
                      item-text="name"
                      item-value="id"
                      v-model="product.category_id"
                      light
                      label="Category"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="product.name" label="Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-textarea v-model="product.description" label="Description"></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="product.buy_price" label="Buy Price"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="product.sell_price" label="Sell Price"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="product.stock" label="Stock"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="product.min_allowed_stock" label="Min Allowed Stock"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" :loading="formloading" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
      <v-icon small @click="destroy(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  middleware: ['auth', 'verified'],
  data: () => ({
    search: '',
    dialog: false,
    headers: [
      { text: 'category', value: 'category.name' },
      { text: 'name', value: 'name' },
      { text: 'description', value: 'description' },
      { text: 'buy_price', value: 'buy_price' },
      { text: 'sell_price', value: 'sell_price' },
      { text: 'stock', value: 'stock' },
      { text: 'min_allowed_stock', value: 'min_allowed_stock' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    loading: true,
    formloading: false,
    product: {},
    products: [],
    categories: [],
  }),

  computed: {
    formTitle() {
      return this.product.id ? 'Edit Product' : 'New Product';
    },
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
    this.getCategories();
  },

  methods: {
    index() {
      this.$axios
        .$get(`api/products?token=${this.auth.token}`)
        .then((response) => {
          this.loading = false;
          this.products = response.payload;
        })
        .catch((response) => {});
    },

    getCategories() {
      this.$axios
        .$get(`api/categories?token=${this.auth.token}`)
        .then((response) => {
          this.loading = false;
          this.categories = response.payload;
        })
        .catch((response) => {});
    },

    edit(item) {
      this.product = item;
      this.dialog = true;
    },

    destroy(item) {
      confirm('Are you sure you want to delete this supplier?') &&
        this.deleting(item);
    },

    deleting(item) {
      this.$axios
        .$delete(`api/products/${item.id}?token=${this.auth.token}`)
        .then((response) => {
          this.$store.commit('auth/setSnackbar', {
            show: true,
            color: '#7b7b22',
            text: response.msg,
          });
          this.index();
        })
        .catch((response) => {
          this.formloading = false;
          let error = response.response.data.msg;
          this.$store.commit('auth/setSnackbar', {
            show: true,
            color: 'error',
            text: error,
          });
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.product = {};
      });
    },

    save() {
      this.formloading = true;
      if (this.product.id) {
        this.$axios
          .$put(
            `api/products/${this.product.id}?token=${this.auth.token}`,
            this.product
          )
          .then((response) => {
            this.formloading = false;
            this.$store.commit('auth/setSnackbar', {
              show: true,
              color: '#7b7b22',
              text: response.msg,
            });
            this.close();
          })
          .catch((response) => {
            this.formloading = false;
            let error = response.response.data.errors;
            this.$store.commit('auth/setSnackbar', {
              show: true,
              color: 'error',
              text: error[Object.keys(error)[0]][0],
            });
          });
      } else {
        this.$axios
          .$post(`api/products?token=${this.auth.token}`, this.product)
          .then((response) => {
            this.formloading = false;
            this.$store.commit('auth/setSnackbar', {
              show: true,
              color: '#7b7b22',
              text: response.msg,
            });
            this.index();
            this.close();
          })
          .catch((response) => {
            this.formloading = false;
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
.v-data-table {
  margin: 30px 0;

  .v-toolbar__title {
    color: #dd2c00;
  }

  .v-btn {
    color: #fff;
  }

  .v-sheet.v-list {
    background: #fff !important;
  }
}
</style>
