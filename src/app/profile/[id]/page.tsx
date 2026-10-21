import type { Metadata } from "next";
import { ProfileLoader } from "@/components/profile/profile-loader";

export const metadata: Metadata = { title: "Profil Buyer" };

export default async function ProfilePage() {
  return <ProfileLoader/>;
}
