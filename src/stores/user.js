import { defineStore } from "pinia";
import { auth, db, storage } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useDatabaseStore } from "./database";
import router from "../router/router";
import { doc, setDoc } from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    userData: null,
    loadingUser: false,
    loadingSession: false,
  }),
  getters: {
    minuscula(state) {
      return state.userData.toLowerCase();
    },
  },
  actions: {
    async registerUser(email, password) {
      try {
        this.loadingUser = true;
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.userData = {
          email: user.email,
          uid: user.uid,
        };
        router.push("/");
      } catch (error) {
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },
    async updateImageProfile(imagen) {
      try {
        const storagerRef = ref(storage, `${auth.currentUser.uid}/perfil`)
        await uploadBytes(storagerRef, imagen.originFileObj)
        const url = await getDownloadURL(storagerRef);
        await updateProfile(auth.currentUser, {
          photoURL: url,
        });
        this.setUser(auth.currentUser)
      } catch (error) {
        console.log(error);
      }
    },
    async updateUser(displayName) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
        this.setUser(auth.currentUser)
      } catch (error) {
        console.log(error);
        return error.code;
      } finally {
      }
    },
    async setUser(user) {
      try {
        const docRef = doc(db, "users", user.uid);

        this.userData = {
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        await setDoc(docRef, this.userData);
      } catch (error) {
        console.log(error);
      }
    },
    async loginUser(email, password) {
      try {
        this.loadingUser = true;
        const {user} = await signInWithEmailAndPassword(auth, email, password);
        await this.setUser(user)

        router.push("/");
      } catch (error) {
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },
    async logOutUser() {
      const store = useDatabaseStore();
      store.$reset();
      try {
        this.loadingUser = true;
        router.push("/login");
        await signOut(auth);
        this.userData = null
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false;
      }
    },
    currentUser() {
      return new Promise((resolve, reject) => {
        const unsuscribe = onAuthStateChanged(
          auth,
          async (user) => {
            if (user) {
              this.userData = {
                email: user.email,
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
              };
            } else {
              this.userData = null;
            }
            resolve(user);
          },
          (e) => reject(e)
        );
        unsuscribe();
      });
    },
  },
});
