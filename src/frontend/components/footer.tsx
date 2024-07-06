import { LinkedInIcon, GithubIcon, SoundcloudIcon } from "../lib/icons";

const Footer = () => {
  return (
    <>
      <footer className="footer p-10 bg-neutral text-neutral-content">
        <aside className="order-last md:order-first">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
            <circle cx="12" cy="10" r="3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <p className="text-white font-semibold">Thibault MARTIN</p>
          <p className="text-white">Développeur Web Fullstack</p>
          <p className="currentColor font-light">
            {`© Created by Thibault MARTIN | All right reserved | 2024 / ${new Date().getFullYear().toString()}`}
          </p>
        </aside>
        <nav>
          <header className="footer-title opacity-100">Social</header>
          <div className="grid grid-flow-col gap-4">
            <a
              className={`link`}
              aria-label="Linkedin-Tib0"
              target="blank"
              href={undefined}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.electronAPI.openExternalLink(
                  "https://www.linkedin.com/in/thibault-martin-1b934083/",
                );
              }}
            >
              <LinkedInIcon />
            </a>
            <a
              className={`link`}
              aria-label="Github-Tib0"
              target="blank"
              href={undefined}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.electronAPI.openExternalLink("https://github.com/tib0");
              }}
            >
              <GithubIcon />
            </a>
            <a
              className={`link`}
              aria-label="Soundcloud-Tib0"
              target="blank"
              href={undefined}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.electronAPI.openExternalLink("https://soundcloud.com/rockinpef");
              }}
            >
              <SoundcloudIcon />
            </a>
          </div>
        </nav>
      </footer>
    </>
  );
};

export default Footer;
