import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getMyNweets = async () => {
    const q = query(collection(dbService, "nweets"), where("creatorId", "==", userObj.uid), orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);

    var nweetsArr = querySnapshot.docs.map((doc) => doc.data());
    //console.log(nweetsArr);
  };
  useEffect(() => {
    getMyNweets();
  });

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
    //console.log(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      //console.log(userObj.updateProfile);
      await updateProfile(authService.currentUser, { displayName: newDisplayName });
      refreshUser();
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input className="formInput" autoFocus onChange={onChange} type="text" placeholder="이름을 입력하세요" value={newDisplayName} />
        <input
          type="submit"
          value="프로필 업데이트"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        로그아웃
      </span>
    </div>
  );
};

export default Profile;
