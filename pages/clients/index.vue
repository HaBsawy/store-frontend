<template>
  <v-data-table
    light
    :loading="loading"
    :headers="headers"
    :items="clients"
    :search="search"
    sort-by="name"
    class="elevation-4"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Clients</v-toolbar-title>
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
            <v-btn color="#dd2c00" v-bind="attrs" v-on="on">New Client</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="client.name" label="Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="client.mobile" label="Mobile"></v-text-field>
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
      <nuxt-link :to="`clients/${item.id}`">
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
      { text: 'name', value: 'name' },
      { text: 'mobile', value: 'mobile' },
      { text: 'total sales', value: 'total_sales' },
      { text: 'total paid', value: 'total_paid' },
      { text: 'debtor', value: 'debtor' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    loading: true,
    formloading: false,
    client: {},
    clients: [],
  }),

  computed: {
    formTitle() {
      return this.client.id ? 'Edit Client' : 'New Client';
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
  },

  methods: {
    index() {
      this.$axios
        .$get(`api/clients?token=${this.auth.token}`)
        .then((response) => {
          this.loading = false;
          this.clients = response.payload;
        })
        .catch((response) => {});
    },

    edit(item) {
      this.client = item;
      this.dialog = true;
    },

    destroy(item) {
      confirm('Are you sure you want to delete this supplier?') &&
        this.deleting(item);
    },

    deleting(item) {
      this.$axios
        .$delete(`api/clients/${item.id}?token=${this.auth.token}`, this.client)
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
        this.client = {};
      });
    },

    save() {
      this.formloading = true;
      if (this.client.id) {
        this.$axios
          .$put(
            `api/clients/${this.client.id}?token=${this.auth.token}`,
            this.client
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
          .$post(`api/clients?token=${this.auth.token}`, this.client)
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

  a {
    text-decoration: none;
  }
}
</style>
