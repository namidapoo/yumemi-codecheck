import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import type { FC, ReactNode } from "react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "日本の都道府県別人口推移",
	description: "日本の都道府県別人口推移を表示するサイトです。",
};

const RootLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
	return (
		<html lang="ja">
			<body
				className={cn(geistSans.variable, geistMono.variable, "antialiased")}
			>
				{children}
			</body>
		</html>
	);
};

export default RootLayout;
