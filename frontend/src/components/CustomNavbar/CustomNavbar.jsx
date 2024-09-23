import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@nextui-org/react";
import Logo from "../Logo/Logo";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import navLinks from "./NavLinks";
import UserDropdown from "./UserDropdown";
import { logoutUser } from "../../utils/logoutUser";
import { UserContext } from "../../providers/UserProvider";
import moment from "moment";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";

const CustomNavbar = () => {
  const { user, setUser, refreshUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuItems = navLinks;

  const logoutHandler = () => {
    logoutUser();
    setUser(null);
  };

  const getNavLinkColor = (navLink) => {
    if (location.pathname.includes(navLink)) {
      return "text-blue-500 font-bold";
    } else {
      return "";
    }
  };

  const activityRef = collection(db, "dailyActivity");

  // Mark current day as active
  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");

    if (user?.id) {
      const activityQuery = query(
        activityRef,
        where("userId", "==", user.id),
        where("date", "==", today)
      );

      // Check if the entry exists before adding
      getDocs(activityQuery)
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            // No existing entry, proceed to add
            addDoc(activityRef, {
              date: today,
              userId: user.id,
            })
              .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });
          } else {
            // Entry already exists, handle it (optional)
            console.log("Entry already exists for this user and date.");
          }
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });
    }
  }, [user]);

  return (
    <Navbar
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      style={location.pathname === "/chat" ? { display: "none" } : null} // Hide on "/chat"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />

        <NavbarBrand>
          <Link to="/" className="flex justify-center items-center gap-2">
            <Logo />
            <p className="hidden sm:block font-bold text-inherit">
              Coders Platform
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navbar */}
      <NavbarContent className="hidden md:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.text}-${index}`}>
            <Link
              className={`${getNavLinkColor(
                item.to
              )} hover:text-blue-500 transition-all duration-300`}
              to={item.to}
            >
              {item.text}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        {!user && (
          <NavbarItem className="hidden sm:flex">
            <Link to="/auth/login">Login</Link>
          </NavbarItem>
        )}
        {!user && (
          <NavbarItem>
            <Link to="/auth/register">
              <Button color="primary" variant="flat">
                Sign Up
              </Button>
            </Link>
          </NavbarItem>
        )}
        {user && (
          <UserDropdown
            refreshUser={refreshUser}
            logoutHandler={logoutHandler}
          />
        )}
      </NavbarContent>

      {/* Mobile Sidebar */}
      <NavbarMenu className="bg-[rgba(255, 255, 255, 0.3)]">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.text}-${index}`}>
            <Link
              className={`text-white ${getNavLinkColor(item.to)}`}
              to={item.to}
            >
              {item.text}
            </Link>
          </NavbarMenuItem>
        ))}
        {!user && (
          <NavbarMenuItem>
            <Link className="text-white" to="/auth/login">
              Login
            </Link>
          </NavbarMenuItem>
        )}
        {!user && (
          <NavbarMenuItem>
            <Link className="text-white" to="/auth/register">
              Sign Up
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

export default CustomNavbar;
