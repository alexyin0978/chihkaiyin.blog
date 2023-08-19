import Link from "next/link";

const mediaLinks = [
  {
    type: "Linkedin",
    link: "https://www.linkedin.com/in/alexyin0978/",
  },
  {
    type: "Github",
    link: "https://github.com/alexyin0978",
  },
];

export default function Footer() {
  return (
    <footer>
      <div className="h-44">{/* invisible height */}</div>
      <div className="absolute bottom-0 h-14 px-5 left-0 text-sm text-black dark:text-white font-light pt-5 pb-3 w-full flex justify-between items-center">
        <p>© 2023 ChihKai Yin</p>
        <div className="flex gap-3.5">
          {mediaLinks.map(({ type, link }) => (
            <Link
              key={type}
              href={link}
              className="hover:text-header dark:hover:text-header_dark"
            >
              {type}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
