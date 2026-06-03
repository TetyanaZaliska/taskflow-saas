import { Header } from "@/components/public/header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header></Header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </>
  );
}
