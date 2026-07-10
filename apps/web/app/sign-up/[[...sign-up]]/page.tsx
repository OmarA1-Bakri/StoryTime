import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#fbf7ef" }}><SignUp /></main>;
}
