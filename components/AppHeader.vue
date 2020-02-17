<template>
  <v-app-bar
    max-height="70px"
    dark
  >
    <v-spacer></v-spacer>
    <template v-if="authenticatedUser">
      <div class="mx-2">
        <v-btn text large outlined :to="{path: '/profile'}">Profile</v-btn>
      </div>
      <div class="mx-2">
        <v-btn text large outlined @click="logout">Logout</v-btn>
      </div>
    </template>
    <template v-else>
      <div class="mx-2">
        <v-btn text large outlined @click="togglePopup('login')">Log in</v-btn>
      </div>
      <div class="mx-2">
        <v-btn text large outlined @click="togglePopup('register')">Register</v-btn>
      </div>
    </template>

    <v-dialog v-model="popupActive" max-width="320px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ popupType === 'login' ? 'Login' : 'Register' }}</span>
        </v-card-title>
        <v-card-text>

          <v-text-field
            label="Email"
            v-model="email"
            :error="hasError"
            @focus="clearError"
            :error-messages="errMsg"
          ></v-text-field>

          <v-text-field
            label="password"
            v-model="password"
            :error="hasError"
            @focus="clearError"
            type="password"
          ></v-text-field>

          <v-text-field
            v-if="popupType === 'register'"
            label="Repeat password"
            v-model="registrationPassword"
            :error="hasError"
            @focus="clearError"
            type="password"
          ></v-text-field>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="togglePopup">Close</v-btn>
          <v-btn v-if="popupType === 'login'" text @click="login">Login</v-btn>
          <v-btn v-else text @click="register">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app-bar>
</template>

<script>
    import firebase from 'firebase'
    import { db } from '~/plugins/firebase'
    import { mapActions } from 'vuex'

    export default {
        name: "AppHeader",
        data() {
            return {
                authenticatedUser: null,
                email: 'supgreyd@gmail.com',
                password: '456456',
                registrationPassword: '',
                popupActive: false,
                popupType: null,
                hasError: false,
                errMsg: null
            }
        },
        methods: {
            ...mapActions({
                setUser: 'user/setUser'
            }),
            togglePopup(type) {
                this.popupActive = !this.popupActive
                this.popupType = this.popupActive ? type : null
            },
            clearError() {
                this.hasError = false
                this.errMsg = null
            },
            register() {
                if (this.password === this.registrationPassword) {
                    firebase
                        .auth()
                        .createUserWithEmailAndPassword(this.email, this.password)
                        .then(res => {
                            console.log('registration success', {res})
                            const userId = res.user.uid
                            this.addNewUser(userId)
                            this.toProfile()
                        })
                        .catch(err => {
                            this.hasError = true
                            this.errMsg = 'Invalid email or password'
                        })
                } else {
                    this.hasError = true
                    this.errMsg = 'Password not matching'
                }
            },
            logout() {
                firebase.auth().signOut()
                this.$router.push({path: '/'})
            },
            login() {
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                    .then(res => {
                        console.log('login success', {res})
                        const userId = res.user.uid
                        // this.addNewUser(userId)
                        this.toProfile()
                    })
                    .catch(err => {
                        this.hasError = true
                        this.errMsg = 'Invalid email or password'
                    })
            },
            toProfile() {
                this.togglePopup()
                this.$router.push({path: '/profile'})
            },
            addNewUser(id) {
                const data = {
                    email: this.email,
                    id: id
                }
                this.setUser(data)
                db.collection('users').doc(id).set(data)
            }
        },
        created() {
            firebase.auth().onAuthStateChanged(user => (this.authenticatedUser = user))
        },
        watch: {
            authenticatedUser(val) {
                console.log({val})
                if (val) {
                    db.collection('users').doc(val.uid).get()
                        .then(res => {
                            this.setUser(res.data())
                        })
                }
                else {
                    this.setUser(null)
                }
            }
        }
    }
</script>

<style scoped>
  /*supgreyd@gmail.com*/
</style>
