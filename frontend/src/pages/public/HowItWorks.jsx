import { Link } from "react-router-dom";
import {
  UserPlus,
  FileText,
  Search,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create your account",
      description:
        "Register with your basic details. A verified citizen account lets you submit and manage grievances securely.",
      icon: UserPlus,
      cta: { to: "/register", label: "Register" },
    },
    {
      number: "02",
      title: "Submit your grievance",
      description:
        "Choose the district and category, describe the issue clearly, and attach supporting documents if available.",
      icon: FileText,
      cta: { to: "/submit-grievance", label: "Submit form" },
    },
    {
      number: "03",
      title: "Track with a reference number",
      description:
        "You receive a unique reference ID. Use it anytime on the track page — or view all your grievances from the dashboard.",
      icon: Search,
      cta: { to: "/track", label: "Track now" },
    },
    {
      number: "04",
      title: "Receive updates & resolution",
      description:
        "Departments review, update status, and close the grievance. You stay informed at every stage of the process.",
      icon: CheckCircle,
      cta: null,
    },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="text-green-300 font-semibold text-sm tracking-wide mb-3">
            SIMPLE PROCESS
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl mb-5">
            How the grievance process works
          </h1>
          <p className="text-green-100 text-base md:text-lg leading-relaxed max-w-2xl">
            Four clear steps from registration to resolution — designed so
            every citizen can raise a concern and follow it through.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className={`flex flex-col md:flex-row gap-6 md:gap-10 items-start p-6 md:p-8 rounded-2xl border ${
                  idx % 2 === 0
                    ? "bg-gray-50 border-gray-100"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-4xl font-bold text-green-800/20 tabular-nums">
                    {step.number}
                  </span>
                  <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center">
                    <step.icon className="text-green-800" size={26} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 max-w-2xl">
                    {step.description}
                  </p>
                  {step.cta && (
                    <Link
                      to={step.cta.to}
                      className="inline-flex items-center gap-2 text-green-800 font-semibold text-sm hover:gap-3 transition-all"
                    >
                      {step.cta.label}
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-green-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
            <ShieldCheck size={16} />
            Secure & transparent
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Start your grievance journey today
          </h2>
          <p className="text-green-100 mb-8 max-w-lg mx-auto">
            Register once and manage all your submissions from a single
            dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-green-900 px-6 py-3 rounded-xl font-semibold hover:bg-green-50"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="border border-white/40 px-6 py-3 rounded-xl font-semibold hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HowItWorks;
