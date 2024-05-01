"use client";

import { signIn } from "next-auth/react";

const Page = () => {
  return (
    <div className="w-full text-center">
      <button
        onClick={() => signIn("google", { callbackUrl: "/home" })}
        className="mt-8 bg-white text-black p-2 rounded-md"
      >
        login with google
      </button>
    </div>
  );
};

export default Page;
