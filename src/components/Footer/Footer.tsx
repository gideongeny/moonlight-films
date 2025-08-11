import { FunctionComponent } from "react";
import { SiTiktok } from "react-icons/si";
import { BsInstagram, BsWhatsapp } from "react-icons/bs";

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = () => {
  return (
    <div className="bg-dark-lighten text-white flex justify-between items-center py-3 px-4 shadow-md mt-3">
      <p className="flex gap-2">
        <span>Copyright _gideongeny</span>
        <span className="hidden md:block"> &copy; 19/7/2022</span>
      </p>
      <div className="flex gap-3 items-center">
        <p className="hidden md:block">Contact me: </p>
        <div className="flex gap-2">
          <a
            href="https://tiktok.com/@gideongeny07"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition duration-300"
          >
            <SiTiktok size={22} />
          </a>
          <a
            href="https://instagram.com/gideo.cheruiyot.2025"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition duration-300"
          >
            <BsInstagram size={22} />
          </a>
          <a
            href="https://wa.me/254720317626"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition duration-300"
          >
            <BsWhatsapp size={22} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
