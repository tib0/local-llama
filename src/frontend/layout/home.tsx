import { ReactNode } from "react";
import Header from "../components/header";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div id="index" data-theme="">
      <Header />
      <main id="main">{children}</main>
    </div>
  );
}
