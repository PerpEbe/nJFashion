import React from "react";
import "./CSS/LoginSignup.css";
import { useState } from "react";
// import {setState} from 'react-route-dom'
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Signup function: register user and save their details in Firestore
  const signup = async () => {
    console.log("Signup function executed", formData);

    try {
      //create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      //save additional user info in firestore
      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      // alert("Signup successful! Redirecting...");
      window.location.replace("/");
    } catch (error) {
      console.error("Signup error: ", error);
      alert("Error signing up. please try again");
    }
  };

  // Login function: authenticate user and retrieve their data from Firestore
  const login = async () => {
    console.log("Login function executed", formData);
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Retrieve user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log("User data:", userDoc.data());
        localStorage.setItem("auth-token", user.uid); // Store user ID as token
        toast.success("Login successful!");
        window.location.replace("/");
      } else {
        alert("User not found.");
      }
    } catch (error) {
      console.error("Login error:", error);
      // alert("Error logging in. Please try again.");
      toast.error("Your credentials are incorrect!");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Name"
            />
          ) : (
            <></>
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
        </div>
        <button
          onClick={() => {
            state === "Login" ? login() : signup();
          }}
        >
          Continue
        </button>
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span
              onClick={() => {
                setState("Login");
              }}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span
              onClick={() => {
                setState("Sign Up");
              }}
            >
              Click here
            </span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default LoginSignup;
