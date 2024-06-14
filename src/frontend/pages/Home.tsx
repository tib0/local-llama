import { Link } from "react-router-dom";
import React from "react";
import HomeLayout from "../layout/home";

function Home(): JSX.Element {
  return (
    <HomeLayout>
      <React.Fragment>
        <div
          className={`
            flex flex-col items-center
            justify-center
          `}
        >
          <div className="prose w-full max-w-full sm:w-[80%] sm:max-w-4xl my-2">
            <h1>Hello world</h1>
            <span>
              <p>A GitHub Template for TypeScript-Powered Native Apps 🚀</p>
              <p>
                The electron vite is a comprehensive GitHub template that combines the power of
                Vite, Electron, DaisyUI, React, and Tailwind CSS to create cutting-edge,
                TypeScript-powered Native Apps.
              </p>
              <p>
                This template aims to streamline the process of building and deploying Native
                Apps on GitHub.
              </p>
            </span>
            <Link className="btn btn-primary shadow-lg" tabIndex={0} to="/about">
              Go to about page
            </Link>
          </div>
        </div>
      </React.Fragment>
    </HomeLayout>
  );
}

export default Home;
