import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "../app/pages/NavBar/page"


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet"></link>
      <script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>
      </head>
      <body className={inter.className}>
        <NavBar/>
        {children}
        </body>
    </html>
  );
}
