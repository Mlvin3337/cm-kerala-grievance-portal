import { ShieldCheck, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-green-600/20 p-2 rounded-xl">
                <ShieldCheck size={28} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                CM Kerala
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              A digital platform designed to make public grievance submission,
              tracking and resolution more accessible and transparent for every
              citizen of Kerala.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/departments", label: "Departments" },
                { to: "/how-it-works", label: "How It Works" },
                { to: "/faq", label: "FAQ" },
                { to: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="hover:text-green-400 inline-flex items-center gap-1.5 group w-fit"
                >
                  {item.label}
                  <ArrowRight
                    size={12}
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              For Citizens
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <Link to="/register" className="hover:text-green-400 w-fit">
                Create Account
              </Link>
              <Link to="/login" className="hover:text-green-400 w-fit">
                Citizen Login
              </Link>
              <Link to="/track" className="hover:text-green-400 w-fit">
                Track Grievance
              </Link>
              <Link to="/submit-grievance" className="hover:text-green-400 w-fit">
                Submit Grievance
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <div className="flex flex-col gap-4 text-sm text-slate-400">
              <p className="flex gap-3 items-start">
                <MapPin size={18} className="text-green-500 shrink-0 mt-0.5" />
                <span>Chief Minister&apos;s Office, Kerala, India</span>
              </p>
              <p className="flex gap-3 items-center">
                <Mail size={18} className="text-green-500 shrink-0" />
                <span>grievance support via portal</span>
              </p>
              <p className="flex gap-3 items-center">
                <Phone size={18} className="text-green-500 shrink-0" />
                <span>Contact through the portal</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} CM Kerala Grievance Redressal Portal.
            All rights reserved.
          </p>
          <p className="text-slate-600">
            Transparent · Accountable · Citizen-first
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
