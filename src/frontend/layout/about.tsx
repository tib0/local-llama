import { ReactNode } from "react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div id="index" data-theme="">
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
