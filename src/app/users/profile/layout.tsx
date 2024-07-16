export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        {/* TODO: Profile Layout */}
        {/* <div>layout</div> */}
      <div>{children}</div>
    </div>
  );
}
