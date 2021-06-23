import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// 作成した firebaseConfig オブジェクトは初期化する必要がある。
const firebaseApp = firebase.initializeApp(firebaseConfig);

// firebase の各機能を、コンポーネントで使用できるようにエクスポートしておく。
export const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

// Google 認証機能に必要。
export const provider = new firebase.auth.GoogleAuthProvider();
