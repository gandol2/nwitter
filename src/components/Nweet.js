import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewWeet] = useState(nweetObj.text);

  const docRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const onDeleteClick = () => {
    const ok = window.confirm("이 트윗을 삭제 하시겠습니까?");
    if (ok) {
      // 트윗 삭제 로직
      deleteDoc(docRef);
      if (nweetObj.attachmentUrl != "") {
        deleteObject(ref(storageService, nweetObj.attachmentUrl));
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    // 트윗 수정 로직
    await updateDoc(docRef, { text: newNweet });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewWeet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input onChange={onChange} type="text" placeholder="Edit your nweet" value={newNweet} required></input>
            <input type="submit" value="트윗 수정"></input>
          </form>
          <button onClick={toggleEditing}>취소</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <>
              <img src={nweetObj.attachmentUrl} width="50px" height="50px" alt="사진"></img>
            </>
          )}
          <div>
            <span>사용자 : {nweetObj.creatorId ? nweetObj.creatorId : "Unknow"}</span>
            <br></br>
            <span>작성시간 : {nweetObj.createdAt ? new Date(nweetObj.createdAt).toISOString() : ""}</span>
          </div>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>삭제</button>
              <button onClick={toggleEditing}>수정</button>
            </>
          )}
        </>
      )}

      <hr />
    </div>
  );
};

export default Nweet;
