import React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SKUSKU KANKOKU",
  description: "SKUSKU KANKOKU",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="layout-container">
        <div className="navbar">
          <Link href="/">
            <img src="/images/logo.png" alt="로고" className="logo" />
          </Link>
          <div className="menu-items">
            <Link href="/list">이용권 보기</Link>
            <Link href="/login">로그인</Link>
            <Link href="/signup">회원가입</Link>
          </div>
        </div>
        <div className="content-wrapper" style={{ paddingTop: '55px' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
