import type { ReactNode } from "react";

export function ExperienceShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#050814]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 20%, #1a2740 0%, #050814 58%), url(/hero/clouds-dark.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(28px) brightness(0.28) saturate(0.7)",
          transform: "scale(1.12)",
        }}
      />
      <div className="relative pb-3">{children}</div>
    </div>
  );
}
