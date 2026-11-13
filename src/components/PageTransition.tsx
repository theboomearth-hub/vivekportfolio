"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { isAppPath } from "@/components/SiteChrome";

const variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(4px)",
  },
};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Captured once on first render — used to detect the very first page
  // (no entrance animation) vs. a subsequent client-side navigation
  // (animate in). Comparing against state avoids mutating refs during render.
  const [initialPathname] = useState(() => pathname);

  // Full-screen apps get no wrapper: the motion div keeps a `filter`, which would make it the
  // containing block for the app's position: fixed panels.
  if (isAppPath(pathname)) return <>{children}</>;

  const isFirstPage = pathname === initialPathname;

  // No "render a plain <div> until mounted" guard: swapping <div> for
  // <motion.div> after hydration changes the element type, so React unmounted
  // and remounted the entire page right after load. With initial={false} the
  // first page renders its final "enter" styles on the server and the client
  // alike, so there is nothing to mismatch.

  return (
    <motion.div
      key={pathname}
      initial={isFirstPage ? false : "hidden"}
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
