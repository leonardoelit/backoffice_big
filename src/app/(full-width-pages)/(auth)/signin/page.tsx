import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toz Gaming ",
  description: "Toz Gaming",
};

export default function SignIn() {
  return <SignInForm />;
}
