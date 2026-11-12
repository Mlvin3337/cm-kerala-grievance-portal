import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Who can submit a grievance on this portal?",
      a: "Any citizen can register and submit public grievances related to government services and departments in Kerala. You need a valid email and basic details to create an account.",
    },
    {
      q: "How do I track my grievance?",
      a: "After submission you receive a unique reference number. Use the Track Grievance page with that number, or log in to your dashboard to see all your submissions and their current status.",
    },
    {
      q: "What information should I include when submitting?",
      a: "Select the correct district and category, write a clear subject and detailed description, and attach relevant documents or photos if available. Clear details help officers act faster.",
    },
    {
      q: "How long does resolution take?",
      a: "Timelines vary by department and complexity. You will see status updates (Submitted, In Progress, Resolved, etc.) on your dashboard and via the track page as the case moves forward.",
    },
    {
      q: "Can I submit grievances for someone else?",
      a: "The portal is designed for citizens to raise concerns in their own name. If you are assisting someone, they should ideally register and submit, or provide accurate details so the complaint can be verified.",
    },
    {
      q: "What if I chose the wrong department?",
      a: "Describe the issue accurately. Officers and CMO oversight can reassign or route the grievance to the appropriate department when needed.",
    },
    {
      q: "Are staff (officer / CMO) logins different?",
      a: "Yes. Citizens use the main Login page. Department officers and CMO administrators have separate login URLs. Using citizen credentials on staff portals (or vice versa) will not work.",
    },
    {
      q: "Is my data secure?",
      a: "Authentication is token-based and access is role-restricted. Only authorised citizens, officers, and CMO staff can see the data relevant to their role.",
    },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="text-green-300 font-semibold text-sm tracking-wide mb-3">
            HELP CENTRE
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl mb-5">
            Frequently asked questions
          </h1>
          <p className="text-green-100 text-base md:text-lg leading-relaxed max-w-2xl">
            Quick answers about registration, submission, tracking, and how
            the portal works for citizens and staff.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-3">
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-gray-400 shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <div className="inline-flex bg-green-50 text-green-800 p-3 rounded-xl mb-4">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Still have questions?
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Visit the contact page or start by registering — most issues are
              best handled through a formal grievance.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50"
              >
                Contact
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-green-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-900"
              >
                Register
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FAQ;
