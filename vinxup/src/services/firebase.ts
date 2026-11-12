import { Platform } from 'react-native';
import { getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore, initializeFirestore } from 'firebase/firestore';
import { Auth, getAuth, inMemoryPersistence, initializeAuth } from 'firebase/auth';
// @ts-ignore getReactNativePersistence existe no build nativo do SDK, mas não está tipado no pacote "firebase/auth"
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// As credenciais vêm do arquivo .env (veja .env.example).
// No Expo, só variáveis com prefixo EXPO_PUBLIC_ chegam ao app.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

// Na web, getAuth já persiste a sessão sozinho (localStorage do navegador).
// No app nativo (iOS/Android), é preciso dizer explicitamente onde guardar
// a sessão, senão ela fica só em memória e some ao fechar o app.
export const auth: Auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

// ---------------------------------------------------------------------------
// Segundo app do Firebase, usado SÓ para o responsável criar a conta de uma
// criança. O motivo: createUserWithEmailAndPassword loga automaticamente a
// conta recém-criada. Se usássemos o `auth` principal, o responsável seria
// deslogado e entraria como a criança. Com um app separado (e sessão só em
// memória), a sessão do responsável não é afetada.
// ---------------------------------------------------------------------------
const NOME_APP_SECUNDARIO = 'cadastro-crianca';
let secundario: { auth: Auth; db: Firestore } | null = null;

export function getFirebaseSecundario(): { auth: Auth; db: Firestore } {
  if (secundario) return secundario;

  const appSecundario =
    getApps().find((a) => a.name === NOME_APP_SECUNDARIO) ??
    initializeApp(firebaseConfig, NOME_APP_SECUNDARIO);

  let authSecundario: Auth;
  try {
    authSecundario = initializeAuth(appSecundario, { persistence: inMemoryPersistence });
  } catch {
    authSecundario = getAuth(appSecundario);
  }

  let dbSecundario: Firestore;
  try {
    dbSecundario = initializeFirestore(appSecundario, { ignoreUndefinedProperties: true });
  } catch {
    dbSecundario = getFirestore(appSecundario);
  }

  secundario = { auth: authSecundario, db: dbSecundario };
  return secundario;
}
