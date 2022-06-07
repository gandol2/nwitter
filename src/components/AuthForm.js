import { authService } from "fbase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";

const AuthForm = () => {
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
      if (newAccount) {
        // 계정생성
        await createUserWithEmailAndPassword(authService, email, password);
      } else {
        // 로그인
        await signInWithEmailAndPassword(authService, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input className="authInput" name="email" type="text" placeholder="email" value={email} onChange={onChange}></input>
        <input className="authInput" name="password" type="password" placeholder="password" value={password} onChange={onChange}></input>
        <input className="authInput authSubmit" type="submit" value={newAccount ? "가입" : "로그인"}></input>
        {error && <span className="authError">{error}</span>}
      </form>
      <span className="authSwitch" onClick={toggleAccount}>
        {newAccount ? "로그인" : "가입"}
      </span>
    </>
  );
};

export default AuthForm;
