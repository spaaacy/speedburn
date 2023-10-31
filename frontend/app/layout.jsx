import Nav from "@/components/Nav";
import { Web3Provider } from "@/context/Web3Context";
import "@/styles/global.css";

export const metadata = {
  title: "Project SpeedBurn",
};

export const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className>
        <Web3Provider>
          <Nav />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
};

export default RootLayout;
