import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Search,
  ShieldCheck,
  Clock,
  Building2,
  CheckCircle,
  Users,
} from "lucide-react";

function Home() {
  const departments = [
    "Public Works Department",
    "Health and Family Welfare",
    "General Education Department",
    "Local Self Government",
    "Water Resources Department",
    "Transport Department",
  ];

  const steps = [
    {
      number: "01",
      title: "Register",
      description: "Create your citizen account using your basic details.",
    },
    {
      number: "02",
      title: "Submit Grievance",
      description: "Describe your concern and attach supporting documents.",
    },
    {
      number: "03",
      title: "Track Progress",
      description: "Track your complaint using its unique reference number.",
    },
    {
      number: "04",
      title: "Get Resolution",
      description: "Receive updates as your grievance moves through the process.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-700/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24 grid lg:grid-cols-2 gap-12 lg:gap-14 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-7 backdrop-blur-sm">
              <ShieldCheck size={17} />
              Public Grievance Redressal System
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-6 tracking-tight">
              Your Voice.
              <br />
              Your Concern.
              <br />
              <span className="text-green-300">Our Commitment.</span>
            </h1>

            <p className="text-green-100/90 text-base md:text-lg leading-relaxed max-w-xl mb-9">
              A transparent digital platform for citizens to submit public
              grievances, monitor progress and stay informed about their
              resolution.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="bg-white text-green-900 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-green-50 shadow-lg shadow-green-950/20"
              >
                Submit Grievance
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/track"
                className="border border-white/40 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/10 backdrop-blur-sm"
              >
                <Search size={18} />
                Track Grievance
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="w-full max-w-md bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
              <div className="bg-white rounded-2xl p-7 text-gray-900 shadow-xl">
                <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <FileText size={28} className="text-green-800" />
                </div>

                <h2 className="text-2xl font-bold mb-3 tracking-tight">
                  Have a concern?
                </h2>

                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Submit your grievance online and receive a unique reference
                  number to track its progress.
                </p>

                <div className="space-y-3.5">
                  {[
                    "Easy online submission",
                    "Reference-based tracking",
                    "Transparent status updates",
                  ].map((text) => (
                    <div key={text} className="flex items-center gap-3">
                      <CheckCircle className="text-green-700 shrink-0" size={20} />
                      <span className="text-sm text-gray-700">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, title: "Citizen Focused", subtitle: "Accessible platform" },
            { icon: FileText, title: "Online Submission", subtitle: "Digital complaints" },
            { icon: Clock, title: "Track Anytime", subtitle: "Status monitoring" },
            { icon: ShieldCheck, title: "Transparent", subtitle: "Accountable process" },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="inline-flex bg-green-50 p-3 rounded-xl mb-3">
                <item.icon className="text-green-800" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-14">
            <p className="text-green-800 font-semibold text-sm mb-3 tracking-wide">
              SIMPLE PROCESS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Follow a simple process to submit and track your public
              grievances.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white p-7 rounded-2xl border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all"
              >
                <span className="text-3xl font-bold text-green-800/90 tabular-nums">
                  {step.number}
                </span>
                <h3 className="font-bold text-lg mt-5 mb-2 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-green-800 font-semibold text-sm hover:gap-3 transition-all"
            >
              Learn more about the process
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-between items-end gap-5 mb-10">
            <div>
              <p className="text-green-800 font-semibold text-sm mb-3 tracking-wide">
                GOVERNMENT SERVICES
              </p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Departments
              </h2>
              <p className="text-gray-500 mt-3">
                Grievances can be directed to the relevant departments.
              </p>
            </div>

            <Link
              to="/departments"
              className="text-green-800 font-semibold flex items-center gap-2 text-sm hover:gap-3 transition-all"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department) => (
              <div
                key={department}
                className="border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-green-600 hover:shadow-md transition-all group"
              >
                <div className="bg-green-50 group-hover:bg-green-100 p-3 rounded-xl transition-colors">
                  <Building2 className="text-green-800" size={22} />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {department}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-green-900 to-green-950 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Make Your Concern Heard
          </h2>
          <p className="text-green-100/90 mt-5 mb-8 max-w-xl mx-auto">
            Register today and take the first step towards addressing your
            public grievances.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-green-900 px-7 py-3.5 rounded-xl font-bold hover:bg-green-50 shadow-lg"
            >
              Get Started <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
