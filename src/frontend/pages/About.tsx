import { Link } from "react-router-dom";
import React from "react";
import HomeLayout from "../layout/home";

function About(): JSX.Element {
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
            <h1>About</h1>
            <span>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta orci
                lectus, id euismod tellus mattis ut. Vestibulum placerat ex sit amet lacus
                tincidunt iaculis. Donec egestas mi non augue aliquam, at aliquam mauris
                pellentesque. Mauris tincidunt et ipsum ac malesuada. Nam non enim ligula.
                Donec nec dictum augue. Mauris dapibus sapien vitae malesuada eleifend. Donec
                faucibus arcu eget libero ullamcorper euismod. Ut non diam pellentesque, auctor
                est sit amet, vehicula nisi. Sed non sagittis metus. Integer semper vitae leo a
                mattis. Vestibulum porttitor tortor a tempor elementum. Pellentesque habitant
                morbi tristique senectus et netus et malesuada fames ac turpis egestas.
              </p>
              <p>
                Suspendisse enim orci, fermentum a condimentum eget, lacinia eget magna.
                Suspendisse quis porta eros. Fusce mollis at nisl ut congue. In cursus purus
                vitae imperdiet interdum. Sed viverra justo et varius ornare. Pellentesque quis
                laoreet dui, id vestibulum ipsum. Morbi elit ex, sollicitudin sed sapien in,
                aliquam hendrerit eros.
              </p>
            </span>
            <Link className="btn btn-primary shadow-lg" tabIndex={0} to="/">
              Go to home page
            </Link>
          </div>
        </div>
      </React.Fragment>
    </HomeLayout>
  );
}

export default About;
