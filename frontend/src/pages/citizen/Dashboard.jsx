
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FilePlus,
    Search,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    LogOut,
    ArrowRight,
    RefreshCw,
    LoaderCircle,
    Brain
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchGrievances = async () => {
        try {
            setError("");

            const response = await api.get("/grievances/my", {
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache"
                }
            });

            setGrievances(response.data.grievances || []);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load grievances."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, []);

    // Automatically refresh while AI analysis is pending
    useEffect(() => {
        const hasPendingAI = grievances.some(
            (g) => g.ai_status === "PENDING"
        );

        if (!hasPendingAI) {
            return;
        }

        const interval = setInterval(() => {
            fetchGrievances();
        }, 3000);

        return () => clearInterval(interval);
    }, [grievances]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const total = grievances.length;

    const pending = grievances.filter(
        (g) => !["Resolved", "Closed"].includes(g.status)
    ).length;

    const resolved = grievances.filter(
        (g) => ["Resolved", "Closed"].includes(g.status)
    ).length;

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "resolved":
                return "bg-green-100 text-green-800";

            case "closed":
                return "bg-gray-100 text-gray-700";

            case "submitted":
                return "bg-blue-100 text-blue-800";

            case "in progress":
                return "bg-yellow-100 text-yellow-800";

            default:
                return "bg-orange-100 text-orange-800";
        }
    };

    const getAIStatus = (status) => {
        switch (status) {
            case "COMPLETED":
                return {
                    label: "Completed",
                    style: "bg-green-100 text-green-800"
                };

            case "FAILED":
                return {
                    label: "Unavailable",
                    style: "bg-red-100 text-red-800"
                };

            default:
                return {
                    label: "Processing",
                    style: "bg-yellow-100 text-yellow-800"
                };
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high":
                return "bg-red-100 text-red-800";

            case "low":
                return "bg-green-100 text-green-800";

            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Dashboard Header */}
            <section className="bg-green-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-10">

                    <div className="flex flex-wrap justify-between items-center gap-5">

                        <div>
                            <p className="text-green-200 text-sm mb-2">
                                CITIZEN DASHBOARD
                            </p>

                            <h1 className="text-3xl font-bold">
                                Welcome, {user?.name || "Citizen"}
                            </h1>

                            <p className="text-green-100 mt-2">
                                Manage and monitor your submitted grievances.
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 border border-white/30 px-5 py-3 rounded-lg hover:bg-white/20"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>

                    </div>

                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-5 mb-10">

                    <Link
                        to="/submit-grievance"
                        className="bg-white border border-gray-200 p-6 rounded-xl flex items-center justify-between hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <FilePlus className="text-green-800" size={27} />
                            </div>

                            <div>
                                <h2 className="font-bold text-gray-900">
                                    Submit New Grievance
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Register a new public complaint.
                                </p>
                            </div>
                        </div>

                        <ArrowRight className="text-green-800" />
                    </Link>

                    <Link
                        to="/track"
                        className="bg-white border border-gray-200 p-6 rounded-xl flex items-center justify-between hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Search className="text-blue-800" size={27} />
                            </div>

                            <div>
                                <h2 className="font-bold text-gray-900">
                                    Track Grievance
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Check the progress of a complaint.
                                </p>
                            </div>
                        </div>

                        <ArrowRight className="text-blue-800" />
                    </Link>

                </div>

                {/* Statistics */}
                <div className="grid sm:grid-cols-3 gap-5 mb-10">

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-center">
                            <FileText className="text-blue-700" size={28} />
                            <span className="text-xs text-gray-400">TOTAL</span>
                        </div>

                        <h2 className="text-3xl font-bold mt-4 text-gray-900">
                            {loading ? "..." : total}
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                            Total Grievances
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-center">
                            <Clock className="text-orange-600" size={28} />
                            <span className="text-xs text-gray-400">ACTIVE</span>
                        </div>

                        <h2 className="text-3xl font-bold mt-4 text-gray-900">
                            {loading ? "..." : pending}
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                            Pending Grievances
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-center">
                            <CheckCircle className="text-green-700" size={28} />
                            <span className="text-xs text-gray-400">COMPLETED</span>
                        </div>

                        <h2 className="text-3xl font-bold mt-4 text-gray-900">
                            {loading ? "..." : resolved}
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                            Resolved Grievances
                        </p>
                    </div>

                </div>

                {/* Recent Grievances */}
                <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                    <div className="p-6 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                My Grievances
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Recently submitted complaints and AI analysis.
                            </p>
                        </div>

                        <button
                            onClick={fetchGrievances}
                            className="flex items-center gap-2 text-sm text-green-800 font-semibold"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>

                    </div>

                    {error && (
                        <div className="m-6 bg-red-50 text-red-700 p-4 rounded-lg flex gap-3">
                            <AlertCircle size={20} />
                            <div>
                                {error}
                                <button
                                    onClick={fetchGrievances}
                                    className="block underline mt-2"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="p-12 text-center text-gray-500">
                            Loading your grievances...
                        </div>
                    ) : !error && grievances.length === 0 ? (
                        <div className="p-12 text-center">

                            <FileText
                                size={42}
                                className="mx-auto text-gray-300 mb-4"
                            />

                            <h3 className="font-bold text-gray-800">
                                No grievances submitted yet
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                Your submitted grievances will appear here.
                            </p>

                            <Link
                                to="/submit-grievance"
                                className="inline-flex mt-5 bg-green-800 text-white px-5 py-3 rounded-lg font-semibold"
                            >
                                Submit Your First Grievance
                            </Link>

                        </div>
                    ) : !error ? (

                        <div className="overflow-x-auto">

                            <table className="w-full text-left">

                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Reference Number</th>
                                        <th className="px-6 py-4">Subject</th>
                                        <th className="px-6 py-4">Department</th>
                                        <th className="px-6 py-4">Priority</th>
                                        <th className="px-6 py-4">AI Analysis</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                    {grievances.map((grievance) => {
                                        const aiStatus = getAIStatus(
                                            grievance.ai_status
                                        );

                                        return (
                                            <tr key={grievance.id}>

                                                <td className="px-6 py-5 text-sm font-semibold text-green-800 whitespace-nowrap">
                                                    {grievance.reference_number}
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-800 min-w-48">
                                                    {grievance.subject}
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-600 min-w-40">
                                                    {grievance.assigned_department ||
                                                        grievance.ai_suggested_department ||
                                                        "Not assigned"}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyle(grievance.priority)}`}>
                                                        {grievance.priority || "Medium"}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 min-w-56">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {grievance.ai_status === "PENDING" ? (
                                                            <LoaderCircle
                                                                size={16}
                                                                className="animate-spin text-yellow-600"
                                                            />
                                                        ) : (
                                                            <Brain
                                                                size={16}
                                                                className="text-purple-700"
                                                            />
                                                        )}

                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${aiStatus.style}`}>
                                                            {aiStatus.label}
                                                        </span>
                                                    </div>

                                                    {grievance.ai_status === "COMPLETED" && (
                                                        <div className="text-xs text-gray-500 space-y-1">
                                                            <p>
                                                                <strong>Suggested:</strong>{" "}
                                                                {grievance.ai_suggested_department ||
                                                                    "Not available"}
                                                            </p>

                                                            <p>
                                                                <strong>Category:</strong>{" "}
                                                                {grievance.ai_category ||
                                                                    "Not available"}
                                                            </p>

                                                            {grievance.ai_summary && (
                                                                <p className="max-w-xs">
                                                                    {grievance.ai_summary}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {grievance.ai_status === "PENDING" && (
                                                        <p className="text-xs text-gray-500">
                                                            AI is analysing this grievance.
                                                        </p>
                                                    )}

                                                    {grievance.ai_status === "FAILED" && (
                                                        <p className="text-xs text-gray-500">
                                                            AI analysis is temporarily unavailable. Your grievance is still submitted.
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(grievance.status)}`}>
                                                        {grievance.status}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <Link
                                                        to={`/track?reference=${encodeURIComponent(grievance.reference_number)}`}
                                                        className="text-green-800 font-semibold text-sm hover:underline"
                                                    >
                                                        View
                                                    </Link>
                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>

                    ) : null}

                </section>

            </main>

        </div>
    );
}

export default Dashboard;
