import { defineStore } from "pinia";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import { auth, db } from "../firebaseConfig";
import { nanoid } from "nanoid";
import router from "../router/router";

export const useDatabaseStore = defineStore("database", {
  state: () => ({
    documents: [],
    loadingDoc: false,
    loading: false,
  }),
  actions: {
    async getURL(id){
      try {
        const docRef = doc(db, "urls", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          return false
        }

        return docSnap.data().name;
      } catch (error) {
        console.log(error.message);
        return false
      }
    },
    async getUrls() {
      try {
        if (this.documents.length !== 0) {
          return;
        }

        // first form
        // const urls = await getDocs(collection(db, "urls"))
        // urls.forEach(doc => {
        //   this.documents.push(doc.data())
        // })

        // second form
        this.loadingDoc = true;
        const q = query(
          collection(db, "urls"),
          where("user", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          this.documents.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingDoc = false;
      }
    },
    async addUrl(url) {
      this.loading = true;
      try {
        const objetoDoc = {
          name: url,
          short: nanoid(6),
          user: auth.currentUser.uid,
        };
        const docRef = await setDoc(doc(db, "urls", objetoDoc.short), objetoDoc);
        // console.log(docRef); ==> retorna unicamente el id
        this.documents.push({
          ...objetoDoc,
          id: objetoDoc.short,
        });
      } catch (error) {
        return error.code;
      } finally {
        this.loading = false;
      }
    },
    async leerUrl(id) {
      this.loadingDoc = true;
      try {
        const docRef = doc(db, "urls", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error("no existe el doc");
        }

        if (docSnap.data().user !== auth.currentUser.uid) {
          throw new Error("no le pertenece ese documento");
        }

        return docSnap.data().name;
      } catch (error) {
        console.error(error.message);
      } finally {
        this.loadingDoc = false;
      }
    },
    async updateUrl(id, name) {
      this.loading = true;
      try {
        const docRef = doc(db, "urls", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error("no existe el doc");
        }

        if (docSnap.data().user !== auth.currentUser.uid) {
          throw new Error("no le pertenece ese documento");
        }

        await updateDoc(docRef, {
          name: name, //  ==> si la key y el value coinciden se puede colocar unicamente el value
        });

        // this.documents = this.documents.map(item => item.id === id ? item.name = name : item) una forma de hacer la edicion

        this.documents = this.documents.map((item) =>
          item.id === id ? { ...item, name: name } : item
        ); // otra forma con destructuracion
        router.push("/");
      } catch (error) {
        console.log(error.message);
        return error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteUrl(id) {
      this.loading = true;
      try {
        const docRef = doc(db, "urls", id);

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          throw new Error("no existe el doc");
        }

        if (docSnap.data().user !== auth.currentUser.uid) {
          throw new Error("no le pertenece ese documento");
        }

        await deleteDoc(docRef);
        this.documents = this.documents.filter((item) => item.id !== id);
      } catch (error) {
        console.log(error.message);
        return error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
