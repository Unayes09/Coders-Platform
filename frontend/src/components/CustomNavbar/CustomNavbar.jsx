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
import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import navLinks from "./NavLinks";
import UserDropdown from "./UserDropdown";
import { logoutUser } from "../../utils/logoutUser";
import { UserContext } from "../../providers/UserProvider";

const CustomNavbar = () => {
  const { user, setUser, refreshUser } = useContext(UserContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();

  console.log(location.pathname);

  const menuItems = navLinks;

  // TODO: Add icons to the nav links
  // TODO: Give hover and active nav link effect
  // TODO: Active nav link styles

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

  return (
    <Navbar isBordered onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />

        <NavbarBrand>
          <Link to="/" className="flex justify-center items-center gap-2">
            <Logo />
            <p className="hidden sm:block font-bold text-inherit">
              Coders{"'"} Platform
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
