import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Dashboard Admin" };
export default function AdminPage() { return <Dashboard role="admin" />; }
