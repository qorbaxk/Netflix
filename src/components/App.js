import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { authService, dbService } from "fBase";
import React, { useEffect, useState } from "react";
import AppRouter from "./AppRouter";
import Loading from "./Loading";
import { setDoc, collection, doc, updateDoc } from "firebase/firestore";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  let basicProfile = "https://occ-0-988-395.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfMnIhIdkM8LdU5BZaYVaxoVTrMGzIjafPBzCQUwebzxeK7JKvcI7-Jm-5AituzcdJYIT_45NSkbbTwfVva-E01G9J1YVVBveA.png?r=e6e" ;

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName:
            user.displayName === null
              ? user.email.split("@")[0]
              : user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL:
            user.photoURL === null
              ? basicProfile
              : user.photoURL,
         
        });
        await setDoc(doc(dbService, "users", user.uid), userObj);
      } else {
        setIsLoggedIn(false);
      }

      setInit(true);
    });
  }, []);

  console.log("유저정보", userObj);

  //유저 프로필 업뎃시 새로고침
  const refreshUser = async() => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL === null
      ? basicProfile
      : user.photoURL,

      updateProfile: (args) =>
        updateProfile(user, {
          displayName: user.displayName,
          photoURL: user.photoURL === null
          ? basicProfile
          : user.photoURL,
        }),
    });
    // await updateDoc(doc(dbService,"users",user.uid),userObj);
    await updateDoc(doc(dbService, "users", user.uid), {
      displayName: user.displayName,
      photoURL: user.photoURL === null
      ? basicProfile
      : user.photoURL,
    });
  };

  return (
    <div>
      {init ? (
        <AppRouter
          isLoggedIn={isLoggedIn}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default App;
