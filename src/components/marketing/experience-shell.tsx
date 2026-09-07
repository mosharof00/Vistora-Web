import type { ReactNode } from "react";

export function ExperienceShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#050814]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 18%, #1a2740 0%, #050814 55%), url(/hero/sequence/ezgif-frame-110.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(34px) brightness(0.25) saturate(0.65)",
          transform: "scale(1.15)",
        }}
      />
      <div className="relative pb-3">{children}</div>
    </div>
  );
}
