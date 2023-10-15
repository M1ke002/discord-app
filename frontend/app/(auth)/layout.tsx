import React from 'react';
import Image from 'next/image';

// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"

//this layout will be applied to all pages (routes) in this folder (auth)
const layout = ({ children }: { children: React.ReactNode }) => {
  console.log('in layout of auth route');

  return (
    <div>
      <Image src="/images/discord-bg.png" fill alt="Discord background" />
      {children}
    </div>
  );
};

export default layout;
