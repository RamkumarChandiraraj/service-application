import React, { useState } from "react";
import { createUser } from "../../api/UserApi";
import "./SignUp.css";

// Validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateMobile = (mobile) =>
  /^[6-9]\d{9}$/.test(mobile);

/* ================= COMPONENT ================= */

const SignUp = ({ onSuccess }) => {
  const [signUpForm, setSignUpForm] = useState({
    userName: "",
    mobileNumber: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= INPUT HANDLER ================= */

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT HANDLER ================= */

  const handleSignUp = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Frontend validation
    if (!signUpForm.userName.trim())
      newErrors.userName = "Name is required";

    if (!signUpForm.email.trim())
      newErrors.email = "Email is required";
    else if (!validateEmail(signUpForm.email))
      newErrors.email = "Invalid email format";

    if (!signUpForm.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile number is required";
    else if (!validateMobile(signUpForm.mobileNumber))
      newErrors.mobileNumber = "Enter valid 10-digit mobile number";

    if (!signUpForm.password.trim())
      newErrors.password = "Password is required";
    else if (signUpForm.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      // ✅ Payload EXACTLY matching your API
      await createUser({
        userName: signUpForm.userName,
        password: signUpForm.password,
        email: signUpForm.email,
        mobileNumber: Number(signUpForm.mobileNumber), // IMPORTANT
        role: 1,
      });

      alert("User created successfully");

      setSignUpForm({
        userName: "",
        mobileNumber: "",
        email: "",
        password: "",
      });

      setErrors({});
      onSuccess(); // switch to Sign In panel
    } catch (error) {
      /* ================= BACKEND VALIDATION HANDLING ================= */

      const apiErrors = error.response?.data?.errors;

      if (apiErrors) {
        const formattedErrors = {};

        Object.keys(apiErrors).forEach((key) => {
          // Backend: UserName → Frontend: userName
          const field =
            key.charAt(0).toLowerCase() + key.slice(1);
          formattedErrors[field] = apiErrors[key][0];
        });

        setErrors(formattedErrors);
      } else {
        alert("Signup failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <form onSubmit={handleSignUp}>
      <h1>Create Account</h1>

      <input
        name="userName"
        placeholder="Full Name"
        value={signUpForm.userName}
        onChange={handleSignUpChange}
      />
      {errors.userName && (
        <small className="text-danger">{errors.userName}</small>
      )}

      <input
        name="mobileNumber"
        placeholder="Mobile Number"
        value={signUpForm.mobileNumber}
        onChange={handleSignUpChange}
      />
      {errors.mobileNumber && (
        <small className="text-danger">{errors.mobileNumber}</small>
      )}

      <input
        name="email"
        placeholder="Email"
        value={signUpForm.email}
        onChange={handleSignUpChange}
      />
      {errors.email && (
        <small className="text-danger">{errors.email}</small>
      )}

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={signUpForm.password}
        onChange={handleSignUpChange}
        autoComplete="new-password"
      />
      {errors.password && (
        <small className="text-danger">{errors.password}</small>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUp;
