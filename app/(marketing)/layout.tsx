export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div>
        <header>Marketing header</header>
        {children}
      </div>
    )
  }
  