import "./globals.css"

export const metadata = {
  title: "Traffic Signal Simulation",
  description: "3D RL-based traffic signal simulation prioritizing ambulances",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full min-h-screen bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  )
}
