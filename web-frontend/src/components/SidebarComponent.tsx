import { useEffect, useState } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { BsClipboardData } from "react-icons/bs";
import { FaUsers } from "react-icons/fa6";
import { GiPublicSpeaker } from "react-icons/gi";
import { HiChartPie, HiSpeakerphone } from "react-icons/hi";
import { IoSettings } from "react-icons/io5";
import { MdOutlineOutput, MdShield } from "react-icons/md";
import { SiHiveBlockchain } from "react-icons/si";
import { VscRepoPull } from "react-icons/vsc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/data_types";
import BlockchainIcon from "../assets/blockchain_icon.svg";
import personPlaceholder from "../assets/person.png";

function SideBarComponent() {
  const { authState, onLogOut, imageList } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [url, setUrl] = useState<string | undefined>(undefined);

  const onLogOutUser = () => {
    onLogOut?.();
    navigate("/");
  };

  useEffect(() => {
    if (!authState?.name) return;
    const userPhotoName = authState.name.toLowerCase().split(" ").join(".");
    if (imageList?.[userPhotoName]) {
      setUrl(imageList[userPhotoName]);
    }
  }, [authState, imageList]);

  const navItems = [
    { to: "dashboard", icon: <HiChartPie className="w-5 h-5" />, label: "Dashboard" },
    { to: "announce-election", icon: <HiSpeakerphone className="w-5 h-5" />, label: "Announce Election" },
    { to: "candidates", icon: <FaUsers className="w-5 h-5" />, label: "Candidates" },
    { to: "voters", icon: <BsClipboardData className="w-5 h-5" />, label: "Voters" },
    { to: "population-data", icon: <VscRepoPull className="w-5 h-5" />, label: "Population Data" },
    { to: "election-results", icon: <MdOutlineOutput className="w-5 h-5" />, label: "Election Results" },
    { to: "public-announcement", icon: <GiPublicSpeaker className="w-5 h-5" />, label: "Public Announcement" },
    { to: "blockchain", icon: <SiHiveBlockchain className="w-5 h-5" />, label: "Blockchain" },
  ];

  const isActive = (to: string) => location.pathname.includes(to);

  return (
    <aside
      className="flex flex-col left-0 top-0 w-60 h-screen fixed bg-gray-950 border-r border-white/5 shadow-xl z-40"
      aria-label="Sidebar"
    >
      {/* Brand */}
      <div className="px-4 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30 flex-shrink-0">
            <MdShield className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white tracking-tight leading-none">
              Quantum<span className="text-red-500">Ballot</span>
            </span>
            <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">
              Election 2027
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {navItems.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive(to)
                ? "bg-red-600/15 text-red-400 border border-red-600/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >
            <span className={isActive(to) ? "text-red-400" : "text-gray-500"}>{icon}</span>
            <span>{label}</span>
            {isActive(to) && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400" />
            )}
          </Link>
        ))}

        {authState?.authenticated && authState?.role === Role.ADMIN.toString() && (
          <Link
            to="user"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive("user")
                ? "bg-red-600/15 text-red-400 border border-red-600/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >
            <HiChartPie className={`w-5 h-5 ${isActive("user") ? "text-red-400" : "text-gray-500"}`} />
            <span>User Management</span>
            {isActive("user") && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400" />}
          </Link>
        )}
      </nav>

      {/* Dark mode toggle (disabled) */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Dark Mode</span>
          <div className="relative">
            <div className="w-10 h-5 bg-gray-800 rounded-full border border-white/10 opacity-50 cursor-not-allowed" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* Blockchain icon */}
      <div className="flex justify-center px-4 py-3">
        <img src={BlockchainIcon} width={100} alt="Blockchain" className="opacity-30" />
      </div>

      {/* Profile section */}
      <div className="px-3 py-3 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3 mb-3 px-1">
          <img
            src={url ?? personPlaceholder}
            alt={authState?.name ?? "User"}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {authState?.name ?? "Unknown user"}
            </p>
            <p className="text-xs text-gray-500 truncate capitalize">
              {authState?.role === "0" || authState?.role?.toString() === Role.ADMIN.toString()
                ? "Administrator"
                : "Standard account"}
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={onLogOutUser}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-400
              hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-all"
          >
            <BiLogOutCircle className="w-4 h-4" />
            Log out
          </button>
          <Link
            to="edit-account"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-400
              hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <IoSettings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default SideBarComponent;
