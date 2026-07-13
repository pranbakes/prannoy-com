const socials = [
  { href: "https://twitter.com/prannoy", label: "twitter" },
  { href: "https://github.com/pranbakes", label: "github" },
];

export default function Footer() {
  return (
    <footer className="bg-board text-muted-board">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-10 font-sans text-sm">
        <div className="flex gap-4">
          {socials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-paper"
            >
              {social.label}
            </a>
          ))}
        </div>
        <p>&copy; {new Date().getFullYear()} Prannoy Nambiar</p>
      </div>
    </footer>
  );
}
