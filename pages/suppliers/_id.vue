<template>
  <v-card :loading="loading" light>
    <v-card-title>
      <div>Supplier: {{supplier.name}}</div>
      <v-spacer></v-spacer>
      <div>Mobile: {{supplier.mobile}}</div>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-card color="primary">
            <v-card-title>Total Purchases</v-card-title>
            <v-card-text>{{supplier.total_purchases}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="success">
            <v-card-title>Total Paid</v-card-title>
            <v-card-text>{{supplier.total_paid}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="error">
            <v-card-title>Creditor</v-card-title>
            <v-card-text>{{supplier.creditor}}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-data-table
        light
        :loading="loading"
        :headers="purchasesHeaders"
        :items="supplier.purchases"
        :search="search"
        sort-by="date"
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
          </v-toolbar>
        </template>
      </v-data-table>
      <v-data-table
        light
        :loading="loading"
        :headers="outcomesHeaders"
        :items="supplier.outcomes"
        :search="search"
        sort-by="date"
        class="elevation-4"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Outcomes</v-toolbar-title>
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
                <v-btn color="#dd2c00" v-bind="attrs" v-on="on">New Outcome</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">New Outcome</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-form v-model="valid">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field v-model="outcome.price" :rules="priceRules" label="Price"></v-text-field>
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
          <v-icon small @click="destroy(item)">mdi-delete</v-icon>
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
    purchasesHeaders: [
      { text: 'Price', value: 'price' },
      { text: 'Paid', value: 'paid' },
      { text: 'Discount', value: 'discount' },
      { text: 'Date', value: 'created_at' },
    ],
    outcomesHeaders: [
      { text: 'Paid', value: 'price' },
      { text: 'Date', value: 'created_at' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    priceRules: [
      (v) => !!v || 'discount is required',
      (v) => /^\d*\.?\d*$/.test(v) || 'discount must be numeric',
      (v) => v >= 0 || 'discount must be greater than or equal 0',
    ],
    valid: true,
    loading: true,
    formloading: false,
    supplier: {},
    outcome: {},
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
        .$get(`api/suppliers/${this.$route.params.id}?token=${this.auth.token}`)
        .then((response) => {
          this.loading = false;
          this.supplier = response.payload;
        })
        .catch((response) => {});
    },

    destroy(item) {
      confirm('Are you sure you want to delete this Outcome?') &&
        this.deleting(item);
    },

    deleting(item) {
      this.$axios
        .$delete(`api/outcomes/${item.id}?token=${this.auth.token}`)
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
        this.outcome = {};
      });
    },

    save() {
      this.formloading = true;
      this.outcome.supplier_id = this.$route.params.id;
      this.$axios
        .$post(`api/outcomes?token=${this.auth.token}`, this.outcome)
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
