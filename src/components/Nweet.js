import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input className="formInput" autoFocus onChange={onChange} type="text" placeholder="Edit your nweet" value={newNweet} required></input>
            <input className="formBtn" type="submit" value="트윗 수정"></input>
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            취소
          </button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} alt="사진" />}
          {/* <div>
            <span>사용자 : {nweetObj.creatorId ? nweetObj.creatorId : "Unknow"}</span>
            <br></br>
            <span>작성시간 : {nweetObj.createdAt ? new Date(nweetObj.createdAt).toISOString() : ""}</span>
          </div> */}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}

      <hr />
    </div>
  );
};

export default Nweet;
