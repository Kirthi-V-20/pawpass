import { COLORS } from "@/styles/colors";

export default function DashboardPage() {
  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundColor: COLORS.primary.background,
      }}
    >
      <h1
        className="text-2xl font-semibold"
        style={{
          color: COLORS.neutral.black,
        }}
      >
        Dashboard
      </h1>
    </div>
  );
}
