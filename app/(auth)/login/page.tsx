import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import Signin from "@/components/Signin";

const Login = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (session) {
    redirect("/admin");
  } else {
    return (
        <Signin />
    );
  }
};

export default Login;
