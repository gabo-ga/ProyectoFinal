import React, { useState } from "react";
import { PersonCircle } from "react-bootstrap-icons";
import Logout from "../../components/LogoutComponent";

//icono
const ProfileIcon = ({ onClick }) => (
  <PersonCircle
    className="w-9 h-9 cursor-pointer hover:scale-110 transition-transform lg:w-10 lg:h-10"
    onClick={onClick}
  />
);

// Logout Modal
const LogoutModal = ({ onClose }) => (
  <div className="absolute right-38 top-12 lg:top-14 lg:right-44 z-50">
    <Logout onClose={onClose} />
  </div>
);

function Header() {
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileClick = () => setShowProfile(true);
  const handleLogoutClose = () => setShowProfile(false);

  return (
    <header className="h-12 lg:h-16 bg-[#1abc9c] flex items-center justify-end overflow-hidden">
      <div className="h-full flex items-center p-2">
        <ProfileIcon onClick={handleProfileClick} />
      </div>
      {showProfile && <LogoutModal onClose={handleLogoutClose} />}
    </header>
  );
}

export default Header;
