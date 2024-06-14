import React from "react";

export const EyeClosedIcon = ({
  classname = "swap-on fill-current w-8 h-8",
}: {
  classname?: string | undefined;
}) => (
  <svg
    name="eyeclosed-icon"
    className={classname}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      d="M4 10C4 10 5.6 15 12 15M12 15C18.4 15 20 10 20 10M12 15V18M18 17L16 14.5M6 17L8 14.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M4 10C4 10 5.6 15 12 15M12 15C18.4 15 20 10 20 10M12 15V18M18 17L16 14.5M6 17L8 14.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);
export const EyeOpenIcon = ({
  classname = "swap-off fill-current w-8 h-8",
  strokeColor = "currentColor",
  strokeWidth = "1.8",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
  strokeWidth?: string | undefined;
}) => (
  <svg
    name="eyeopen-icon"
    className={classname}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke={strokeColor}
    strokeWidth={strokeWidth}
  >
    <path
      d="M4 12C4 12 5.6 7 12 7M12 7C18.4 7 20 12 20 12M12 7V4M18 5L16 7.5M6 5L8 7.5M15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13Z"
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

export const SunIcon = ({
  classname = "swap-on fill-current w-5 h-5",
}: {
  classname?: string | undefined;
}) => (
  <svg
    name="sun-icon"
    className={classname}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    stroke="currentColor"
  >
    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
  </svg>
);
export const MoonIcon = ({
  classname = "swap-off fill-current w-5 h-5",
}: {
  classname?: string | undefined;
}) => (
  <svg
    name="moon-icon"
    className={classname}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    stroke="currentColor"
  >
    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
  </svg>
);

export const CreatedAtIcon = ({
  classname = "mr-1",
  width = "24",
  height = "24",
}: {
  classname?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    className={classname}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.75 3V5.25M17.25 3V5.25M3 18.75V7.5C3 6.25736 4.00736 5.25 5.25 5.25H18.75C19.9926 5.25 21 6.25736 21 7.5V18.75M3 18.75C3 19.9926 4.00736 21 5.25 21H18.75C19.9926 21 21 19.9926 21 18.75M3 18.75V11.25C3 10.0074 4.00736 9 5.25 9H18.75C19.9926 9 21 10.0074 21 11.25V18.75"
      stroke="oklch(var(--bc))"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UpdatedAtIcon = ({
  classname = "mr-1",
  width = "24",
  height = "24",
}: {
  classname?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    className={classname}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.8617 4.48667L18.5492 2.79917C19.2814 2.06694 20.4686 2.06694 21.2008 2.79917C21.9331 3.53141 21.9331 4.71859 21.2008 5.45083L10.5822 16.0695C10.0535 16.5981 9.40144 16.9868 8.68489 17.2002L6 18L6.79978 15.3151C7.01323 14.5986 7.40185 13.9465 7.93052 13.4178L16.8617 4.48667ZM16.8617 4.48667L19.5 7.12499M18 14V18.75C18 19.9926 16.9926 21 15.75 21H5.25C4.00736 21 3 19.9926 3 18.75V8.24999C3 7.00735 4.00736 5.99999 5.25 5.99999H10"
      stroke="oklch(var(--bc))"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const InfoIcon = ({
  classname = "w-4 h-4",
  strokeColor = "oklch(var(--p))",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className={classname}
  >
    <path
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

export const CheckIcon = ({
  classname = "w-6 h-6",
  strokeColor = "oklch(var(--su))",
  width = "1.2rem",
  height = "1.2rem",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    width={width}
    height={height}
    stroke={strokeColor}
    className={classname}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

export const PreviousIcon = ({
  classname = "",
  strokeColor = "oklch(var(--bc))",
  width = "1.2rem",
  height = "1.2rem",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    width={width}
    height={height}
    stroke={strokeColor}
    className={classname}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

export const NextIcon = ({
  classname = "",
  strokeColor = "oklch(var(--bc))",
  width = "1.2rem",
  height = "1.2rem",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    width={width}
    height={height}
    stroke={strokeColor}
    className={classname}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

export const BackwardIcon = ({
  classname = "",
  strokeColor = "oklch(var(--bc))",
  width = "1.2rem",
  height = "1.2rem",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    width={width}
    height={height}
    stroke={strokeColor}
    className={classname}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
    />
  </svg>
);

export const ForwardIcon = ({
  classname = "",
  strokeColor = "oklch(var(--bc))",
  width = "1.2rem",
  height = "1.2rem",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    width={width}
    height={height}
    stroke={strokeColor}
    className={classname}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
    />
  </svg>
);

export const PlayIcon = ({
  classname = "",
  strokeColor = "oklch(var(--bc))",
  width = "2rem",
  height = "2rem",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    width={width}
    height={height}
    stroke={strokeColor}
    className={classname}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
    />
  </svg>
);

export const PauseIcon = ({
  classname = "",
  strokeColor = "oklch(var(--bc))",
  width = "2rem",
  height = "2rem",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    width={width}
    height={height}
    stroke={strokeColor}
    className={classname}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
  </svg>
);

export const DoubleCrocheIcon = ({
  classname = "",
  strokeColor = "oklch(var(--bc))",
  width = "1.5rem",
  height = "1.5rem",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    width={width}
    height={height}
    stroke={strokeColor}
    className={classname}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
    />
  </svg>
);

export const ArrowDownIcon = ({
  classname = "w-6 h-6",
  strokeColor = "oklch(var(--bc))",
  width = "1rem",
  height = "1rem",
  strokeWidth = "1.5",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
  strokeWidth?: string | undefined;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    width={width}
    height={height}
    stroke={strokeColor}
    className={classname}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
    />
  </svg>
);

export const ArrowUpIcon = ({
  classname = "w-6 h-6",
  strokeColor = "oklch(var(--bc))",
  width = "1rem",
  height = "1rem",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    width={width}
    height={height}
    stroke={strokeColor}
    className={classname}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
    />
  </svg>
);

export const SearchOnIcon = ({
  classname = "swap-on fill-current w-5 h-5",
}: {
  classname?: string | undefined;
}) => (
  <svg
    name="swap-search-on"
    className={classname}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    stroke="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export const SearchOffIcon = ({
  classname = "swap-off fill-current w-5 h-5",
}: {
  classname?: string | undefined;
}) => (
  <svg
    name="swap-search-off"
    className={classname}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    stroke="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export const LinkedInIcon = ({
  strokeColor = "oklch(var(--nc))",
  width = "24",
  height = "24",
}: {
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    fill={strokeColor}
    height={height}
    width={width}
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 310 310"
    stroke={strokeColor}
  >
    <g id="bg" strokeWidth="0"></g>
    <g id="tracer" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="icon">
      <g id="1">
        <path
          id="2"
          d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73 C77.16,101.969,74.922,99.73,72.16,99.73z"
        />
        <path
          id="3"
          d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4 c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"
        />
        <path
          id="4"
          d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599 c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319 c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995 C310,145.43,300.549,94.761,230.454,94.761z"
        />
      </g>
    </g>
  </svg>
);
export const GithubIcon = ({
  strokeColor = "oklch(var(--nc))",
  width = "24",
  height = "24",
}: {
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    fill={strokeColor}
    viewBox="0 0 24 24"
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="bg" strokeWidth="0" />
    <g id="tracer" strokeLinecap="round" strokeLinejoin="round" />
    <g id="icon">
      <path
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8.5 21c2-2-.5-6 3.5-6m0 0c-3 0-7-1-7-5 0-1.445.116-2.89.963-4V3L9 4.283C9.821 4.101 10.81 4 12 4s2.178.1 3 .283L18 3v2.952c.88 1.116 1 2.582 1 4.048 0 4-4 5-7 5Zm0 0c4 0 1.5 4 3.5 6M3 15c3 0 1.5 4 6 3"
      />
    </g>
  </svg>
);

export const SoundcloudIcon = ({
  strokeColor = "oklch(var(--nc))",
  width = "24",
  height = "24",
}: {
  strokeColor?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}) => (
  <svg
    fill={strokeColor}
    width={width}
    height={height}
    viewBox="0 -15.5 48 48"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="bg" strokeWidth="0" />
    <g id="tracer" strokeLinecap="round" strokeLinejoin="round" />
    <g id="icon">
      <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Color" transform="translate(-301.000000, -469.000000)" fill={strokeColor}>
          <path
            d="M301,491.152608 C301,491.756664 301.215945,492.213396 301.647743,492.52299 C302.079587,492.832537 302.541182,492.941985 303.032573,492.851428 C303.494168,492.760824 303.81804,492.594702 304.004234,492.353108 C304.190336,492.111513 304.283433,491.711316 304.283433,491.152608 L304.283433,484.583839 C304.283433,484.115689 304.123374,483.719298 303.80321,483.394665 C303.483092,483.069986 303.092212,482.90767 302.630572,482.90767 C302.183852,482.90767 301.800433,483.069986 301.480269,483.394665 C301.160105,483.719298 301,484.115689 301,484.583839 L301,491.152608 L301,491.152608 Z M306.137273,493.961324 C306.137273,494.399303 306.289918,494.727695 306.595161,494.946685 C306.900449,495.165675 307.291329,495.275124 307.767799,495.275124 C308.25919,495.275124 308.657485,495.165629 308.962773,494.946685 C309.268016,494.727742 309.420661,494.399303 309.420661,493.961324 L309.420661,478.649296 C309.420661,478.196277 309.260556,477.807405 308.940437,477.482773 C308.620273,477.15814 308.229394,476.995778 307.767799,476.995778 C307.32108,476.995778 306.937615,477.15814 306.617497,477.482773 C306.297332,477.807452 306.137273,478.196277 306.137273,478.649296 L306.137273,493.961324 L306.137273,493.961324 Z M311.25221,494.686153 C311.25221,495.124087 311.408562,495.452525 311.721266,495.671515 C312.033969,495.890459 312.436017,495.999954 312.927454,495.999954 C313.403924,495.999954 313.794804,495.890459 314.100047,495.671515 C314.405335,495.452525 314.55798,495.124087 314.55798,494.686153 L314.55798,480.71053 C314.55798,480.242426 314.397875,479.842229 314.077756,479.510031 C313.757592,479.177833 313.374173,479.011757 312.927454,479.011757 C312.465813,479.011757 312.071226,479.177833 311.743647,479.510031 C311.416068,479.842229 311.252256,480.242426 311.252256,480.71053 L311.252256,494.686153 L311.25221,494.686153 Z M316.389483,494.754106 C316.389483,495.584671 316.940422,495.999954 318.042345,495.999954 C319.144223,495.999954 319.695161,495.584671 319.695161,494.754106 L319.695161,472.103177 C319.695161,470.834725 319.31545,470.117461 318.556027,469.951339 C318.064635,469.830519 317.580659,469.97399 317.104189,470.381707 C316.627673,470.789423 316.389438,471.363216 316.389438,472.103177 L316.389438,494.754106 L316.389483,494.754106 Z M321.616146,495.410983 L321.616146,470.766772 C321.616146,469.981556 321.846921,469.513452 322.308561,469.362415 C323.306219,469.12082 324.296463,469 325.279245,469 C327.557469,469 329.679432,469.543622 331.644951,470.630867 C333.610517,471.718111 335.200124,473.201747 336.413681,475.081774 C337.627284,476.961848 338.330867,479.034361 338.52443,481.299501 C339.432744,480.906869 340.400606,480.710577 341.42806,480.710577 C343.512766,480.710577 345.295936,481.458057 346.777525,482.953019 C348.25916,484.448026 349,486.244969 349,488.343986 C349,490.458088 348.25916,492.262597 346.777525,493.757558 C345.295936,495.252519 343.520227,496 341.450396,496 L322.018102,495.977349 C321.884041,495.932047 321.783529,495.848963 321.716521,495.728189 C321.649513,495.607415 321.616146,495.501587 321.616146,495.410983 L321.616146,495.410983 L321.616146,495.410983 Z"
            id="Soundcloud"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const MagnGlassIcon = ({
  strokeColor = "currentColor",
  classname = "max-w-1/12 min-w-3 h-4 opacity-70 hidden sm:block",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill={strokeColor}
    className={classname}
  >
    <path
      fillRule="evenodd"
      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export const MicIcon = ({
  strokeColor = "oklch(var(--bc))",
  classname = "w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
}) => (
  <svg
    className={classname}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 20"
  >
    <path
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"
    />
  </svg>
);

export const SpeakerIcon = ({
  strokeColor = "oklch(var(--bc))",
  classname = "w-4 h-4",
}: {
  classname?: string | undefined;
  strokeColor?: string | undefined;
}) => (
  <svg
    className={classname}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={strokeColor}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
    />
  </svg>
);
