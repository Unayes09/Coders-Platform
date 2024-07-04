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
import { useState } from "react";
import { Link } from "react-router-dom";
import navLinks from "./NavLinks";

const CustomNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // TODO: Add icons to the nav links
  // TODO: Give hover and active nav link effect
  const menuItems = navLinks;

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

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.text}-${index}`}>
            <Link to={item.to}>{item.text}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <Link to="/auth/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/auth/register">
            <Button color="primary" variant="flat">
              Sign Up
            </Button>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-[rgba(255, 255, 255, 0.3)]">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.text}-${index}`}>
            <Link className="text-white" to={item.to}>
              {item.text}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link className="text-white" to="/auth/login">
            Login
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="text-white" to="/auth/register">
            Sign Up
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default CustomNavbar;
