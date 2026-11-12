import { Link } from "react-router-dom";
import {
  Building2,
  Heart,
  GraduationCap,
  Droplets,
  Bus,
  Landmark,
  Wrench,
  Leaf,
  ArrowRight,
} from "lucide-react";

function Departments() {
  const departments = [
    {
      name: "Public Works Department",
      description:
        "Roads, buildings, bridges and public infrastructure maintenance and development.",
      icon: Wrench,
    },
    {
      name: "Health and Family Welfare",
      description:
        "Hospitals, primary health centres, public health programmes and medical services.",
      icon: Heart,
    },
    {
      name: "General Education Department",
      description:
        "Schools, educational schemes, teacher-related and student welfare concerns.",
      icon: GraduationCap,
    },
    {
      name: "Local Self Government",
      description:
        "Panchayats, municipalities and local body services including sanitation and civic amenities.",
      icon: Landmark,
    },
    {
      name: "Water Resources Department",
      description:
        "Drinking water supply, irrigation, water bodies and related infrastructure.",
      icon: Droplets,
    },
    {
      name: "Transport Department",
      description:
        "Public transport, road transport services, permits and related citizen services.",
      icon: Bus,
    },
    {
      name: "Environment & Climate",
      description:
        "Environmental protection, pollution control and climate-related public concerns.",
      icon: Leaf,
    },
    {
      name: "Other Departments",
      description:
        "Grievances that fall under other state departments can still be submitted and routed appropriately.",
      icon: Building2,
    },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="text-green-300 font-semibold text-sm tracking-wide mb-3">
            GOVERNMENT SERVICES
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl mb-5">
            Departments covered by the portal
          </h1>
          <p className="text-green-100 text-base md:text-lg leading-relaxed max-w-2xl">
            Select the relevant department when you submit a grievance. Your
            complaint will be directed to the appropriate officers for review
            and action.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-200 transition-all group"
              >
                <div className="bg-green-50 group-hover:bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <dept.icon className="text-green-800" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 leading-snug">
                  {dept.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {dept.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-white border border-gray-200 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Not sure which department?
              </h2>
              <p className="text-gray-500 text-sm max-w-lg">
                Describe your concern clearly when submitting. Officers and
                the CMO desk can route it to the right department if needed.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-green-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-900 shrink-0"
            >
              Submit a grievance
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Departments;
