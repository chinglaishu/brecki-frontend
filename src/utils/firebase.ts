import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import * as uuid from "uuid";
import { MessageType, User } from '../type/common';
import moment from "moment-timezone";
import { Match } from '../page/likeZone/type';
import { MessageUser, MessageUserStatus } from '../page/chat/type';

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

// message ref
const MR = (matchId: string) => {
  return `${matchId}/messages`;
};

// user ref
const UR = (matchId: string, userId: string) => {
  return `${matchId}/user/${userId}`;
};

// user status ref
const SR = (userId: string) => {
  return `/status/${userId}`;
};

const isOfflineForDatabase = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};
const isOnlineForDatabase = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
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

  ref(ref: string) {
    return firebase.database().ref(ref);
  }

  parseUser = (snapshot: any, id: string) => {
    if (!snapshot.val()) {
      return snapshot.val();
    }
    const {isTyping, lastSeen} = snapshot.val();

    const user = {
      id,
      isTyping,
      lastSeen,
    };
    return user;
  }

  parseUserStatus = (snapshot: any, id: string) => {
    if (!snapshot.val()) {
      return snapshot.val();
    }

    const {state, last_changed} = snapshot.val();

    const userStatus: MessageUserStatus = {
      id,
      state,
      last_changed,
    };
    return userStatus;
  }

  parse = (snapshot: any) => {
    if (!snapshot.val()) {
      return snapshot.val();
    }

    const {timestamp, type, text, user} = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    
    return {
      id,
      _id,
      timestamp,
      type,
      text,
      user,
    };
  }

  getOneParse = (snapshot: any) => {

    if (!snapshot.val()) {
      return snapshot.val();
    }

    const messages = this.useParse(snapshot);

    return messages?.[0];
  };



  useParse = (snapshots: any) => {
    if (!snapshots.val()) {
      return [];
    }
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

  getUnreadMessages = async (matchId: string, userLastSeen: number) => {
    if (!userLastSeen) {userLastSeen = 0; }
    const results = await this.ref(MR(matchId))
      .startAt(userLastSeen)
      .limitToLast(99)
      .once("value");
    return this.useParse(results);
  }

  getMessageUser = async (matchId: string, userId: string) => {
    const result = await this.ref(UR(matchId, userId)).get();
    return this.parseUser(result, userId);
  };

  getLastMessage = async (matchId: string) => {
    const result = await this.ref(MR(matchId)).orderByChild("timestamp").limitToLast(1).once("value");
    const parseResult = this.getOneParse(result);
    return parseResult;
  }

  getMessages = (matchId: string, size: number, callback: any) => {
    this.ref(MR(matchId))
      .orderByChild("timestamp")
      .limitToLast(size)
      .once("value", snapshot => callback(this.useParse(snapshot)));
  };

  readAllMessages = (matchId: string, userId: string) => {
    this.ref(UR(matchId, userId)).update({lastSeen: moment().toDate()});
  }

  messageAddRefOn = (matchId: string, callback: any) => {
    this.ref(MR(matchId))
      .limitToLast(1)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  messageChangeRefOn = (matchId: string, callback: any) => {
    this.ref(MR(matchId))
      .on('child_changed', snapshot => callback(this.parse(snapshot)));
  }

  userChangeRefOn = (matchId: string, userId: string, callback: any) => {
    this.ref(UR(matchId, userId))
      .on("child_changed", snapshot => callback(this.parseUser(snapshot, userId)));
  }

  userStatusRefOn = async (userId: string, callback: any) => {
    this.ref(SR(userId)).on("value", snaphshot => callback(this.parseUserStatus(snaphshot, userId)))
  }

  timestamp = () => {
    return moment().unix();
  }

  updateLastSeen = (matchId: string, userId: string) => {
    this.ref(UR(matchId, userId)).update({lastSeen: moment().unix()});
  }

  startTyping = (matchId: string, userId: string) => {
    this.ref(UR(matchId, userId)).update({typing: true});
  }

  endTyping = (matchId: string, userId: string) => {
    this.ref(UR(matchId, userId)).update({typing: false});  
  }

  createNewMatch = async (match: Match) => {
    const {users} = match;
    const user: any = {};
    for (let i = 0 ; i < users.length ; i++) {
      user[users[i].id] = {
        isTyping: false,
        lastSeen: moment().unix(),
      } as MessageUser;
    }
    return await this.ref(match.id).set({
      user,
      messages: [],
    });
  }

  online = async (userId: string) => {
    this.ref(SR(userId)).set(isOnlineForDatabase);
  }

  offline = async (userId: string) => {
    this.ref(SR(userId)).set(isOfflineForDatabase);
  }

  startStatusChecker = async (userId: string) => {
    const userStatusDatabaseRef = this.ref(SR(userId));
    
    this.ref('.info/connected').on('value', function(snapshot) {
      if (snapshot.val() == false) {
        return;
      };
      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
        userStatusDatabaseRef.set(isOnlineForDatabase);
      });
    });
  };

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
    };
    this.ref(MR(matchId)).push(message);
  };

  messageRefOff = (matchId: string) => {
    this.ref(MR(matchId)).off();
  }

  userRefOff = (matchId: string, userId: string) => {
    this.ref(UR(matchId, userId)).off();
  }

  logout = async () => {
    firebase.auth().signOut();
  }
}

const fire = new Fire();
export default fire;
