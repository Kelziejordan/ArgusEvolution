import AppShell from "@/components/layout/AppShell";

export const metadata = {
  title: "ArgOS Evolution",
  description: "Governed personal OS control plane",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, sans-serif" }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
