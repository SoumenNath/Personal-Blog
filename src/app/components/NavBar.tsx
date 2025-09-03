import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-5xl mx-auto flex gap-6">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/create-post" className="hover:underline">Create Post</Link>
        <Link href="/topics/Football" className="hover:underline">Football</Link>
        <Link href="/topics/Kpop" className="hover:underline">Kpop</Link>
        <Link href="/topics/Technology" className="hover:underline">Technology</Link>
        <Link href="/topics/Others" className="hover:underline">Others</Link>
      </div>
    </nav>
  );
}
