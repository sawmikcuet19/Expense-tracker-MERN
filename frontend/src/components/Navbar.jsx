import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, 
  ChevronDown, 
  LogOut, 
  Bell
} from "lucide-react";
import { navbarStyles } from "../assets/dummyStyles";

const Navbar = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        <div className={navbarStyles.logoContainer} onClick={() => navigate("/")}>
          <span className={navbarStyles.logoText}>Expense Tracker</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className={navbarStyles.userContainer} ref={menuRef}>
            <button 
              className={navbarStyles.userButton}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className={navbarStyles.userAvatar}>
                {getInitials(user?.name)}
              </div>
              <div className={navbarStyles.userTextContainer}>
                <p className={navbarStyles.userName}>{user?.name || "User"}</p>
                <p className={navbarStyles.userEmail}>{user?.email || "user@example.com"}</p>
              </div>
              <ChevronDown className={navbarStyles.chevronIcon(menuOpen)} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  className={navbarStyles.dropdownMenu}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className={navbarStyles.dropdownHeader}>
                    <div className="flex items-center gap-3">
                      <div className={navbarStyles.dropdownAvatar}>
                        {getInitials(user?.name)}
                      </div>
                      <div>
                        <p className={navbarStyles.dropdownName}>{user?.name || "User"}</p>
                        <p className={navbarStyles.dropdownEmail}>{user?.email || "user@example.com"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={navbarStyles.menuItemContainer}>
                    <button 
                      onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                      className={navbarStyles.menuItem}
                    >
                      <UserIcon size={18} /> Profile Settings
                    </button>
                  </div>
                  
                  <div className={navbarStyles.menuItemBorder}>
                    <button 
                      onClick={onLogout}
                      className={navbarStyles.logoutButton}
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;