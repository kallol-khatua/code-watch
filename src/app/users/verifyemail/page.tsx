"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyEmailPage() {
  const [isVerified, setIsVerified] = useState(false);
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
    async function verifyemail() {
      try {
        const response = await axios.post("/api/users/verifyemail", {token});
        if(response?.data?.success){
          setIsVerified(true)
          toast.success(response.data.message)
        }
      } catch (error: any) {
        console.log("Error while verifying token");
        toast.error(error?.response?.data?.message);
      }
    }
    verifyemail();
  }, [token]);

  return (
    <div className="text-center pt-20">
      {isVerified ? <p>Verified</p> : <p>Verifying...</p>}
      <br/>
      {isVerified && <Link href="/users/login">Login</Link>}
      <Toaster />
    </div>
  );
}
