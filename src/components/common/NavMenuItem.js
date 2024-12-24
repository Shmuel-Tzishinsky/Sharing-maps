import Link from "next/link";
import { useRouter } from "next/router";

const NavMenuItem = ({ icon, href, external = false, label }) => {
  const router = useRouter();

  return (
    <li className={`${router.pathname === (href || "/") ? "underline underline-offset-1" : ""}`}>
      <Link href={href} target={external ? "_blank" : "_self"} className="flex items-center gap-2">
        <>
          {icon} {label}
        </>
      </Link>
    </li>
  );
};

export default NavMenuItem;
