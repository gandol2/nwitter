import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService } from "fbase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [nweets, setNeweets] = useState([]);

  useEffect(() => {
    const q = query(collection(dbService, "nweets"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNeweets(nweetArr);
    });
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  );
};
export default Home;
