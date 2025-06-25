import Link from "next/link";

export default function Nav() {
  return (
    <nav className="w-64 bg-white shadow-md h-screen p-4">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/admin/sliders" className="text-blue-600 hover:underline">
            Manage Slides
          </Link>
        </li>
        <li>
          <Link href="/admin/products" className="text-blue-600 hover:underline">
            Manage Products
          </Link>
        </li>
        <li>
          <Link href="/admin/settings" className="text-blue-600 hover:underline">
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}