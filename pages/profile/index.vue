<template>
  <v-container v-if="tmpUser">
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          label="Name"
          v-model="tmpUser.name"
        ></v-text-field>
        <v-text-field
          label="Last Name"
          v-model="tmpUser.lastName"
        ></v-text-field>
        <v-text-field
          label="email"
          v-model="tmpUser.email"
        ></v-text-field>
        <v-text-field
          v-model="tmpUser.age"
          label="Age"
        ></v-text-field>

        <v-btn text large outlined @click="save">Update data</v-btn>

      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="userMessage"
          label="Regular"
        ></v-text-field>
        <v-btn text @click="sendMessage">send</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'

    import { db } from '~/plugins/firebase'

    export default {
        name: "profile",
        data() {
            return {
              tmpUser: null,
                socket: null,
                userMessage: '',
                messageRxd: ''
            }
        },
        computed: {
            ...mapGetters({
                user: ['user/user']
            })
        },
        methods: {
            save() {
                db.collection('users').doc(this.tmpUser.id).set(this.tmpUser)
            },
            sendMessage() {
                let data = {
                    name: this.user.name,
                    message: this.userMessage
                }
                this.socket.emit('chat message', data)
            },
        },
        watch: {
            user (val) {
                this.tmpUser = {...val}
            }
        },
        mounted() {
            this.socket = this.$nuxtSocket({
                name: 'home',
                channel: 'home',
                reconnection: false
            })
        }

    }
</script>

<style scoped>

</style>
