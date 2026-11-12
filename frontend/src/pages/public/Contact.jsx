import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function Contact() {
  return (
    <div>
      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="text-green-300 font-semibold text-sm tracking-wide mb-3">
            GET IN TOUCH
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl mb-5">
            Contact & support
          </h1>
          <p className="text-green-100 text-base md:text-lg leading-relaxed max-w-2xl">
            Use the portal for grievance submission and tracking. For general
            queries about how the system works, refer to the FAQ or the
            information below.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="bg-green-50 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="text-green-800" size={22} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Location</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Chief Minister&apos;s Office
                <br />
                Kerala, India
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="bg-green-50 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                <Mail className="text-green-800" size={22} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Support</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Grievance-related support is handled through this portal.
                Use your dashboard or reference number for updates.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="bg-green-50 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                <Phone className="text-green-800" size={22} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Channels</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Prefer digital channels: register, submit, and track online
                for the fastest response path.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 md:p-10">
                <div className="inline-flex items-center gap-2 text-green-800 font-semibold text-sm mb-4">
                  <MessageSquare size={18} />
                  Prefer the portal?
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Raise and track grievances online
                </h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                  The most effective way to get help is to submit a formal
                  grievance. You will receive a reference number and can
                  monitor progress from your account.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-8">
                  <li className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-700" />
                    Secure citizen login
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-700" />
                    Unique tracking reference
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-700" />
                    Department assignment & updates
                  </li>
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 bg-green-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-900"
                  >
                    Register
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/faq"
                    className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50"
                  >
                    View FAQ
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-900 to-green-950 p-8 md:p-10 text-white flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-3">Staff portals</h3>
                <p className="text-green-100 text-sm leading-relaxed mb-6">
                  Department officers and CMO administrators use dedicated
                  login portals. Citizen credentials will not work on staff
                  logins.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/officer/login"
                    className="text-center border border-white/30 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10"
                  >
                    Officer login
                  </Link>
                  <Link
                    to="/cmo/login"
                    className="text-center border border-white/30 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10"
                  >
                    CMO login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
