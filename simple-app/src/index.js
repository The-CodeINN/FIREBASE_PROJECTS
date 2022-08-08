import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  // getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDA5bQpl1YVJcHkhFtaUuVYdchstz3skxo",
  authDomain: "new-app-9a128.firebaseapp.com",
  projectId: "new-app-9a128",
  storageBucket: "new-app-9a128.appspot.com",
  messagingSenderId: "158103847112",
  appId: "1:158103847112:web:882a6b5fa7b35b4ccfa5fd",
  measurementId: "G-SFCY9JW9S2",
};

// initialize firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, "books");

// queries
const q = query(colRef, orderBy("createdAt"));

// get collection data
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// get realtime data
// onSnapshot(colRef, (snapshot) => {
onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});



// adding document to collection
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  })
    .then(() => {
      addBookForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// deleting document from collection
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);
  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// Getting a single doc
const docRef = doc(db, "books", "tQ0r0tWuAPKKfmhviyab");

// getDoc(docRef)
//   .then((doc) => {
//     if (doc.exists()) {
//       console.log(doc.data());
//     } else {
//       console.log("No such document!");
//     }
//   })

onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// Updating a  doc
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateForm.id.value);
  updateDoc(docRef, {
    title: "updated title",
  }).then(() => {
    updateForm.reset();
  });
});

// signing up users
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("user created:", userCredential.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// logging in and out users
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // console.log("the user logged out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // console.log("user logged in:", userCredential.user);
      loginForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//subscribing auth state change
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("user logged in:", user);
  } else {
    console.log("user logged out");
  }
});

const unSubAuth = onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("user logged in:", user);
  } else {
    console.log("user logged out");
  }
});

// Unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsubscribe");

unsubButton.addEventListener("click", () => {
  console.log("Unsubscribing:")
  unSubAuth();
  unsubCol();
  unsubDoc();
});
