import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  ArrowUp, 
  ArrowDown, 
  User, 
  ChevronDown, 
  LogOut, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { sidebarStyles, cn } from "../assets/dummyStyles";

const MENU_ITEMS = [
  { text: "Dashboard", path: "/", icon: <Home size={20} /> },
  { text: "Income", path: "/income", icon: <ArrowUp size={20} /> },
  { text: "Expenses", path: "/expense", icon: <ArrowDown size={20} /> },
  { text: "Profile", path: "/profile", icon: <User size={20} /> },
];

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto" };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const renderMenuItem = ({ text, path, icon }) => {
    const isActive = pathname === path || (path === "/" && pathname === "/dashboard");
    return (
      <motion.li key={text} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to={path}
          className={cn(
            sidebarStyles.menuItem.base,
            isActive ? sidebarStyles.menuItem.active : sidebarStyles.menuItem.inactive,
            isCollapsed ? sidebarStyles.menuItem.collapsed : sidebarStyles.menuItem.expanded
          )}
          onMouseEnter={() => setActiveHover(text)}
          onMouseLeave={() => setActiveHover(null)}
        >
          <span className={isActive ? sidebarStyles.menuIcon.active : sidebarStyles.menuIcon.inactive}>
            {icon}
          </span>
          {!isCollapsed && (
            <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              {text}
            </motion.span>
          )}
          {isActive && !isCollapsed && (
            <span className={sidebarStyles.activeIndicator}></span>
          )}
        </Link>
      </motion.li>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          sidebarStyles.sidebarContainer.base,
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className={sidebarStyles.sidebarInner.base}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={sidebarStyles.toggleButton.base}
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points={isCollapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"}></polyline>
              </svg>
          </button>

          <nav className="flex-1 mt-6">
            <ul className={sidebarStyles.menuList.base}>
              {MENU_ITEMS.map(renderMenuItem)}
            </ul>
          </nav>

          <div className={cn(
            sidebarStyles.footerContainer.base,
            isCollapsed ? sidebarStyles.footerContainer.collapsed : sidebarStyles.footerContainer.expanded
          )}>
            <button className={cn(
              sidebarStyles.logoutButton.base,
              isCollapsed ? sidebarStyles.logoutButton.collapsed : ""
            )}>
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Trigger */}
      <button 
        onClick={() => setMobileOpen(true)}
        className={sidebarStyles.mobileMenuButton}
      >
        <Menu size={24} />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={sidebarStyles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className={sidebarStyles.mobileBackdrop}
              onClick={() => setMobileOpen(false)}
            />
            
            <motion.div
              ref={sidebarRef}
              className={sidebarStyles.mobileSidebar.base}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className={sidebarStyles.mobileHeader}>
                 <h2 className="text-xl font-bold">Menu</h2>
                 <button onClick={() => setMobileOpen(false)} className={sidebarStyles.mobileCloseButton}>
                   <X size={24} />
                 </button>
              </div>
              <nav className="p-4">
                <ul className={sidebarStyles.mobileMenuList}>
                    {MENU_ITEMS.map(({ text, path, icon }) => (
                      <motion.li key={text} whileTap={{ scale: 0.98 }}>
                        <Link
                          to={path}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            sidebarStyles.mobileMenuItem.base,
                            pathname === path 
                              ? sidebarStyles.mobileMenuItem.active 
                              : sidebarStyles.mobileMenuItem.inactive
                          )}
                        >
                          <span className={pathname === path ? sidebarStyles.menuIcon.active : sidebarStyles.menuIcon.inactive}>
                            {icon}
                          </span>
                          <span>{text}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
