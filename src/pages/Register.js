import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
 
function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [allCompanies, setAllCompanies] = useState([]);
 
useEffect(() => {
  fetch(`https://tracking-backend-admin.vercel.app/v1/auth/companyList?sortBy=createdAt&order=desc`)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data.companyList)) {
              // const names = data.companyList.map((company) => company.name);
        // Map names and remove duplicates using Set
        const uniqueNames = [
          ...new Set(data.companyList.map((company) => company.name.trim()))
        ];
        setAllCompanies(uniqueNames);
      } else {
        console.error("Invalid company list structure:", data);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch companies:", error);
    });
}, []);


  const passReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      companyName: "",
      roleType: "subAdmin", // fixed value, change if you want admin
    },
    onSubmit: (values) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        companyName: values.companyName,
        roleType: values.roleType,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const registerUrl =
        "https://tracking-backend-admin.vercel.app/v1/subAdmin/registerSubAdmin";

      fetch(registerUrl, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.success === true) {
            alert("Registration successful! Please login.");
            navigate("/login");
          } else {
            alert("Registration failed: " + (result.message || "Unknown error"));
          }
        })
        .catch((error) => {
          console.error(error);
          alert("An error occurred. Please try again.");
        });
    },

    validationSchema: yup.object({
      fullName: yup.string().required("Full name is required"),
      email: yup
        .string()
        .required("Email is required")
        .email("Invalid email")
        .matches(emailReg, "Email is invalid"),
      password: yup
        .string()
        .required("Password is required")
        .matches(
          passReg,
          "Password must be minimum 7 characters, include letters, numbers and special characters"
        ),
      phoneNumber: yup
        .string()
        .required("Phone number is required")
        .matches(/^\+?\d{7,15}$/, "Phone number is invalid"),
      companyName: yup.string().required("Company name is required"),
      roleType: yup.string().required("Role type is required"),
    }),
  });

  return (
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 px-2 sm:px-4">
  <div className="w-full max-w-3xl bg-gray-100 rounded-xl shadow-lg p-4 sm:p-8">
    <form
      onSubmit={formik.handleSubmit}
      className="w-full"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        Register
      </h2>

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            name="fullName"
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.fullName && formik.touched.fullName && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.fullName}</div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            placeholder="Type your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && formik.touched.email && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block mb-1 font-medium">Password</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Type your password"
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div
            className="absolute top-10 right-3 text-gray-600 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
          {formik.errors.password && formik.touched.password && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            name="phoneNumber"
            placeholder="Enter your phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.phoneNumber && formik.touched.phoneNumber && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block mb-1 font-medium">Company Name</label>
          <select
            name="companyName"
            value={formik.values.companyName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
          >
            <option value="">Select a company</option>
            {allCompanies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
          {formik.errors.companyName && formik.touched.companyName && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.companyName}</div>
          )}
        </div>

        {/* Hidden Role */}
        <input type="hidden" name="roleType" value="subAdmin" />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-gray-900 text-white font-semibold text-lg transition duration-300 hover:opacity-90"
        >
          REGISTER
        </button>

        {/* Link to Login */}
        <div className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 font-medium hover:underline">
            Login here
          </a>
        </div>

        {/* Terms & Policy */}
        <div className="text-center mt-2 text-xs text-gray-500 space-x-4">
          <a href="#!" className="hover:underline">
            Terms of use
          </a>
          <a href="#!" className="hover:underline">
            Privacy policy
          </a>
        </div>
      </div>
    </form>
  </div>
</div>

  );
}

export default Register;
