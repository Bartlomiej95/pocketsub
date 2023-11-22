export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div>
        <aside> Navigation </aside>   
        <main>{children}</main>
      </div>
    )
  }
  