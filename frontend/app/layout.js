import Nav from "@/components/Nav";
import "@/styles/global.css";

export const metadata = {
  title: "Project SpeedBurn",
};

export const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg-beige">
        <Nav />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
