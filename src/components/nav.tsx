import Link from "next/link";

const links = [
  { href: "/essays", label: "essays" },
  { href: "/poems", label: "poems" },
  { href: "/corkboard", label: "corkboard" },
  { href: "/projects", label: "projects" },
  { href: "/about", label: "about" },
];

export default function Nav() {
  return (
    <header className="bg-board text-paper">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
        <Link href="/" className="font-serif text-lg">
          Prannoy Nambiar
        </Link>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-sm sm:gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-pen">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
