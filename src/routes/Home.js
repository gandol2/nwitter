import Nweet from "components/Nweet";
import { dbService, storageService } from "fbase";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

//export default () => <span>Hone</span>;
const Home = ({ userObj }) => {
  //   console.log(userObj);
  const [nweet, setNweet] = useState("");
  const [nweets, setNeweets] = useState([]);
  const [attachment, setAttachment] = useState();
  const fileInput = useRef("dd");
  /*
  // old code
  const getNweets = async () => {
    const dbNweets = await getDocs(collection(dbService, "nweets")); // [READ] firestore에서 document 획득
    dbNweets.forEach((doc) => {
      const nweetObj = {
        ...doc.data(),
        id: doc.id,
      };
      setNeweets((prev) => [nweetObj, ...prev]);
    });
  };
  */
  useEffect(() => {
    // getNweets();
    const q = query(collection(dbService, "nweets"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNeweets(nweetArr);
      console.log(nweetArr);
    });
    // onSnapshot(query(dbService, "nweets"), (snapshot) => {});
  }, []);

  /**
   * 새 트윗을 작성
   * @param {*} event
   */
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment != "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(attachmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbService, "nweets"), nweetObj);
    setNweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const selectedFile = files[0];
    console.log(selectedFile);
    const reader = new FileReader();
    // 파일 로딩 완료 이벤트
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      //console.log(result);
      setAttachment(result);
    };
    reader.readAsDataURL(selectedFile);
  };
  //   console.log(nweets);

  const onClearPhotoClick = () => {
    fileInput.current.value = "";
    setAttachment();
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="What's on your mind?" maxLength={120} value={nweet} onChange={onChange} />
        <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput}></input>
        <input type="submit" value="Nweet" />
        {attachment && (
          <>
            <div>
              <img src={attachment} width="50px" height="50px" alt="프로필 이미지"></img>
              <button onClick={onClearPhotoClick}>이미지 삭제</button>
            </div>
          </>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  );
};
export default Home;
