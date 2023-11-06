import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Web3Provider } from "@/context/Web3Context";
import "@/styles/global.css";

export const metadata = {
  title: "SpeedBurn",
};

export const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Web3Provider>
          <Nav />
          {children}
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
};

export default RootLayout;
