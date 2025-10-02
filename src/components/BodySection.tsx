import React from "react";

export default function BodySection({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex flex-col bg-white rounded-2xl w-full px-6 py-8 gap-4">
        {children}
      </div>
  )
};