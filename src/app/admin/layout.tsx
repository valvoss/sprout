export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-gray-950 text-gray-100 overflow-auto">
      {children}
    </div>
  );
}
