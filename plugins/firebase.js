import firebase from 'firebase'

let app = null;

const firebaseConfig = {
  apiKey: "AIzaSyCnvhQ4TLO2MKFRuhF4KMBKd7_FnhsXBRM",
  authDomain: "soketest-ec51b.firebaseapp.com",
  databaseURL: "https://soketest-ec51b.firebaseio.com",
  projectId: "soketest-ec51b",
  storageBucket: "soketest-ec51b.appspot.com",
  messagingSenderId: "81678270358",
  appId: "1:81678270358:web:f71119ac2c33b0beb0a7b7"
}

app = firebase.apps.length
  ? firebase.app()
  : firebase.initializeApp(firebaseConfig)

export const db = app.firestore()
