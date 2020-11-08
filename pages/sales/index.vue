<template>
  <v-data-table
    light
    :loading="loading"
    :headers="headers"
    :items="sales"
    :search="search"
    sort-by="client"
    class="elevation-4"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Sales</v-toolbar-title>
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
            <v-btn color="#dd2c00" v-bind="attrs" v-on="on">New Sale</v-btn>
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
                        :items="clients"
                        item-text="name"
                        item-value="id"
                        v-model="sale.client_id"
                        light
                        label="Client"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" v-if="!sale.id">
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
                            type="number"
                            :disabled="product.disable"
                            :rules="product.rules"
                            @change="getTotalPrice"
                            min="1"
                            label="Quantity"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-btn small color="success" @click="addProduct">Add Product</v-btn>
                      <v-btn small color="error" @click="removeProduct">Remove Product</v-btn>
                    </v-col>
                    <v-col v-if="!sale.id" cols="12" sm="6">
                      <v-text-field disabled :value="totalPrice" label="Price"></v-text-field>
                    </v-col>
                    <v-col cols="12" :sm="sale.id ? '12' : '6'">
                      <v-text-field v-model="sale.discount" :rules="discountRules" label="Discount"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="sale.paid" :rules="paidRules" label="Paid"></v-text-field>
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
      <nuxt-link :to="`sales/${item.id}`">
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
      { text: 'Client', value: 'client.name' },
      { text: 'Price', value: 'price' },
      { text: 'Paid', value: 'paid' },
      { text: 'Discount', value: 'discount' },
      { text: 'Date', value: 'created_at' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    loading: true,
    formloading: false,
    totalPrice: 0,
    valid: true,
    sale: {},
    sales: [],
    clients: [],
    products: [],
    selectedProducts: [],
    discountRules: [
      (v) => !!v || 'discount is required',
      (v) => /^\d*\.?\d*$/.test(v) || 'discount must be numeric',
      (v) => v >= 0 || 'discount must be greater than or equal 0',
    ],
    paidRules: [
      (v) => !!v || 'paid is required',
      (v) => /^\d*\.?\d*$/.test(v) || 'paid must be numeric',
      (v) => v >= 0 || 'paid must be greater than or equal 0',
    ],
  }),

  computed: {
    formTitle() {
      return this.sale.id ? 'Edit Sale' : 'New Sale';
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
    this.getClients();
    this.getProducts();
    this.addProduct();
    this.discountRules.push(
      (v) =>
        v <= this.totalPrice || 'the discount is greater than the total price'
    );
    this.paidRules.push(
      (v) =>
        v <= this.totalPrice - this.sale.discount ||
        'the paid is greater than the price after discount'
    );
  },

  methods: {
    index() {
      this.$axios
        .$get(`api/sales?token=${this.auth.token}`)
        .then((response) => {
          this.loading = false;
          this.sales = response.payload;
        })
        .catch((response) => {});
    },

    getClients() {
      this.$axios
        .$get(`api/clients?token=${this.auth.token}`)
        .then((response) => {
          this.loading = false;
          this.clients = response.payload;
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
        product: {},
      });
    },

    removeProduct() {
      this.selectedProducts.pop();
      this.getTotalPrice();
    },

    async productQunatity(index) {
      if (this.selectedProducts[index].id) {
        await this.$axios
          .$get(
            `api/products/${this.selectedProducts[index].id}?token=${this.auth.token}`
          )
          .then((response) => {
            this.selectedProducts[index].product = response.payload;
            this.selectedProducts[index].rules = [
              (v) => !!v || 'quantity is required',
              (v) => v > 0 || 'quantity must be greater than or equal 1',
              (v) => /^\d+$/.test(v) || 'qunatity must be numeric',
              (v) =>
                v <= response.payload.stock ||
                'the quantity needed is greater than in the stock',
            ];
            this.selectedProducts[index].disable = false;
            this.selectedProducts[index].quantity = 1;
            this.getTotalPrice();
          });
      }
    },

    getTotalPrice() {
      let totalPrice = 0;
      this.selectedProducts.forEach((element) => {
        if (element.product) {
          let add = element.product.sell_price * element.quantity;
          totalPrice += add;
        }
      });
      this.totalPrice = totalPrice;
    },

    edit(item) {
      this.sale = item;
      this.totalPrice = item.price;
      this.dialog = true;
    },

    destroy(item) {
      confirm('Are you sure you want to delete this sale?') &&
        this.deleting(item);
    },

    deleting(item) {
      this.$axios
        .$delete(`api/sales/${item.id}?token=${this.auth.token}`)
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
        this.sale = {};
        this.totalPrice = 0;
        this.selectedProducts = [{ id: undefined, quantity: undefined }];
      });
    },

    save() {
      this.sale.products = this.selectedProducts;
      this.formloading = true;
      if (this.sale.id) {
        this.$axios
          .$put(`api/sales/${this.sale.id}?token=${this.auth.token}`, this.sale)
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
        this.sale.price = this.totalPrice;
        this.$axios
          .$post(`api/sales?token=${this.auth.token}`, this.sale)
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
