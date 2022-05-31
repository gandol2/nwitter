import { authService } from "fbase";
import { createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";

//export default () => <span>Auth</span>;
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        // 계정생성
        data = await createUserWithEmailAndPassword(authService, email, password);
      } else {
        // 로그인
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="email" type="text" placeholder="email" value={email} onChange={onChange}></input>
        <input name="password" type="password" placeholder="password" value={password} onChange={onChange}></input>
        <input type="submit" value={newAccount ? "가입" : "로그인"}></input>
        {error}
      </form>
      <span onClick={toggleAccount}>{newAccount ? "로그인" : "가입"}</span>
      <div>
        <button onClick={onSocialClick} name="google">
          Google 로그인
        </button>
        <button onClick={onSocialClick} name="github">
          GitHub 로그인
        </button>
      </div>
    </div>
  );
};
export default Auth;
