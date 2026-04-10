import type { Metadata } from "next";
import "./globals.css";
import { Container } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { cairo } from "@/ui/fonts";

export const metadata: Metadata = {
  title: "RealStat Home",
  description: "Sell & Buy Properties",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cairo.className} antialiased  dark:bg-black mt-5`}
      >
        <AppRouterCacheProvider options={{ key: "mui" }}>
          <Container maxWidth="lg">{children}</Container>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
