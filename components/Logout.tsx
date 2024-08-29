"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

const Logout = () => {
  return (
    <Link href="/api/auth/signout">
      <Button
        onClick={(e) => {
          e.preventDefault();
          signOut();
        }}
      >
        Logout
      </Button>
    </Link>
  );
};

export default Logout;
