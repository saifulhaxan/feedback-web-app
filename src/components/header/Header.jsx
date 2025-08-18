import React from "react";
import Logo from "../../assets/images/flowLogo.png";
import { FaRegUserCircle } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ProfileImage from "../../assets/images/profile.png";
import { FaRegUser } from "react-icons/fa6";
import { IoWalletOutline } from "react-icons/io5";
import { PiUsersThreeLight } from "react-icons/pi";
import { LuUsers } from "react-icons/lu";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoIosCall } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import useUserStore from "../../store/userStore";
import useTokenStore from "../../store/userToken";
import { canAccessModule, getRoleDisplayName } from "../../utils/rolePermissions";

function Header() {
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const clearUserData = useUserStore((state) => state.clearUserData);
  const userData = useUserStore((state) => state.userData);
  const clearTokens = useTokenStore((state) => state.clearTokens);
  const tokens = useTokenStore((state) => state.tokens);
  
  // Get user role for navigation
  const userRole = userData?.user?.role?.name;

  // Check if current page is part of registration flow
  const isRegistrationPage = () => {
    const registrationPaths = [
      '/',
      '/create-account',
      '/complete-profile',
      '/verify-otp',
      '/forgot-password',
      '/forgot-password-verify'
    ];
    return registrationPaths.includes(location.pathname);
  };

  // Check if user is fully authenticated (has tokens and user data)
  const isFullyAuthenticated = () => {
    return (tokens?.tokens || userData?.user) && !isRegistrationPage();
  };

  // Get user data from localStorage as fallback
  const getLocalStorageUser = () => {
    try {
      const storedUser = localStorage.getItem('userData');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error reading user data from localStorage:', error);
      return null;
    }
  };

  const localStorageUser = getLocalStorageUser();

  const toggleDrawer = (newOpen) => () => {
    console.log("🔍 toggleDrawer called with:", newOpen);
    setOpen(newOpen);
    console.log("🔍 Setting open state to:", newOpen);
  };

  const baseUrl = "https://feedbackwork.net/feedbackapi";
  const user = userData?.user;
  const imageUrl = user?.image
    ? `${baseUrl}/${user.image.replace(/^\/+/, "")}` // Remove leading slash if present
    : null;

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "";

    const parts = name.trim().split(" ").filter(Boolean); // remove empty parts
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";

    return (first + second).toUpperCase();
  };

  const handleLogout = () => {
    // Clear Zustand states
    clearUserData();
    clearTokens();

    // Clear localStorage manually if you store token separately
    localStorage.clear(); // if using Zustand persist for userData

    // Redirect to home page
    navigate("/");
  };

  return (
    <>
      <section className="header pt-4 pb-4 ">
        <nav className="navbar navbar-expand-lg ps-5 pe-5">
          <div className="container-fluid">
            <div className="logo me-5">
              <Link to="">
                <img src={Logo} alt="Logo" />
              </Link>
            </div>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {isFullyAuthenticated() ? (
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="mb-xl-0 mb-lg-0 me-5 mb-md-1 mb-sm-1 mb-2">
                    <Link to="/projects">Project</Link>
                  </li>
                  <li className="mb-xl-0 mb-lg-0 me-5 mb-md-1 mb-sm-1 mb-2">
                    <Link to="/feedback">FeedBack</Link>
                  </li>
                  <li className="mb-xl-0 mb-lg-0 me-5 mb-md-1 mb-sm-1 mb-2">
                    <Link to="/network">Network</Link>
                  </li>
                  {canAccessModule(userRole, 'groups') && (
                    <li className="mb-xl-0 mb-lg-0 me-5 mb-md-1 mb-sm-1 mb-2">
                      <Link to="/groups">Groups</Link>
                    </li>
                  )}
                  <li>
                    <Link to="/status">Status</Link>
                  </li>
                </ul>

                {(userData?.user || localStorageUser) ? (
                  <Button 
                    className="loginUser d-flex align-items-center" 
                    onClick={() => {
                      console.log("🔍 User button clicked - Opening drawer");
                      console.log("🔍 Current open state:", open);
                      toggleDrawer(true)();
                      console.log("🔍 After toggle - New open state:", !open);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <FaUserCircle className="me-2 login-icon" />
                    {(userData?.user?.firstname || localStorageUser?.firstname) ? (
                      <p className="mb-0 login-text">
                        {userData?.user?.firstname || localStorageUser?.firstname} {userData?.user?.lastname || localStorageUser?.lastname}
                      </p>
                    ) : (
                      <p className="mb-0 login-text">User</p>
                    )}
                  </Button>
                ) : (
                  <Button 
                    className="loginUser d-flex align-items-center" 
                    onClick={() => {
                      console.log("🔍 Login button clicked - Opening drawer");
                      toggleDrawer(true)();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <FaUserCircle className="me-2 login-icon" />
                  <p className="mb-0 login-text">Log in</p>
                  </Button>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </nav>
      </section>

      {isFullyAuthenticated() && (
        <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 300, px: 2 }} role="presentation" onClick={toggleDrawer(false)}>
            {console.log("🔍 Drawer render - open state:", open)}
            <div className="drawer-profile text-center py-5">
              {imageUrl ? (
                <img src={imageUrl} alt="Profile" className="profile-img" style={{ width: 48, height: 48, borderRadius: "50%" }} />
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    className="profile-initials"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#0d6efd",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    {getInitials(`${user?.firstname || ""} ${user?.lastname || ""}`)}
                  </div>
                </div>
              )}
              {(userData?.user?.firstname || localStorageUser?.firstname) ? (
                <h6 className="mb-0">
                  {userData?.user?.firstname || localStorageUser?.firstname} {userData?.user?.lastname || localStorageUser?.lastname}
                </h6>
              ) : (
                <h6 className="mb-0">User</h6>
              )}
            </div>

            <div className="drawer-account-settings mt-4 mb-4">
              <p className="mb-0">Account Settings</p>
              <ul className="px-0 mt-3 drawer-nav">
                <li className="d-flex align-items-center drawer-list-li">
                  <Link to="/my-profile">
                    <FaRegUser className="me-2" />
                    Profile
                  </Link>
                </li>
                <li className="d-flex align-items-center drawer-list-li">
                  <IoWalletOutline className="me-2" />
                  Wallet
                </li>
                <li className="d-flex align-items-center drawer-list-li">
                  <Link to="/manage-relation">
                    <PiUsersThreeLight className="me-2" />
                    {userRole === 'CHILD' ? 'My Parents' : 'My Children'}
                  </Link>
                </li>

                {canAccessModule(userRole, 'groups') && (
                  <li className="d-flex align-items-center drawer-list-li">
                    <Link to="/groups">
                      <LuUsers className="me-2" />
                      Groups
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div className="drawer-account-settings mt-4">
              <p className="mb-0">Help</p>
              <ul className="drawer-nav px-0 mt-3">
                <li className="d-flex align-items-center drawer-list-li">
                  <IoIosInformationCircleOutline className="me-2" />
                  About
                </li>
                <li className="d-flex align-items-center drawer-list-li">
                  <IoIosHelpCircleOutline className="me-2" />
                  Help
                </li>
                <li className="d-flex align-items-center drawer-list-li">
                  <IoIosCall className="me-2" />
                  Contact Us
                </li>
                <li className="d-flex align-items-center drawer-list-li">
                  <button onClick={handleLogout}>
                    <IoIosLogOut className="me-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </Box>
        </Drawer>
      )}
    </>
  );
}

export default Header;
