// src/app/page.tsx

// @ts-nocheck
// use client
"use client";
import Header from "@/app/components/Header";

import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function Home() {
  return (
    <div className={roboto.className}>
      <Header />
    </div>
  );
}
