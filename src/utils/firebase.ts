import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import * as uuid from "uuid";
import { User } from '../type/common';

const config = {
  apiKey: "AIzaSyBTdCA25-6RvtAb4GciHK5KQBr7CYkG7Ww",
  authDomain: "test-chat-550b2.firebaseapp.com",
  databaseURL: "https://test-chat-550b2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-chat-550b2",
  storageBucket: "test-chat-550b2.appspot.com",
  messagingSenderId: "803004167482",
  appId: "1:803004167482:web:8306fa6a9e03928db6cc03",
  measurementId: "G-MBVJSDH553"
};

class Fire {
  constructor() {
    firebase.initializeApp(config);
  }

  login = async (user: User) => {
    console.log("logging in");
    const result = await firebase.auth().signInWithEmailAndPassword(user.firebaseEmail, user.firebasePassword);
    if (!result) {
      await this.createAccount(user);
    }
    return true;
  }

  observeAuth = () => {
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = (user: User | any) => {
    if (!user) {
      try {
        this.login(user);
      } catch ({ message }) {
        console.log("Failed:" + message);
      }
    } else {
      console.log("Reusing auth...");
    }
  };

  createAccount = async (user: User) => {
    firebase.auth()
      .createUserWithEmailAndPassword(user.firebaseEmail, user.firebasePassword)
      .then(function() {
        console.log("firebase account created");
      }, function(error) {
        alert("Create account failed. Error: "+error.message);
      });
  }

  // for update image on message?
  uploadImage = async (uri: string) => {
    console.log('got image to upload. uri:' + uri);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase
        .storage()
        .ref('image')
        .child(uuid.v4());
      const task = ref.put(blob);
    
      return new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          () => {
              /* noop but you can track the progress here */
          },
          reject /* this is where you would put an error callback! */,
          () => resolve(task.snapshot.ref.getDownloadURL())
        );
      });
    } catch (err) {
      console.log('uploadImage try/catch error: ' + err.message); //Cannot load an empty url
    }
  }

  onLogout = (user: User) => {
    firebase.auth().signOut().then(function() {
      console.log("Sign-out successful.");
    }).catch(function(error) {
      console.log("An error happened when signing out");
    });
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('Messages');
  }

  parse = (snapshot: any) => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);

    const message = {
      id,
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  refOn = (callback: any) => {
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  
  // send the message to the Backend
  send = (messages: any) => {
    for (let i = 0; i < messages.length; i++) {
      const { type, content, userId } = messages[i];
      const message = {
        type,
        content,
        userId,
        createdAt: this.timestamp,
      };
      this.ref.push(message);
    }
  };

  refOff= () => {
    this.ref.off();
  }
}

const fire = new Fire();
export default fire;
