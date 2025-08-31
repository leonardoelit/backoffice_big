import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toz Gaming | Sign Up",
  description: "Sign up to Toz Gaming Administrative Program",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
