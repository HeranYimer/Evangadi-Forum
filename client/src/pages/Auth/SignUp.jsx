import React, { useRef, useState } from "react";
import axios from "../../utils/axios";
import { Alert, Spinner } from "react-bootstrap";
import styles from "./AuthPage.module.css";
import { Link } from "react-router-dom";

function SignUp({ toggler }) {
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState();
  const [invalidFields, setInvalidFields] = useState([]);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const first_nameRef = useRef(null);
  const last_nameRef = useRef(null);
  const usernameRef = useRef(null);

  //Simple Message
  const showStatus = (message, type) => {
    setStatus({ message, type });

    //Auto clear Status after 5 secs
    setTimeout(() => {
      setStatus({ message: "", type: "" });
    }, 5000);
  };

  //Form Validation Function
  const validateForm = () => {
    const userName = usernameRef.current.value.trim();
    const firstName = first_nameRef.current.value.trim();
    const lastName = last_nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    const invalids = [];

    if (!email) invalids.push("email");
    if (!firstName) invalids.push("first_name");
    if (!lastName) invalids.push("last_name");
    if (!userName) invalids.push("username");
    if (!password || password.length < 8) invalids.push("password");

    setInvalidFields(invalids);
    if (invalids.length > 1) {
      if (invalids.includes("password")) {
        showStatus("Password must be at least 8 characters.", "error");
      } else {
        showStatus("Please fill all required fields correctly.", "error");
      }
      return false;
    }

    return true;
  };

  //Sign Up Function
  async function signup(e) {
    e.preventDefault();

    setStatus({ message: "", type: "" });
    if (!validateForm()) return;

    const userData = {
      first_name: first_nameRef.current.value.trim(),
      last_name: last_nameRef.current.value.trim(),
      username: usernameRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      password: passwordRef.current.value,
    };

    try {
      setLoading(true);

      const result = await axios.post("/auth/register", userData);
      if (result.data?.success) {
        showStatus("User registered successfully", "success");

        // Navigating to login after 1.5 seconds
        setTimeout(() => {
          setStatus({ message: "", type: "" });
          toggler(e);
        }, 1500);
      } else {
        showStatus(
          result.data?.error || "Registration failed. Please try again later."
        );
      }
    } catch (error) {
     const errorMessage =
  error.response?.data?.error ||
  "Something went wrong!";
      showStatus(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.formCard}>
      <h3>Create account</h3>
      <p className={styles.registerText}>
        Already have an account?{" "}
        <Link to="#" onClick={toggler}>
          Sign in{" "}
        </Link>
      </p>

      {status.message && (
        <Alert
          variant={status.type === "error" ? "danger" : "success"}
          className={`${styles.centeredAlert} ${
            status.type === "error" ? styles.errorColor : styles.successColor
          }`}
        >
          {status.message}
        </Alert>
      )}
   
      <form onSubmit={signup}>
        <input
          ref={emailRef}
          type="email"
          placeholder="Your Email"
          className={invalidFields.includes("email") ? styles.errorInput : ""}
        />

        <div className={styles.nameContainer}>
          <input
            ref={first_nameRef}
            type="text"
            placeholder="First Name"
            className={
              invalidFields.includes("first_name") ? styles.errorInput : ""
            }
          />
          <input
            ref={last_nameRef}
            type="text"
            placeholder="Last Name"
            className={
              invalidFields.includes("last_name") ? styles.errorInput : ""
            }
          />
        </div>

        <input
          ref={usernameRef}
          type="text"
          placeholder="Username"
          className={
            invalidFields.includes("username") ? styles.errorInput : ""
          }
        />

        <input
          ref={passwordRef}
          type="password"
          placeholder="Your Password"
          className={
            invalidFields.includes("password") ? styles.errorInput : ""
          }
        />

        {loading ? (
          <>
            <Spinner animation="border" size="sm" /> Registering...
          </>
        ) : (
          <button type="submit">Agree and Join</button>
        )}
      </form>
    </div>
  );
}

export default SignUp;
