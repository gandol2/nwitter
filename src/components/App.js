import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        //setUserObj(user);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
          updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
        });
      } else {
        setUserObj(null);
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    //console.log(user);
    //setUserObj(authService.currentUser);
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
    });
    //console.log(user);
  };
  //setIsLoggedIn(false); // dummy
  // console.log(authService.currentUser);
  // setInterval(() => console.log(authService.currentUser), 2000);
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj} /> : "초기화중..."}
      {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
  );
}

export default App;
