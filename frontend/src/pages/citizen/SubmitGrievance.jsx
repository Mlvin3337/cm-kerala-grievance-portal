
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    FileText,
    Upload,
    ArrowLeft,
    ShieldCheck,
    X,
    CheckCircle,
    AlertTriangle,
    LoaderCircle
} from "lucide-react";

import api from "../../services/api";

function SubmitGrievance() {
    const navigate = useNavigate();

    const districts = [
        "Thiruvananthapuram",
        "Kollam",
        "Pathanamthitta",
        "Alappuzha",
        "Kottayam",
        "Idukki",
        "Ernakulam",
        "Thrissur",
        "Palakkad",
        "Malappuram",
        "Kozhikode",
        "Wayanad",
        "Kannur",
        "Kasaragod"
    ];

    const categories = [
        "Infrastructure",
        "Healthcare",
        "Education",
        "Water Supply",
        "Electricity",
        "Road and Transport",
        "Sanitation and Waste Management",
        "Public Services",
        "Other"
    ];

    const [form, setForm] = useState({
        district: "",
        category: "",
        subject: "",
        description: ""
    });

    const [attachment, setAttachment] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    // Automatically check AI analysis status
    useEffect(() => {
        if (!success || success.ai_status !== "PENDING") {
            return;
        }

        const checkAIStatus = async () => {
            try {
                const response = await api.get("/grievances/my", {
                    headers: {
                        "Cache-Control": "no-cache",
                        "Pragma": "no-cache"
                    }
                });

                const currentGrievance =
                    response.data.grievances?.find(
                        (item) => item.id === success.id
                    );

                if (
                    currentGrievance &&
                    currentGrievance.ai_status !== "PENDING"
                ) {
                    setSuccess((previous) => ({
                        ...previous,
                        ai_status: currentGrievance.ai_status,
                        priority: currentGrievance.priority
                    }));
                }

            } catch (error) {
                console.error("Unable to refresh AI status:", error);
            }
        };

        checkAIStatus();

        const interval = setInterval(checkAIStatus, 3000);

        return () => clearInterval(interval);

    }, [success?.id, success?.ai_status]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                "Only JPG, PNG, PDF, DOC and DOCX files are allowed."
            );
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File size must not exceed 5 MB.");
            e.target.value = "";
            return;
        }

        setError("");
        setAttachment(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");

        if (form.description.trim().length < 10) {
            setError(
                "Description must contain at least 10 characters."
            );
            return;
        }

        const formData = new FormData();

        formData.append("district", form.district);
        formData.append("category", form.category);
        formData.append("subject", form.subject);
        formData.append("description", form.description);

        if (attachment) {
            formData.append("attachment", attachment);
        }

        try {
            setLoading(true);

            console.log("Submitting grievance to backend...");

            const response = await api.post(
                "/grievances",
                formData
            );

            console.log("Backend response:", response.data);

            if (
                !response.data?.success ||
                !response.data?.grievance?.reference_number
            ) {
                throw new Error(
                    response.data?.message ||
                    "Invalid response received from server."
                );
            }

            // Save successful grievance response
            setSuccess(response.data.grievance);

            console.log(
                "Grievance successfully submitted:",
                response.data.grievance.reference_number
            );

        } catch (err) {
            console.error("Grievance submission error:", err);

            if (err.response) {
                setError(
                    err.response.data?.message ||
                    "Unable to submit grievance."
                );
            } else {
                setError(
                    "We could not confirm whether your grievance was submitted. " +
                    "Please check your dashboard or grievance list before trying again " +
                    "to avoid creating a duplicate."
                );
            }

        } finally {
            setLoading(false);
            console.log("Grievance submission request finished.");
        }
    };

    // SUCCESS SCREEN
    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5 py-12">

                <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg border border-gray-100 p-8 text-center">

                    <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                        <CheckCircle
                            size={35}
                            className="text-green-800"
                        />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mt-6">
                        Grievance Submitted!
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Your grievance has been successfully registered.
                        Keep your reference number for future tracking.
                    </p>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-5 mt-7">

                        <p className="text-sm text-gray-600 mb-2">
                            Your Reference Number
                        </p>

                        <h2 className="text-xl font-bold text-green-900 break-all">
                            {success.reference_number}
                        </h2>

                    </div>

                    <div className="text-left bg-gray-50 rounded-xl p-5 mt-5 space-y-3 text-sm">

                        <p>
                            <strong>Status:</strong> {success.status}
                        </p>

                        <p>
                            <strong>Priority:</strong>{" "}
                            {success.priority || "Pending"}
                        </p>

                        {success.ai_status === "PENDING" && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">

                                <LoaderCircle
                                    size={21}
                                    className="text-blue-700 shrink-0 animate-spin"
                                />

                                <div>
                                    <p className="font-semibold text-blue-800">
                                        AI Analysis in Progress
                                    </p>

                                    <p className="text-blue-800 mt-1">
                                        Your grievance has been submitted successfully.
                                        Our system is analysing your complaint.
                                    </p>
                                </div>

                            </div>
                        )}

                        {success.ai_status === "COMPLETED" && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">

                                <CheckCircle
                                    size={21}
                                    className="text-green-700 shrink-0"
                                />

                                <div>
                                    <p className="font-semibold text-green-800">
                                        AI Analysis Completed
                                    </p>

                                    <p className="text-green-800 mt-1">
                                        Your grievance has been analysed successfully.
                                    </p>

                                    {success.ai_analysis?.department && (
                                        <p className="mt-2">
                                            <strong>Suggested Department:</strong>{" "}
                                            {success.ai_analysis.department}
                                        </p>
                                    )}

                                    {success.ai_analysis?.summary && (
                                        <p className="mt-2">
                                            <strong>AI Summary:</strong>{" "}
                                            {success.ai_analysis.summary}
                                        </p>
                                    )}
                                </div>

                            </div>
                        )}

                        {success.ai_status === "FAILED" && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">

                                <AlertTriangle
                                    size={21}
                                    className="text-yellow-700 shrink-0"
                                />

                                <div>
                                    <p className="font-semibold text-yellow-800">
                                        AI Analysis Unavailable
                                    </p>

                                    <p className="text-yellow-800 mt-1">
                                        AI analysis could not be completed at this time.
                                        Your grievance was successfully submitted and
                                        remains registered.
                                    </p>
                                </div>

                            </div>
                        )}

                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-7">

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="flex-1 bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900"
                        >
                            Go to Dashboard
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    `/track?reference=${encodeURIComponent(
                                        success.reference_number
                                    )}`
                                )
                            }
                            className="flex-1 border border-green-800 text-green-800 py-3 rounded-lg font-semibold hover:bg-green-50"
                        >
                            Track Grievance
                        </button>

                    </div>

                </div>
            </div>
        );
    }

    // SUBMISSION FORM
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-5">

            <div className="max-w-3xl mx-auto">

                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 text-green-800 font-semibold text-sm mb-7"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    <div className="bg-green-900 text-white p-7 md:p-9">

                        <div className="flex items-center gap-3 mb-4">
                            <FileText size={30} />

                            <span className="text-sm font-semibold text-green-200">
                                CITIZEN GRIEVANCE PORTAL
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold">
                            Submit a Grievance
                        </h1>

                        <p className="text-green-100 mt-3 leading-7">
                            Provide the details of your concern. Our system
                            will analyse your complaint and suggest the
                            appropriate department.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-7 md:p-9 space-y-6"
                    >

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                District *
                            </label>

                            <select
                                name="district"
                                value={form.district}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-700"
                            >
                                <option value="">
                                    Select your district
                                </option>

                                {districts.map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Grievance Category *
                            </label>

                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-700"
                            >
                                <option value="">
                                    Select a category
                                </option>

                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Subject *
                            </label>

                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="Enter a short subject"
                                maxLength={255}
                                required
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Detailed Description *
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Explain your grievance in detail..."
                                rows={6}
                                minLength={10}
                                maxLength={10000}
                                required
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-700 resize-y"
                            />

                            <p className="text-xs text-gray-400 text-right mt-2">
                                {form.description.length}/10000 characters
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Supporting Document (Optional)
                            </label>

                            <label className="border-2 border-dashed border-gray-300 rounded-xl p-7 flex flex-col items-center justify-center cursor-pointer hover:border-green-700 hover:bg-green-50 transition">

                                <Upload
                                    size={30}
                                    className="text-green-800 mb-3"
                                />

                                <span className="font-semibold text-gray-800 text-sm">
                                    Click to upload a file
                                </span>

                                <span className="text-xs text-gray-500 mt-2 text-center">
                                    JPG, PNG, PDF, DOC or DOCX · Maximum 5 MB
                                </span>

                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                    className="hidden"
                                />

                            </label>

                            {attachment && (
                                <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg mt-3">

                                    <div className="flex items-center gap-2 text-sm text-green-900 min-w-0">
                                        <FileText size={18} />

                                        <span className="truncate">
                                            {attachment.name}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setAttachment(null)}
                                        disabled={loading}
                                        className="text-red-600"
                                        aria-label="Remove attachment"
                                    >
                                        <X size={18} />
                                    </button>

                                </div>
                            )}
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">

                            <ShieldCheck
                                className="text-blue-800 shrink-0"
                                size={21}
                            />

                            <p className="text-xs text-blue-900 leading-6">
                                Your complaint details will be used to process
                                your grievance. AI-generated department and
                                priority suggestions are advisory and are not
                                official decisions.
                            </p>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-800 text-white py-4 rounded-lg font-bold hover:bg-green-900 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Submitting Grievance..."
                                : "Submit Grievance"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default SubmitGrievance;
