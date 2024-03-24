import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCc2oSxsd0NHStBQ3HQPixhDLpCeE5eVsc",
  authDomain: "authentication-react-2883c.firebaseapp.com",
  projectId: "authentication-react-2883c",
  storageBucket: "authentication-react-2883c.appspot.com",
  messagingSenderId: "659890734311",
  appId: "1:659890734311:web:cd903a0c790152d0c70e42",
  measurementId: "G-FFX6MNVG18",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
