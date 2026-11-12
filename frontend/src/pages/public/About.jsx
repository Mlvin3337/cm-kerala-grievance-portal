import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Target,
  Eye,
  Users,
  Scale,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function About() {
  const values = [
    {
      icon: Scale,
      title: "Transparency",
      description:
        "Every grievance is tracked with a unique reference so citizens can follow progress at any time.",
    },
    {
      icon: Target,
      title: "Accountability",
      description:
        "Clear ownership by departments and officers ensures timely action and measurable outcomes.",
    },
    {
      icon: Users,
      title: "Citizen-first",
      description:
        "Simple forms, multi-language readiness, and status updates designed for everyday users.",
    },
    {
      icon: Eye,
      title: "Oversight",
      description:
        "CMO-level visibility enables monitoring of trends, bottlenecks, and resolution quality.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="text-green-300 font-semibold text-sm tracking-wide mb-3">
            ABOUT THE PORTAL
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl mb-5">
            Building trust through transparent grievance redressal
          </h1>
          <p className="text-green-100 text-base md:text-lg leading-relaxed max-w-2xl">
            The CM Kerala Grievance Redressal Portal is a digital platform that
            helps citizens raise public concerns, track their status, and
            receive timely updates — while enabling departments and the Chief
            Minister&apos;s Office to respond with clarity and accountability.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-green-800 font-semibold text-sm mb-3">
              OUR MISSION
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
              Make public grievance redressal accessible, trackable, and fair
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Citizens should not have to navigate opaque processes to be heard.
              This portal centralises submission, assignment, and resolution so
              that every complaint has a clear owner and a visible path to
              closure.
            </p>
            <ul className="space-y-3">
              {[
                "Online submission with supporting documents",
                "Unique reference numbers for tracking",
                "Department-level assignment and updates",
                "CMO oversight for systemic issues",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2
                    className="text-green-700 shrink-0 mt-0.5"
                    size={20}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-8 md:p-10">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                <ShieldCheck className="text-green-800" size={26} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                For every citizen of Kerala
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Whether it is infrastructure, health, education, or local
                services — register, submit, and track your grievance from
                anywhere.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-green-800 font-semibold text-sm hover:gap-3 transition-all"
              >
                Get started <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-green-800 font-semibold text-sm mb-3">
              GUIDING PRINCIPLES
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              What we stand for
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-green-200 transition-all"
              >
                <div className="bg-green-50 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="text-green-800" size={22} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to raise a concern?
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Create an account or track an existing grievance using your
            reference number.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-green-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-900 shadow-sm"
            >
              Register now
            </Link>
            <Link
              to="/track"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50"
            >
              Track grievance
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
