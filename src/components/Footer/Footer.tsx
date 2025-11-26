import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { SiTiktok } from "react-icons/si";
import { BsInstagram, BsWhatsapp, BsFacebook } from "react-icons/bs";

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = () => {
  return (
    <div className="bg-dark-lighten text-white flex justify-between items-center py-3 px-4 shadow-md mt-3">
      <p className="flex gap-2">
        <Link to="/copyright" className="hover:text-primary transition duration-300">
          <span>Copyright StreamLux</span>
          <span className="hidden md:block"> &copy; {new Date().getFullYear()}</span>
        </Link>
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
            href="https://www.facebook.com/gideo.cheruiyot.2025"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition duration-300"
          >
            <BsFacebook size={22} />
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
