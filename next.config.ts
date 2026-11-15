import type { NextConfig } from "next";
import { randomBytes } from "node:crypto";

const nextConfig: NextConfig = {
  // The share-image route reads its Poppins files from disk; make sure they ship with the function.
  outputFileTracingIncludes: { "/api/og": ["./src/app/api/og/fonts/**"] },
  env: {
    // Signs Hosamane's approval tokens when APPROVAL_SECRET isn't set: one random value per build, inlined
    // only where it's read (src/lib/hosamane/approval.ts, server code), so all instances of a deploy agree.
    HOSAMANE_BUILD_SECRET: randomBytes(32).toString("hex"),
  },
};

export default nextConfig;
