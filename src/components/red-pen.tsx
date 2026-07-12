export function Circle({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block px-2 py-1">
      <svg
        viewBox="0 0 120 60"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)]"
      >
        <path
          d="M12 30 C 10 12, 40 4, 60 5 C 90 6, 112 14, 108 32 C 105 48, 70 56, 45 54 C 20 52, 8 44, 14 28"
          fill="none"
          stroke="var(--color-pen)"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M14 32 C 12 16, 42 6, 62 7 C 88 8, 110 16, 106 30"
          fill="none"
          stroke="var(--color-pen)"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.7"
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

export function Underline({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-pen underline decoration-2 underline-offset-4">
      {children}
    </span>
  );
}

export function Hand({ children }: { children: React.ReactNode }) {
  return <span className="font-hand text-lg text-pen">{children}</span>;
}
