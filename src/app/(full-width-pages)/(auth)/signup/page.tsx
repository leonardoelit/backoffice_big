import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elit Bet Affiliate Panel Sign Up",
  description: "Sign up to Elit Bet Affiliate Program",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
