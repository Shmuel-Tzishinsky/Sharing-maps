import { Compass, Home, SearchIcon, Upload, MapPin } from "lucide-react";

import { AppConfig, NavMenuVariant } from "../../lib/AppConfig";
import NavMenuItem from "./NavMenuItem";

const NavMenu = ({ variant = NavMenuVariant.INTRO }) => {
  const navIconSize =
    variant === NavMenuVariant.TOPNAV ? AppConfig.ui.topBarIconSize : AppConfig.ui.menuIconSize;

  const listStyle =
    variant === NavMenuVariant.TOPNAV
      ? `flex text-white gap-4 text-lg text-white text-sm md:text-base`
      : `flex flex-col justify-between gap-1 w-fit text-primary`;

  return (
    <ul className={`${listStyle}`}>
      <NavMenuItem href="/" label="Intro" icon={<Home size={navIconSize} />} />
      <NavMenuItem href="/map" label="Map Example" icon={<Compass size={navIconSize} />} />
      <NavMenuItem href="/uploadFile" label="Upload file" icon={<Upload size={navIconSize} />} />
      <NavMenuItem href="/gptTest" label="GPT test" icon={<MapPin size={navIconSize} />} />
    </ul>
  );
};

export default NavMenu;
