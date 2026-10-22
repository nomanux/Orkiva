import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import logo from "../../assets/brand/orkiva-logo.svg";
import searchCircle from "../../assets/dashboard/search-circle.svg";
import searchIcon from "../../assets/dashboard/search.svg";
import settingsButton from "../../assets/dashboard/settings-button.svg";
import avatar from "../../assets/dashboard/avatar-masud.png";
import chevronDown from "../../assets/dashboard/chevron-down.svg";
import { NAV_ITEMS } from "./navItems";
import { LogoutModal } from "../ui/LogoutModal";
import { NotificationsPopover } from "../overlays/NotificationsPopover";
import { SearchPopover } from "../overlays/SearchPopover";
import { useDismiss } from "../../hooks/useDismiss";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useNotifications } from "../../data/notifications";
import { shortName, signOut, useSession } from "../../data/session";
import { resetAllStores } from "../../lib/store";
import resetIcon from "../../assets/overlays/trash.svg";

export function TopBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const { profile } = useSession();
  const unread = useNotifications().filter((n) => n.unread).length;
  const menuRef = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState<"search" | "notifications" | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closePanel = useCallback(() => setPanel(null), []);
  useDismiss(panelRef, panel !== null, closePanel);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  return (
    <header className="flex items-center justify-between">
      <nav className="flex h-[54px] w-[714px] items-center rounded-[70px] bg-white pl-3">
        <Link
          to="/"
          className="flex w-[159px] items-center gap-3"
          aria-label="Orkiva home"
        >
          <img src={logo} alt="" width={40} height={40} />
          <span
            className="font-display text-[18.889px] leading-[26.444px] font-medium text-text-primary"
            style={{ fontFeatureSettings: '"calt" 0, "liga" 0' }}
          >
            Orkiva
          </span>
        </Link>
        <ul className="ml-[19px] flex gap-px">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `block rounded-[26px] px-4 py-[10px] text-[12px] leading-[1.2] font-medium tracking-[-0.36px] whitespace-nowrap text-black transition-colors ${
                    isActive ? "bg-primary" : "bg-white hover:bg-background"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-2">
        <div className="relative flex">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={panel === "search"}
            onClick={() => setPanel("search")}
            className="flex h-[54px] w-[197px] cursor-pointer items-center rounded-[70px] bg-white p-[6px] text-left"
          >
            <span className="relative size-[42px] shrink-0">
              <img src={searchCircle} alt="" width={42} height={42} />
              <img
                src={searchIcon}
                alt=""
                width={20}
                height={20}
                className="absolute top-[11px] left-[11px]"
              />
            </span>
            <span className="ml-3 text-[12px] leading-[1.2] font-medium tracking-[-0.24px] text-black/40">
              Type Client Name or ID
            </span>
          </button>
          {panel === "search" && (
            <div
              ref={panelRef}
              className="absolute top-[64.5px] right-[59px] z-50"
            >
              <SearchPopover onClose={closePanel} />
            </div>
          )}
        </div>

        <div className="relative flex">
          <button
            type="button"
            aria-label={
              unread ? `Notifications, ${unread} unread` : "Notifications"
            }
            aria-haspopup="dialog"
            aria-expanded={panel === "notifications"}
            onClick={() => setPanel("notifications")}
            className="relative size-[54px] cursor-pointer rounded-full"
          >
            <img src={settingsButton} alt="" width={54} height={54} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-error px-1 text-[11px] leading-none font-semibold text-white ring-2 ring-background">
                {unread}
              </span>
            )}
          </button>
          {panel === "notifications" && (
            <div ref={panelRef} className="absolute top-[67px] -right-px z-50">
              <NotificationsPopover onClose={closePanel} />
            </div>
          )}
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-[54px] w-[254px] cursor-pointer items-center gap-3 rounded-[70px] bg-white p-[6px] text-left"
          >
            <img
              src={avatar}
              alt=""
              width={42}
              height={42}
              className="rounded-full"
            />
            <span className="flex w-[142px] flex-col gap-1 leading-[1.2] text-black">
              <span className="truncate text-[16px] font-semibold tracking-[-0.32px]">
                {shortName(profile.name)}
              </span>
              <span className="truncate text-[12px] tracking-[-0.24px]">
                {profile.email}
              </span>
            </span>
            <img
              src={chevronDown}
              alt=""
              width={24}
              height={24}
              className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>
          {menuOpen && (
            <ul
              role="menu"
              className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-2xl bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              <li role="none">
                <Link
                  role="menuitem"
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="block px-5 py-2.5 text-[14px] font-medium hover:bg-background"
                >
                  Settings
                </Link>
              </li>
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    setResetOpen(true);
                  }}
                  className="w-full cursor-pointer px-5 py-2.5 text-left text-[14px] font-medium hover:bg-background"
                >
                  Reset demo data
                </button>
              </li>
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    setLogoutOpen(true);
                  }}
                  className="w-full cursor-pointer px-5 py-2.5 text-left text-[14px] font-medium text-error hover:bg-background"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      {panel && <div className="fixed inset-0 z-40 bg-black/20" aria-hidden />}

      <LogoutModal
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          signOut();
          navigate("/login");
        }}
      />
      <ConfirmDialog
        open={resetOpen}
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          setResetOpen(false);
          resetAllStores();
          navigate("/login");
        }}
        icon={resetIcon}
        tone="danger"
        title="Reset demo data?"
        message="Projects, tasks, meetings, chats and your profile go back to the sample data, and you’ll be signed out."
        confirmLabel="Reset"
      />
    </header>
  );
}
