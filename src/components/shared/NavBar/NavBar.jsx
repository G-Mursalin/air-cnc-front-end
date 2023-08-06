import React from "react";
import Container from "../Container/Container";
import Logo from "./Logo";
import Search from "./Search";
import MenuDropdown from "./MenuDropdown";

const NavBar = () => {
  return (
    <nav className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Logo />
            <Search />
            <MenuDropdown />
          </div>
        </Container>
      </div>
    </nav>
  );
};

export default NavBar;
