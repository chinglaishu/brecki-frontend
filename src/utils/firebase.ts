import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import * as uuid from "uuid";
import { MessageType, User } from '../type/common';
import moment from "moment-timezone";

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
    this.init();
  }

  init = () => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }
  }

  login = async (user: User) => {
    console.log("logging in");
    console.log(user);
    const result = await firebase.auth().signInWithEmailAndPassword(user?.firebaseEmail as string, user?.firebasePassword as string);
    if (!result) {
      await this.createAccount(user);
    }
    console.log("create");
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

  createAccount = (user: User) => {
    console.log("start create");
    return new Promise((resolve, reject) => {
      firebase.auth()
      .createUserWithEmailAndPassword(user?.firebaseEmail as string, user?.firebasePassword as string)
      .then(function() {
        console.log("firebase account created");
        resolve(true);
      }, function(error) {
        console.log("eerrror");
        alert("Create account failed. Error: " + error.message);
        reject(error);
      });
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

  ref(matchId: string) {
    return firebase.database().ref(`${matchId}`);
  }

  parse = (snapshot: any) => {
    const { timestamp: numberStamp, type, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);

    const message = {
      id,
      _id,
      timestamp,
      type,
      text,
      user,
    };
    return message;
  };

  useParse = (snapshots: any) => {
    const messageData = snapshots.val();
    if (!messageData) {return []; }
    const keys = Object.keys(messageData);
    return keys.map((key: any) => {
      const {timestamp, type, text, user} = messageData[key];
      return {
        id: key,
        _id: key,
        timestamp,
        type,
        text,
        user,
      };
    });
  }

  getMessages = (matchId: string, size: number, callback: any) => {
    this.ref(matchId)
      .orderByChild("timestamp")
      .limitToLast(size)
      .once("value", snapshot => callback(this.useParse(snapshot)));
  };

  refOn = (matchId: string, callback: any) => {
    this.ref(matchId)
      .limitToLast(1)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  timestamp = () => {
    return moment().toISOString();
  }

  // send the message to the Backend
  send = (type: MessageType, matchId: string, userId: string, text: any) => {
    const message = {
      type,
      text,
      user: {
        id: userId,
        _id: userId,
      },
      timestamp: this.timestamp(),
      isSend: false,
      isRead: false,
    };
    this.ref(matchId).push(message);
  };

  refOff = (matchId: string) => {
    this.ref(matchId).off();
  }
}

const fire = new Fire();
export default fire;
