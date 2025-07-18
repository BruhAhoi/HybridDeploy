import React, { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import LoginImg from "../assets/LoginImg.jpg";
import Logo from "../assets/whitecat_logo2.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { Login, LoginGoggle, StudentSignUp, TeacherSignUp, } from '../services/userService';
import { fetchUserProfile } from '../services/authService';
import { setUserRedux } from '../store/userSlice';
import { toast } from 'react-toastify';
import { GoogleLogin, CredentialResponse, GoogleOAuthProvider } from '@react-oauth/google';
import "react-toastify/dist/ReactToastify.css";
import { User } from '../types';
// import { jwtDecode } from "jwt-decode";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAdditionalForm, setShowAdditionalForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [birthYear, setBirthYear] = useState<number>();
  const [role, setRole] = useState('2'); // Mặc định là "student" với giá trị 2
  const [userId, setUserId] = useState(''); // Lưu userId từ LoginGoggle
  // const [pendingToken, setPendingToken] = useState<string | null>(null);   // token từ Google
  // const [roleModalOpen, setRoleModalOpen] = useState(false);
  // const [isLoginGoogle, setIsLoginGoogle] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>();

  const handleGoogleLoginWithRole = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    if (!role) {
      toast.error("Vui lòng chọn vai trò trước khi tiếp tục");
      return;
    }

    try {
      const body = {
        token: credentialResponse.credential,
        roleId: role,
      };

      const userData = await LoginGoggle(body);
      if (!userData || !userData.userId) {
        toast.error("Đăng nhập thất bại hoặc không tìm thấy userId");
        return;
      }

      const isTeacher = role === "3";
      const profile = await fetchUserProfile(userData.userId, isTeacher);

      const completeUserData = { ...userData, roleId: role };
      // localStorage.setItem("refreshToken", completeUserData.accessToken); 
      dispatch(setUserRedux(completeUserData));
      Cookies.set("user", JSON.stringify(completeUserData), { expires: 7 });
      setUserId(userData.userId);
      setUserData(completeUserData);

      if (!profile) {
        toast.info("Vui lòng hoàn tất thông tin cá nhân");
        setShowAdditionalForm(true);
      } else {
        toast.success("Đăng nhập thành công");
        navigate(isTeacher ? "/" : "/student");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Lỗi khi đăng nhập bằng Google");
    }
  };


  const handleSaveAdditionalInfo = async () => {
    if (!fullName || !address || !phone || !birthYear) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      if (!userId) {
        toast.error("Không tìm thấy userId");
        return;
      }

      // Chuẩn bị dữ liệu cho StudentSignUp hoặc TeacherSignUp
      const additionalData = {
        userId,
        fullName,
        address,
        phone,
        yearOfBirth: birthYear,
      };

      // Gọi API phù hợp dựa trên role
      if (userData?.roleId === '2') {
        const result = await StudentSignUp(additionalData);
        if (result) {
          navigate("/student");
        }

      } else if (userData?.roleId === '3') {
        const result = await TeacherSignUp(additionalData);
        if (result) {
          navigate("/");
        }
      }

      toast.success("Thông tin đã được lưu");
    } catch (error) {
      console.error('Save additional info error:', error);
      toast.error("Lưu thông tin thất bại");
    }
  };

  const handleLoginClick = async () => {
    // setIsLoginGoogle(false)
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const userData = await Login(email, password);
      if(userData?.roleId==="1"){
        navigate("/admin")
      }else if(userData?.roleId==="2"){
        navigate("/student");
      }
      else if(userData?.roleId==="3"){
        navigate("/");
      }
      if (userData) {
        setUserData(userData)
        dispatch(setUserRedux(userData));
        Cookies.set('user', JSON.stringify(userData), { expires: 7 });
        // localStorage.setItem("refreshToken", userData.refreshToken); 

        toast.success("Đăng nhập thành công");
      } else {
        toast.error("Đăng nhập thất bại");
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="625215731823-40khf1hvn3ola95ud9qcpkt5hpraq4eg.apps.googleusercontent.com">
      <div className="min-h-screen bg-[#033f9f] flex flex-col">
        {/* Header */}
        <Link to="/" className="bg-white py-4 px-8 mb-10 flex items-center shadow-md">
          <img src={Logo} alt="Logo" className="h-8 mr-2" />
        </Link>

        {/* Login box or Additional Form */}
        <div className="flex-grow flex justify-center items-center">
          {!showAdditionalForm ? (
            <div className="bg-gradient-to-r from-[#c7a7f8] to-blue-500 p-0.5 rounded-[30px] w-[800px] h-[450px] flex overflow-hidden">
              {/* Left - image */}
              <img src={LoginImg} className="flex-1 bg-gray-200 m-6 rounded-xl" />

              {/* Right - login form */}
              <div className="flex-1 bg-white m-6 rounded-xl flex flex-col items-center justify-center px-6">
                <img src={Logo} alt="Logo" className="h-16 mb-2" />

                {/* Email input */}
                <div className="w-full flex items-center border-b border-gray-300 py-2 mb-4">
                  <FiMail className="text-gray-400 mr-2 text-lg" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 focus:outline-none text-sm"
                  />
                </div>

                {/* Password input */}
                <div className="w-full flex items-center border-b border-gray-300 py-2 mb-2">
                  <FiLock className="text-gray-400 mr-2 text-lg" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 focus:outline-none text-sm"
                  />
                </div>

                {/* Links */}
                <div className="flex justify-between w-full text-sm mb-4 text-blue-600">
                  <a href="/forgot-password" className="hover:underline">Forgot Password?</a>
                  <a href="/sign-up" className="hover:underline">Not have account yet?</a>
                </div>

                {/* Login button */}
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="bg-[#3d6fc2] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
                >
                  Login
                </button>

                <div className="my-4 text-gray-500 text-sm">Or Login with</div>

                {/* Social login */}
                <div className="flex gap-4">
                  <div className="bg-white shadow hover:shadow-md transition">
                    <GoogleLogin
                      useOneTap
                      onSuccess={handleGoogleLoginWithRole}
                      onError={() => console.log('Login Failed')}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-md w-[400px]">
              <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Profile</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Birth Year</label>
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                >
                  <option value="2">Student</option>
                  <option value="3">Teacher</option>
                </select>
              </div>
              <button
                onClick={handleSaveAdditionalInfo}
                className="w-full bg-[#3d6fc2] text-white p-2 rounded-full hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;