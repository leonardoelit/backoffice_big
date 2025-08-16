
import UserInfoCardAdmin from "@/components/user-profile/UserInfoCardAdmin";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Kullanıcı Profili | ElitBet - Affiliate Dashboard",
  description:
    "ElitBet Affiliate Dashboard Kullanıcı Profil Sayfası ",
};

export default function Profile() {
  return (
    <div>
        <UserInfoCardAdmin />
    </div>
  );
}
