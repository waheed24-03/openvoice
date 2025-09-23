import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/OpenVoice.png";
import { Home, User, Settings, LogOut, TrendingUp, Bookmark } from "lucide-react";

const Sidebar = ({ user, profile, onSignOut, onPostClick, onNavigate, currentPage }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Home size={28} />, text: "Home", page: "feed" },
    // ✅ Fix profile navigation — goes to /profile/:id
    { icon: <User size={28} />, text: "Profile", page: `profile/${user?.id}` },
    { icon: <TrendingUp size={28} />, text: "Trending", page: "trending" },
    { icon: <Bookmark size={28} />, text: "Saved", page: "saved" },
    { icon: <Settings size={28} />, text: "Settings", page: "settings" },
  ];

  return (
    <aside className="w-64 bg-primary flex flex-col p-4 border-r border-border-color h-screen sticky top-0 hidden lg:flex">
      {/* Logo */}
      <div className="w-44 h-44 mb-6 mx-auto">
        <img src={logo} alt="OpenVoice Logo" className="w-full h-full object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul>
          {menuItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <li key={item.text} className="mb-2">
                <button
                  onClick={() => {
                    onNavigate(item.page);
                    navigate(`/${item.page}`);
                  }}
                  className={`flex items-center w-full text-left p-3 rounded-full text-xl transition-colors duration-200 ${
                    isActive
                      ? "bg-accent text-black font-bold shadow-md"
                      : "text-text-primary hover:bg-secondary"
                  }`}
                >
                  {React.cloneElement(item.icon, { strokeWidth: isActive ? 3 : 2 })}
                  <span className="ml-4">{item.text}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Post Button */}
        <div className="px-3 mt-6">
          <button
            onClick={onPostClick}
            className="w-full bg-accent text-primary font-bold text-lg rounded-full py-3 hover:bg-yellow-500 transition-colors duration-200"
            style={{ marginLeft: "-10px" }}
          >
            Post
          </button>
        </div>
      </nav>

      {/* ✅ Profile Shortcut */}
      <div className="mt-auto border-t border-border-color pt-4">
        <button
          onClick={() => navigate(`/profile/${user.id}`)}
          className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg transition w-full"
        >
          <img
            src={profile?.avatar_url || "https://via.placeholder.com/50"}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">{profile?.username || "Profile"}</span>
        </button>

        {/* Logout */}
        <button
          onClick={onSignOut}
          className="flex items-center w-full text-left p-3 rounded-full text-lg text-text-primary hover:bg-secondary transition-colors duration-200 mt-3"
        >
          <LogOut />
          <span className="ml-4 font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
