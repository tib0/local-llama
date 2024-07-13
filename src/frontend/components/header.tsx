import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "../lib/icons";
import usePersistentStorageValue from "../hooks/usePersistentStorageValue";
import { useThemeDetect } from "../hooks/useThemeDetect";
import { Link } from "react-router-dom";

const Header = () => {
  const isDarkThemeByDefault = useThemeDetect();
  const [localTheme, setLocalTheme] = usePersistentStorageValue(
    "theme",
    isDarkThemeByDefault ? "dracula" : "lemonade",
  );

  useEffect(() => {
    if (document) {
      document.querySelector("#index")?.setAttribute("data-theme", localTheme);
    }
  }, [localTheme]);
  const [smMenuVisibile, setSmMenuVisibile] = useState(false as boolean);

  const menuLink = (src: string) => (
    <>
      <li key={"dbChat" + src}>
        <Link
          key="dbChat"
          className={`
            mx-2 font-light text-lg
          `}
          to="/chat"
        >
          Chat
        </Link>
      </li>
      <li key={"aboutLink" + src}>
        <Link
          key="aboutLink"
          className={`
            mx-2 font-light text-lg
          `}
          to="/about"
        >
          About
        </Link>
      </li>
      <li key={"quitLink" + src}>
        <a
          key="quitLink"
          className={`
            mx-2 font-light text-lg hover:cursor-pointer
          `}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.electronAPI.quitApp();
          }}
        >
          Quit
        </a>
      </li>
    </>
  );

  const themeSwap = (
    <>
      <input
        name="theme-input-controller"
        aria-label="theme-input-controller"
        type="checkbox"
        className={`theme-controller`}
        value={localTheme}
        onClick={() => setLocalTheme(localTheme == "dracula" ? "lemonade" : "dracula")}
      />
      <MoonIcon />
      <SunIcon />
    </>
  );

  return (
    <>
      <div className="drag-window font-customNavbar navbar p-4 bg-base-100 text-base-content fixed top-0 z-30 flex h-9 md:justify-center bg-opacity-30 backdrop-blur-lg transition-shadow shadow-lg">
        <div className="navbar-start">
          <div className="dropdown shadow-2xl rounded-lg">
            <div
              tabIndex={0}
              onClick={() => setSmMenuVisibile(true)}
              role="button"
              className="btn btn-sm btn-ghost md:hidden not-drag-window"
              aria-label="Menu"
              title="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            {/* MOBILE */}
            <ul
              id="mobileMenu"
              key="mobileMenu"
              onClick={() => setSmMenuVisibile(!smMenuVisibile)}
              tabIndex={0}
              className={`${!smMenuVisibile && "hidden"} menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box transition-shadow w-64 not-drag-windo`}
            >
              {menuLink("MOBILE")}
            </ul>
          </div>
          <Link
            className={`font-black text-2xl text-primary p-3 not-drag-window`}
            key="homeChatLink"
            to="/"
          >
            L³
          </Link>
          {/* MOBILE */}
          <label
            className="swap swap-rotate md:hidden p-2 not-drag-window"
            aria-label="Swap-theme"
          >
            {themeSwap}
          </label>
        </div>
        <div className="navbar-center hidden md:flex">
          {/* DESKTOP */}
          <ul id="desktopMenu" className="menu-horizontal px-1 not-drag-window">
            {menuLink("DESKTOP")}
          </ul>
        </div>
        <div className="navbar-end hidden md:flex pr-1 not-drag-window">
          {/* DESKTOP */}
          <label aria-label="Swap theme" className="swap swap-rotate px-2">
            {themeSwap}
          </label>
        </div>
      </div>
    </>
  );
};

export default Header;
