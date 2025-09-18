import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Pega tu configuración aquí
const firebaseConfig = {
  apiKey: "AIzaSyB_TWv7VSdPJfWCh7BVhNZ533OagDaLlT8",
  authDomain: "subasta-cohorsil.firebaseapp.com",
  projectId: "subasta-cohorsil",
  storageBucket: "subasta-cohorsil.appspot.com",
  messagingSenderId: "999949946540",
  appId: "1:999949946540:web:b4d245e9e8b6e69b20d909",
  measurementId: "G-CT0FHMWNBG"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth y Firestore para usarlos en tu app
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
