type ProgressProps = {
  value: number;
};

export function Progress({ value }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full bg-black transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
