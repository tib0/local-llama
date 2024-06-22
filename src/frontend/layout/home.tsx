import { ReactNode } from "react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div id="index" data-theme="">
      <title>🦙🦙🦙</title>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
