
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    Search,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Building2,
    MapPin,
    Calendar
} from "lucide-react";
import api from "../../services/api";

function TrackGrievance() {
    const [searchParams] = useSearchParams();

    const [reference, setReference] = useState(
        searchParams.get("reference") || ""
    );
    const [grievance, setGrievance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const trackGrievance = async (referenceNumber) => {
        if (!referenceNumber.trim()) {
            setError("Please enter your grievance reference number.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setGrievance(null);

            const response = await api.get(
                `/grievances/track/${encodeURIComponent(referenceNumber.trim())}`
            );

            if (response.data.success) {
                setGrievance(response.data.grievance);
            } else {
                setError("Unable to retrieve grievance details.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to find this grievance. Please check your reference number."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const referenceFromUrl = searchParams.get("reference");

        if (referenceFromUrl) {
            setReference(referenceFromUrl);
            trackGrievance(referenceFromUrl);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        trackGrievance(reference);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Resolved":
                return "bg-green-100 text-green-800";
            case "In Progress":
                return "bg-blue-100 text-blue-800";
            case "Reopened":
                return "bg-orange-100 text-orange-800";
            case "Under Review":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (date) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 px-5 py-12">
            <div className="max-w-3xl mx-auto">

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-green-800 font-semibold text-sm mb-7"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 md:p-9">

                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <Search size={25} className="text-green-800" />
                        </div>

                        <span className="text-sm font-semibold text-green-800">
                            CITIZEN GRIEVANCE PORTAL
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Track Your Grievance
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Enter your reference number to check the current
                        status and progress of your complaint.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Grievance Reference Number
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Example: CMK-2026-XXXXXXXXXX"
                                required
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-700"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-800 text-white px-7 py-3 rounded-lg font-semibold hover:bg-green-900 disabled:opacity-60"
                            >
                                {loading ? "Searching..." : "Track"}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex gap-3 text-sm">
                            <AlertCircle size={20} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    {grievance && (
                        <div className="mt-9 space-y-6">

                            <div className="border border-gray-200 rounded-xl p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Reference Number
                                        </p>
                                        <h2 className="text-lg font-bold text-gray-900 break-all mt-1">
                                            {grievance.reference_number}
                                        </h2>
                                    </div>

                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${getStatusStyle(grievance.status)}`}>
                                        {grievance.status}
                                    </span>
                                </div>

                                <div className="border-t border-gray-100 mt-5 pt-5">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {grievance.subject}
                                    </h3>

                                    <div className="grid sm:grid-cols-2 gap-5 mt-5 text-sm">

                                        <div className="flex gap-3">
                                            <MapPin size={19} className="text-gray-500 shrink-0" />
                                            <div>
                                                <p className="text-gray-500">District</p>
                                                <p className="font-semibold mt-1">{grievance.district}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <FileText size={19} className="text-gray-500 shrink-0" />
                                            <div>
                                                <p className="text-gray-500">Category</p>
                                                <p className="font-semibold mt-1">{grievance.category}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Building2 size={19} className="text-gray-500 shrink-0" />
                                            <div>
                                                <p className="text-gray-500">Assigned Department</p>
                                                <p className="font-semibold mt-1">
                                                    {grievance.assigned_department || "Not yet assigned"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Calendar size={19} className="text-gray-500 shrink-0" />
                                            <div>
                                                <p className="text-gray-500">Submitted On</p>
                                                <p className="font-semibold mt-1">
                                                    {formatDate(grievance.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="mt-5">
                                        <p className="text-gray-500 text-sm">Priority</p>
                                        <p className="font-semibold mt-1">{grievance.priority}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-5">
                                <h3 className="font-bold text-gray-900 text-lg mb-6">
                                    Grievance History
                                </h3>

                                {grievance.history?.length > 0 ? (
                                    <div className="space-y-6">
                                        {grievance.history.map((item, index) => (
                                            <div key={`${item.new_status}-${index}`} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-green-100 p-2 rounded-full">
                                                        {item.new_status === "Resolved" ? (
                                                            <CheckCircle size={18} className="text-green-800" />
                                                        ) : (
                                                            <Clock size={18} className="text-green-800" />
                                                        )}
                                                    </div>

                                                    {index !== grievance.history.length - 1 && (
                                                        <div className="w-px flex-1 bg-gray-200 mt-2" />
                                                    )}
                                                </div>

                                                <div className="pb-2">
                                                    <p className="font-semibold text-gray-900">
                                                        {item.new_status}
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(item.changed_at)}
                                                    </p>

                                                    {item.remarks && (
                                                        <p className="text-sm text-gray-600 mt-2 leading-6">
                                                            {item.remarks}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Your grievance has been registered.
                                        Further status updates will appear here.
                                    </p>
                                )}
                            </div>

                        </div>
                    )}

                    <div className="border-t border-gray-100 mt-8 pt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Need to submit another complaint?
                        </p>

                        <Link
                            to="/login"
                            className="inline-block mt-2 text-green-800 font-semibold text-sm hover:underline"
                        >
                            Login to your citizen account
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default TrackGrievance;
