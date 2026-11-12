
import { useEffect, useState } from "react";
import {
    ClipboardList,
    RefreshCw,
    LogOut,
    Eye,
    X,
    FileText,
    Send,
    Save,
    AlertCircle,
    CheckCircle,
    Clock,
    Download
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function OfficerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [investigationRemarks, setInvestigationRemarks] = useState("");
    const [status, setStatus] = useState("In Progress");
    const [actionReport, setActionReport] = useState("");
    const [resolutionDetails, setResolutionDetails] = useState("");

    const loadGrievances = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/departments/grievances");
            setGrievances(response.data.grievances || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load assigned grievances."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGrievances();
    }, []);

    const openGrievance = async (id) => {
        setDetailsLoading(true);
        setMessage("");
        setSelected(null);

        try {
            const response = await api.get(`/departments/grievances/${id}`);
            const data = response.data.grievance || response.data;

            setSelected(data);
            setInvestigationRemarks(data.investigation_remarks || "");
            setStatus(
                data.status === "Reopened" ? "Reopened" : "In Progress"
            );
            setActionReport(data.action_taken_report || "");
            setResolutionDetails(data.resolution_details || "");
        } catch (err) {
            setMessageType("error");
            setMessage(
                err.response?.data?.message ||
                "Unable to load grievance details."
            );
        } finally {
            setDetailsLoading(false);
        }
    };

    const saveInvestigation = async () => {
        if (!selected || saving) return;

        if (!investigationRemarks.trim()) {
            setMessageType("error");
            setMessage("Please enter investigation remarks.");
            return;
        }

        const grievanceId = selected.id;

        setSaving(true);
        setMessage("");

        try {
            await api.put(
                `/departments/grievances/${grievanceId}/investigation`,
                {
                    investigation_remarks: investigationRemarks,
                    status
                }
            );

            await openGrievance(grievanceId);
            await loadGrievances();

            setMessageType("success");
            setMessage("Investigation details saved successfully.");
        } catch (err) {
            setMessageType("error");
            setMessage(
                err.response?.data?.message ||
                "Unable to save investigation details."
            );
        } finally {
            setSaving(false);
        }
    };

    const submitActionReport = async () => {
        if (!selected || saving) return;

        if (!actionReport.trim() || !resolutionDetails.trim()) {
            setMessageType("error");
            setMessage(
                "Please complete both the action-taken report and resolution details."
            );
            return;
        }

        const grievanceId = selected.id;

        setSaving(true);
        setMessage("");

        try {
            await api.post(
                `/departments/grievances/${grievanceId}/action-report`,
                {
                    action_taken_report: actionReport,
                    resolution_details: resolutionDetails
                }
            );

            await openGrievance(grievanceId);
            await loadGrievances();

            setMessageType("success");
            setMessage(
                "Action-taken report submitted to the CMO successfully."
            );
        } catch (err) {
            setMessageType("error");
            setMessage(
                err.response?.data?.message ||
                "Unable to submit the action-taken report."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/officer/login");
    };

    const getStatusStyle = (value) => {
        if (value === "Resolved") return "bg-green-100 text-green-700";
        if (value === "In Progress") return "bg-blue-100 text-blue-700";
        if (value === "Reopened") return "bg-orange-100 text-orange-700";
        if (value === "Under Review") return "bg-purple-100 text-purple-700";
        return "bg-gray-100 text-gray-700";
    };

    const getReviewStatus = (item) => {
        if (item.status === "Resolved") {
            return {
                label: "Resolved",
                style: "bg-green-100 text-green-700"
            };
        }

        if (item.response_submitted_at) {
            return {
                label: "Submitted",
                style: "bg-blue-100 text-blue-700"
            };
        }

        return {
            label: "Pending",
            style: "bg-orange-100 text-orange-700"
        };
    };

    const pendingReviewCount = grievances.filter(
        (g) => g.response_submitted_at && g.status !== "Resolved"
    ).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <ClipboardList className="text-blue-700" size={25} />
                            <h1 className="text-2xl font-bold text-gray-900">
                                Department Officer Dashboard
                            </h1>
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                            Welcome, {user?.name || "Officer"}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={loadGrievances}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* DASHBOARD STATISTICS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white p-5 rounded-xl border">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                Assigned Grievances
                            </p>
                            <ClipboardList size={20} className="text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold mt-2">
                            {grievances.length}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">In Progress</p>
                            <Clock size={20} className="text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold mt-2">
                            {grievances.filter(
                                (g) => g.status === "In Progress"
                            ).length}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                Pending CMO Review
                            </p>
                            <FileText size={20} className="text-orange-600" />
                        </div>
                        <p className="text-3xl font-bold mt-2">
                            {pendingReviewCount}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">Resolved</p>
                            <CheckCircle size={20} className="text-green-600" />
                        </div>
                        <p className="text-3xl font-bold mt-2">
                            {grievances.filter(
                                (g) => g.status === "Resolved"
                            ).length}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* ASSIGNED GRIEVANCES TABLE */}
                <section className="bg-white rounded-xl border overflow-hidden">
                    <div className="p-5 border-b">
                        <h2 className="text-lg font-semibold">
                            Assigned Grievances
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Grievances assigned to your department account.
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-gray-500">
                            Loading assigned grievances...
                        </div>
                    ) : grievances.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            No grievances have been assigned to you.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="p-4">Reference</th>
                                        <th className="p-4">Subject</th>
                                        <th className="p-4">District</th>
                                        <th className="p-4">Priority</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">CMO Review</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {grievances.map((item) => {
                                        const review = getReviewStatus(item);

                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="p-4 font-medium text-blue-700 whitespace-nowrap">
                                                    {item.reference_number}
                                                </td>

                                                <td className="p-4 min-w-48">
                                                    {item.subject}
                                                </td>

                                                <td className="p-4">
                                                    {item.district}
                                                </td>

                                                <td className="p-4">
                                                    {item.priority}
                                                </td>

                                                <td className="p-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>

                                                <td className="p-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${review.style}`}
                                                    >
                                                        {review.label}
                                                    </span>
                                                </td>

                                                <td className="p-4">
                                                    <button
                                                        onClick={() =>
                                                            openGrievance(item.id)
                                                        }
                                                        className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
                                                    >
                                                        <Eye size={16} />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>

            {/* DETAILS LOADING */}
            {detailsLoading && (
                <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6">
                        Loading grievance details...
                    </div>
                </div>
            )}

            {/* GRIEVANCE DETAILS MODAL */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !saving) {
                            setSelected(null);
                        }
                    }}
                >
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 z-10 bg-white border-b p-5 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Grievance Details
                                </h2>
                                <p className="text-sm text-blue-700 mt-1">
                                    {selected.reference_number}
                                </p>
                            </div>

                            <button
                                onClick={() => !saving && setSelected(null)}
                                disabled={saving}
                                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* GRIEVANCE INFORMATION */}
                            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Subject
                                    </p>
                                    <p className="font-semibold">
                                        {selected.subject}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        District
                                    </p>
                                    <p className="font-semibold">
                                        {selected.district}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Category
                                    </p>
                                    <p className="font-semibold">
                                        {selected.category}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Priority
                                    </p>
                                    <p className="font-semibold">
                                        {selected.priority}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Citizen
                                    </p>
                                    <p className="font-semibold">
                                        {selected.citizen_name || "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Department
                                    </p>
                                    <p className="font-semibold">
                                        {selected.department_name || "—"}
                                    </p>
                                </div>
                            </section>

                            {/* DESCRIPTION */}
                            <section>
                                <h3 className="font-semibold mb-2">
                                    Description
                                </h3>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                                    {selected.description}
                                </p>
                            </section>

                            {/* ATTACHMENTS */}
                            <section>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <FileText size={18} />
                                    Attachments
                                </h3>

                                {selected.attachments?.length ? (
                                    <ul className="space-y-2">
                                        {selected.attachments.map((file) => (
                                            <li
                                                key={file.id}
                                                className="text-sm bg-gray-50 p-3 rounded-lg flex items-center justify-between gap-3"
                                            >
                                                <span className="break-all">
                                                    {file.original_filename}
                                                </span>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {file.file_type || "File"}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No attachments.
                                    </p>
                                )}
                            </section>

                            {/* STATUS HISTORY */}
                            <section className="border-t pt-5">
                                <h3 className="font-semibold mb-3">
                                    Status History
                                </h3>

                                {selected.history?.length > 0 ? (
                                    <div className="space-y-4">
                                        {selected.history.map((item) => (
                                            <div
                                                key={item.id}
                                                className="border-l-2 border-blue-600 pl-4 text-sm"
                                            >
                                                <p className="font-semibold text-gray-900">
                                                    {item.previous_status || "New"}
                                                    {" → "}
                                                    {item.new_status}
                                                </p>

                                                <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                                                    {item.remarks || "No remarks"}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    {item.changed_by_name || "System"}
                                                    {" · "}
                                                    {new Date(
                                                        item.changed_at
                                                    ).toLocaleString()}
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

                            {/* INVESTIGATION */}
                            <section className="border-t pt-5">
                                <h3 className="font-semibold mb-3">
                                    Investigation Update
                                </h3>

                                <label className="block text-sm font-medium mb-2">
                                    Investigation Remarks
                                </label>

                                <textarea
                                    value={investigationRemarks}
                                    onChange={(e) =>
                                        setInvestigationRemarks(e.target.value)
                                    }
                                    rows={4}
                                    disabled={saving || selected.status === "Resolved"}
                                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                                    placeholder="Enter inspection findings and investigation remarks..."
                                />

                                <label className="block text-sm font-medium mt-4 mb-2">
                                    Grievance Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    disabled={saving || selected.status === "Resolved"}
                                    className="w-full border rounded-lg p-3 text-sm disabled:bg-gray-100"
                                >
                                    <option value="In Progress">
                                        In Progress
                                    </option>
                                    <option value="Reopened">
                                        Reopened
                                    </option>
                                </select>

                                <button
                                    onClick={saveInvestigation}
                                    disabled={saving || selected.status === "Resolved"}
                                    className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {saving ? "Saving..." : "Save Investigation"}
                                </button>

                                {selected.status === "Resolved" && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        This grievance has been resolved and can no longer be modified.
                                    </p>
                                )}
                            </section>

                            {/* ACTION-TAKEN REPORT */}
                            <section className="border-t pt-5">
                                <h3 className="font-semibold mb-3">
                                    Action-Taken Report
                                </h3>

                                {selected.response_submitted_at && selected.status !== "Resolved" && (
                                    <div className="mb-4 p-3 rounded-lg bg-blue-50 text-blue-800 text-sm">
                                        Your report has been submitted and is awaiting CMO review.
                                    </div>
                                )}

                                <label className="block text-sm font-medium mb-2">
                                    Action-Taken Report
                                </label>

                                <textarea
                                    value={actionReport}
                                    onChange={(e) =>
                                        setActionReport(e.target.value)
                                    }
                                    rows={4}
                                    disabled={saving || selected.status === "Resolved"}
                                    className="w-full border rounded-lg p-3 text-sm disabled:bg-gray-100"
                                    placeholder="Describe the action taken by your department..."
                                />

                                <label className="block text-sm font-medium mt-4 mb-2">
                                    Resolution Details
                                </label>

                                <textarea
                                    value={resolutionDetails}
                                    onChange={(e) =>
                                        setResolutionDetails(e.target.value)
                                    }
                                    rows={3}
                                    disabled={saving || selected.status === "Resolved"}
                                    className="w-full border rounded-lg p-3 text-sm disabled:bg-gray-100"
                                    placeholder="Describe the resolution or outcome..."
                                />

                                <button
                                    onClick={submitActionReport}
                                    disabled={saving || selected.status === "Resolved"}
                                    className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
                                >
                                    <Send size={16} />
                                    {saving ? "Submitting..." : "Submit Report to CMO"}
                                </button>
                            </section>

                            {/* FEEDBACK MESSAGE */}
                            {message && (
                                <div
                                    className={`p-4 rounded-lg text-sm flex items-start gap-2 ${messageType === "error"
                                            ? "bg-red-50 text-red-700"
                                            : "bg-green-50 text-green-800"
                                        }`}
                                >
                                    <AlertCircle
                                        size={18}
                                        className="shrink-0"
                                    />
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OfficerDashboard;
