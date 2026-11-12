
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard, FileText, Clock, CheckCircle,
    AlertTriangle, RefreshCw, Search, LogOut,
    Eye, X, UserRound, Building2, ClipboardCheck
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const initialStats = {
    total: 0,
    pending: 0,
    resolved: 0,
    overdue: 0
};

function CMODashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [stats, setStats] = useState(initialStats);
    const [grievances, setGrievances] = useState([]);
    const [officers, setOfficers] = useState([]);
    const [selected, setSelected] = useState(null);

    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [filters, setFilters] = useState({
        district: "",
        category: "",
        priority: "",
        status: ""
    });

    const [assignment, setAssignment] = useState({
        officer_id: "",
        remarks: ""
    });

    const [review, setReview] = useState({
        decision: "RESOLVE",
        remarks: ""
    });

    const loadDashboard = async () => {
        setLoading(true);
        setError("");

        try {
            const [statsRes, grievancesRes, officersRes] =
                await Promise.all([
                    api.get("/cmo/stats"),
                    api.get("/cmo/grievances", { params: filters }),
                    api.get("/cmo/officers")
                ]);

            setStats(statsRes.data.stats || initialStats);
            setGrievances(grievancesRes.data.grievances || []);
            setOfficers(officersRes.data.officers || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load the CMO dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, [filters]);

    const openGrievance = async (id) => {
        setDetailLoading(true);
        setSelected(null);
        setMessage("");

        try {
            const response = await api.get(`/cmo/grievances/${id}`);
            setSelected(response.data.grievance || response.data);
            setAssignment({ officer_id: "", remarks: "" });
            setReview({ decision: "RESOLVE", remarks: "" });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load grievance details."
            );
        } finally {
            setDetailLoading(false);
        }
    };

    const assignGrievance = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!assignment.officer_id) {
            setMessage("Please select a department officer.");
            return;
        }

        try {
            await api.post("/cmo/assign", {
                grievance_id: selected.id,
                officer_id: Number(assignment.officer_id),
                remarks: assignment.remarks
            });

            setMessage("Grievance assigned successfully.");
            await openGrievance(selected.id);
            await loadDashboard();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to assign grievance."
            );
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!review.remarks.trim()) {
            setMessage("Please enter review remarks.");
            return;
        }

        try {
            await api.post(`/cmo/grievances/${selected.id}/review`, {
                decision: review.decision,
                remarks: review.remarks
            });

            setMessage("Review decision submitted successfully.");
            await openGrievance(selected.id);
            await loadDashboard();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to submit review."
            );
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/cmo/login");
    };

    const statCards = [
        {
            label: "Total Grievances",
            value: stats.total,
            icon: FileText,
            color: "text-blue-700",
            bg: "bg-blue-50"
        },
        {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "text-amber-700",
            bg: "bg-amber-50"
        },
        {
            label: "Resolved",
            value: stats.resolved,
            icon: CheckCircle,
            color: "text-green-700",
            bg: "bg-green-50"
        },
        {
            label: "Overdue",
            value: stats.overdue,
            icon: AlertTriangle,
            color: "text-red-700",
            bg: "bg-red-50"
        }
    ];

    const statusStyle = (status) => {
        if (status === "Resolved") return "bg-green-100 text-green-800";
        if (status === "In Progress") return "bg-blue-100 text-blue-800";
        if (status === "Reopened") return "bg-purple-100 text-purple-800";
        if (status === "Under Review") return "bg-amber-100 text-amber-800";
        return "bg-gray-100 text-gray-700";
    };

    const inputStyle =
        "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700";

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <header className="bg-green-950 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <LayoutDashboard size={25} />
                        </div>

                        <div>
                            <h1 className="font-bold text-lg">
                                CMO Administration
                            </h1>
                            <p className="text-xs text-green-200">
                                Kerala Public Grievance Management
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="hidden sm:block text-sm">
                            {user?.name || "Administrator"}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-5 py-8">

                <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Dashboard Overview
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Monitor grievances and department responses.
                        </p>
                    </div>

                    <button
                        onClick={loadDashboard}
                        className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-5 text-sm">
                        {error}
                    </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {statCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.label}
                                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {card.label}
                                        </p>
                                        <h3 className="text-3xl font-bold mt-2 text-gray-900">
                                            {loading ? "..." : card.value}
                                        </h3>
                                    </div>

                                    <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
                                        <Icon size={24} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Grievance list */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm">

                    <div className="p-5 border-b border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                            <ClipboardCheck size={21} className="text-green-800" />
                            <h3 className="font-bold text-lg text-gray-900">
                                Grievance Management
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                            <select
                                className={inputStyle}
                                value={filters.district}
                                onChange={(e) => setFilters({
                                    ...filters,
                                    district: e.target.value
                                })}
                            >
                                <option value="">All Districts</option>
                                {[
                                    "Thiruvananthapuram", "Kollam", "Pathanamthitta",
                                    "Alappuzha", "Kottayam", "Idukki",
                                    "Ernakulam", "Thrissur", "Palakkad",
                                    "Malappuram", "Kozhikode", "Wayanad",
                                    "Kannur", "Kasaragod"
                                ].map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>

                            <select
                                className={inputStyle}
                                value={filters.category}
                                onChange={(e) => setFilters({
                                    ...filters,
                                    category: e.target.value
                                })}
                            >
                                <option value="">All Categories</option>
                                {[
                                    "Infrastructure", "Health", "Education",
                                    "Water Supply", "Electricity", "Transport",
                                    "Public Safety", "Other"
                                ].map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>

                            <select
                                className={inputStyle}
                                value={filters.priority}
                                onChange={(e) => setFilters({
                                    ...filters,
                                    priority: e.target.value
                                })}
                            >
                                <option value="">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>

                            <select
                                className={inputStyle}
                                value={filters.status}
                                onChange={(e) => setFilters({
                                    ...filters,
                                    status: e.target.value
                                })}
                            >
                                <option value="">All Statuses</option>
                                {[
                                    "Submitted", "Under Review", "In Progress",
                                    "Resolved", "Reopened"
                                ].map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-5 py-4">Reference</th>
                                    <th className="px-5 py-4">Grievance</th>
                                    <th className="px-5 py-4">District</th>
                                    <th className="px-5 py-4">Priority</th>
                                    <th className="px-5 py-4">Department</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {!loading && grievances.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-10 text-gray-500">
                                            No grievances found.
                                        </td>
                                    </tr>
                                )}

                                {grievances.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-medium text-green-800 whitespace-nowrap">
                                            {item.reference_number}
                                        </td>

                                        <td className="px-5 py-4 min-w-48">
                                            <p className="font-semibold text-gray-900">
                                                {item.subject}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {item.citizen_name}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 whitespace-nowrap">
                                            {item.district}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className={
                                                item.priority === "High"
                                                    ? "text-red-700 font-semibold"
                                                    : item.priority === "Medium"
                                                        ? "text-amber-700 font-semibold"
                                                        : "text-green-700 font-semibold"
                                            }>
                                                {item.priority}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 min-w-40">
                                            {item.assigned_department || "Not assigned"}
                                        </td>

                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => openGrievance(item.id)}
                                                className="flex items-center gap-1 text-green-800 hover:text-green-950 font-semibold"
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {loading && (
                            <p className="text-center text-gray-500 py-8">
                                Loading grievances...
                            </p>
                        )}
                    </div>

                    <div className="px-5 py-3 border-t text-xs text-gray-500">
                        Showing {grievances.length} grievance(s)
                    </div>
                </section>
            </main>

            {/* Grievance details modal */}
            {(selected || detailLoading) && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl my-6">

                        <div className="flex justify-between items-center p-5 border-b">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Grievance Details
                                </h2>
                                {selected && (
                                    <p className="text-sm text-green-800 mt-1">
                                        {selected.reference_number}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => setSelected(null)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {detailLoading ? (
                            <p className="p-10 text-center text-gray-500">
                                Loading grievance details...
                            </p>
                        ) : selected && (
                            <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">

                                {message && (
                                    <div className="bg-blue-50 text-blue-800 border border-blue-200 rounded-lg p-3 text-sm">
                                        {message}
                                    </div>
                                )}

                                {/* Citizen and grievance information */}
                                <section>
                                    <h3 className="font-bold text-gray-900 mb-3">
                                        Grievance Information
                                    </h3>

                                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Subject</p>
                                            <p className="font-semibold">{selected.subject}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Citizen</p>
                                            <p className="font-semibold">{selected.citizen_name}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Email</p>
                                            <p>{selected.citizen_email || "Not available"}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Mobile</p>
                                            <p>{selected.citizen_mobile || "Not available"}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">District</p>
                                            <p>{selected.district}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Category / Priority</p>
                                            <p>{selected.category} / {selected.priority}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Status</p>
                                            <p>{selected.status}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Submitted</p>
                                            <p>{new Date(selected.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-gray-500 text-sm mb-1">Description</p>
                                        <p className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap">
                                            {selected.description}
                                        </p>
                                    </div>
                                </section>

                                {/* AI analysis */}
                                <section className="border-t pt-5">
                                    <h3 className="font-bold mb-3">
                                        AI Analysis
                                    </h3>

                                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 space-y-2 text-sm">
                                        <p>
                                            <strong>AI Status:</strong>{" "}
                                            {selected.ai_status || "Not available"}
                                        </p>
                                        <p>
                                            <strong>Suggested Department:</strong>{" "}
                                            {selected.ai_suggested_department || "Not available"}
                                        </p>
                                        <p>
                                            <strong>Suggested Category:</strong>{" "}
                                            {selected.ai_category || "Not available"}
                                        </p>
                                        <p>
                                            <strong>AI Summary:</strong>{" "}
                                            {selected.ai_summary || "No AI summary available."}
                                        </p>
                                        <p>
                                            <strong>AI Reviewed:</strong>{" "}
                                            {selected.ai_reviewed ? "Yes" : "No"}
                                        </p>
                                    </div>
                                </section>

                                {/* Assign officer */}
                                <section className="border-t pt-5">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <Building2 size={19} />
                                        Assign to Department Officer
                                    </h3>

                                    <form onSubmit={assignGrievance} className="space-y-3">
                                        <select
                                            className={inputStyle}
                                            value={assignment.officer_id}
                                            onChange={(e) => setAssignment({
                                                ...assignment,
                                                officer_id: e.target.value
                                            })}
                                            required
                                        >
                                            <option value="">Select officer</option>
                                            {officers.map((officer) => (
                                                <option key={officer.id} value={officer.id}>
                                                    {officer.name} — {officer.department_name}
                                                </option>
                                            ))}
                                        </select>

                                        <textarea
                                            className={inputStyle}
                                            rows="2"
                                            placeholder="Assignment instructions or remarks (optional)"
                                            value={assignment.remarks}
                                            onChange={(e) => setAssignment({
                                                ...assignment,
                                                remarks: e.target.value
                                            })}
                                        />

                                        <button
                                            type="submit"
                                            className="bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-900"
                                        >
                                            Assign Grievance
                                        </button>
                                    </form>
                                </section>

                                {/* Assignment history and reports */}
                                <section className="border-t pt-5">
                                    <h3 className="font-bold mb-3">
                                        Department Reports
                                    </h3>

                                    {selected.assignments?.length > 0 ? (
                                        <div className="space-y-4">
                                            {selected.assignments.map((item) => (
                                                <div key={item.id} className="border rounded-lg p-4 space-y-3 text-sm">
                                                    <div>
                                                        <p className="font-semibold">{item.department_name}</p>
                                                        <p className="text-gray-500">
                                                            Officer: {item.officer_name} ({item.officer_email})
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500 font-semibold">Investigation Remarks</p>
                                                        <p className="whitespace-pre-wrap">
                                                            {item.investigation_remarks || "Not submitted"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500 font-semibold">Action Taken Report</p>
                                                        <p className="whitespace-pre-wrap">
                                                            {item.action_taken_report || "Not submitted"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500 font-semibold">Resolution Details</p>
                                                        <p className="whitespace-pre-wrap">
                                                            {item.resolution_details || "Not submitted"}
                                                        </p>
                                                    </div>

                                                    <p className="text-xs text-gray-500">
                                                        Response submitted:{" "}
                                                        {item.response_submitted_at
                                                            ? new Date(item.response_submitted_at).toLocaleString()
                                                            : "Pending"}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            No department assignment yet.
                                        </p>
                                    )}
                                </section>

                                {/* Attachments */}
                                <section className="border-t pt-5">
                                    <h3 className="font-bold mb-3">Attachments</h3>

                                    {selected.attachments?.length > 0 ? (
                                        <div className="space-y-2">
                                            {selected.attachments.map((file) => (
                                                <div key={file.id} className="text-sm bg-gray-50 rounded-lg p-3">
                                                    {file.original_filename}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            No attachments submitted.
                                        </p>
                                    )}
                                </section>

                                {/* Status history */}
                                <section className="border-t pt-5">
                                    <h3 className="font-bold mb-3">Status History</h3>

                                    {selected.history?.length > 0 ? (
                                        <div className="space-y-3">
                                            {selected.history.map((item, index) => (
                                                <div key={index} className="border-l-2 border-green-700 pl-4 text-sm">
                                                    <p className="font-semibold">
                                                        {item.previous_status || "New"} → {item.new_status}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {item.remarks || "No remarks"}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {item.changed_by_name} · {new Date(item.changed_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            No status history available.
                                        </p>
                                    )}
                                </section>

                                {/* CMO review */}
                                {selected.status !== "Resolved" && (
                                    <section className="border-t pt-5">
                                        <h3 className="font-bold mb-3">
                                            CMO Review Decision
                                        </h3>

                                        <form onSubmit={submitReview} className="space-y-3">
                                            <select
                                                className={inputStyle}
                                                value={review.decision}
                                                onChange={(e) => setReview({
                                                    ...review,
                                                    decision: e.target.value
                                                })}
                                            >
                                                <option value="RESOLVE">
                                                    Approve and Resolve
                                                </option>
                                                <option value="RETURN_FOR_ACTION">
                                                    Return for Further Action
                                                </option>
                                            </select>

                                            <textarea
                                                className={inputStyle}
                                                rows="3"
                                                placeholder="Enter CMO review remarks"
                                                value={review.remarks}
                                                onChange={(e) => setReview({
                                                    ...review,
                                                    remarks: e.target.value
                                                })}
                                                required
                                            />

                                            <button
                                                type="submit"
                                                className="bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900"
                                            >
                                                Submit Review Decision
                                            </button>
                                        </form>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <footer className="text-center text-xs text-gray-400 py-6">
                Kerala Public Grievance Management System
            </footer>
        </div>
    );
}

export default CMODashboard;
