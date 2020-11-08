<template>
  <v-data-table
    light
    :loading="loading"
    :headers="headers"
    :items="purchases"
    :search="search"
    sort-by="supplier"
    class="elevation-4"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Purchases</v-toolbar-title>
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
            <v-btn color="#dd2c00" v-bind="attrs" v-on="on">New Purchase</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form v-model="valid">
                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                        :items="suppliers"
                        item-text="name"
                        item-value="id"
                        v-model="purchase.supplier_id"
                        light
                        label="Supplier"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" v-if="!purchase.id">
                      <v-row v-for="(product, index) in selectedProducts" :key="product.id">
                        <v-col cols="12" sm="6">
                          <v-autocomplete
                            :items="products"
                            item-text="name"
                            item-value="id"
                            v-model="product.id"
                            @change="productQunatity(index)"
                            light
                            label="Product"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="product.quantity"
                            :disabled="product.disable"
                            :rules="product.rules"
                            min="1"
                            label="Quantity"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-btn small color="success" @click="addProduct">Add Product</v-btn>
                      <v-btn small color="error" @click="removeProduct">Remove Product</v-btn>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="purchase.price" :rules="priceRules" label="Price"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="purchase.paid" :rules="paidRules" label="Paid"></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn
                color="blue darken-1"
                :disabled="!valid"
                :loading="formloading"
                text
                @click="save"
              >Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <nuxt-link :to="`purchases/${item.id}`">
        <v-icon small class="mr-2">mdi-eye</v-icon>
      </nuxt-link>
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
      { text: 'Supplier', value: 'supplier.name' },
      { text: 'Price', value: 'price' },
      { text: 'Paid', value: 'paid' },
      { text: 'Date', value: 'created_at' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    loading: true,
    formloading: false,
    valid: true,
    purchase: {},
    purchases: [],
    suppliers: [],
    products: [],
    selectedProducts: [],
    priceRules: [
      (v) => !!v || 'price is required',
      (v) => /^\d*\.?\d*$/.test(v) || 'price must be numeric',
      (v) => v >= 0 || 'price must be greater than or equal 0',
    ],
    paidRules: [
      (v) => !!v || 'paid is required',
      (v) => /^\d*\.?\d*$/.test(v) || 'paid must be numeric',
      (v) => v >= 0 || 'paid must be greater than or equal 0',
    ],
  }),

  computed: {
    formTitle() {
      return this.purchase.id ? 'Edit Purchase' : 'New Purchase';
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
    this.getSuppliers();
    this.getProducts();
    this.addProduct();
    this.paidRules.push(
      (v) =>
        parseInt(v) <= parseInt(this.purchase.price) ||
        'the paid is greater than the price'
    );
  },

  methods: {
    index() {
      this.$axios
        .$get(`api/purchases?token=${this.auth.token}`)
        .then((response) => {
          this.loading = false;
          this.purchases = response.payload;
        })
        .catch((response) => {});
    },

    getSuppliers() {
      this.$axios
        .$get(`api/suppliers?token=${this.auth.token}`)
        .then((response) => {
          this.loading = false;
          this.suppliers = response.payload;
        })
        .catch((response) => {});
    },

    getProducts() {
      this.$axios
        .$get(`api/products?token=${this.auth.token}`)
        .then((response) => {
          this.loading = false;
          this.products = response.payload;
        })
        .catch((response) => {});
    },

    addProduct() {
      this.selectedProducts.push({
        id: undefined,
        quantity: undefined,
        disable: true,
        rules: [(v) => !!v || 'quantity is required'],
      });
    },

    removeProduct() {
      this.selectedProducts.pop();
    },

    productQunatity(index) {
      this.selectedProducts[index].rules = [
        (v) => !!v || 'quantity is required',
        (v) => v > 0 || 'quantity must be greater than or equal 1',
        (v) => /^\d+$/.test(v) || 'qunatity must be numeric',
      ];
      this.selectedProducts[index].disable = false;
      this.selectedProducts[index].quantity = 1;
    },

    edit(item) {
      this.purchase = item;
      this.dialog = true;
    },

    destroy(item) {
      confirm('Are you sure you want to delete this purchase?') &&
        this.deleting(item);
    },

    deleting(item) {
      this.$axios
        .$delete(`api/purchases/${item.id}?token=${this.auth.token}`)
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
        this.purchase = {};
        this.selectedProducts = [{ id: undefined, quantity: undefined }];
      });
    },

    save() {
      this.purchase.products = this.selectedProducts;
      this.formloading = true;
      if (this.purchase.id) {
        this.$axios
          .$put(
            `api/purchases/${this.purchase.id}?token=${this.auth.token}`,
            this.purchase
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
          .$post(`api/purchases?token=${this.auth.token}`, this.purchase)
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

  a {
    text-decoration: none;
  }
}
</style>
