
require("dotenv").config();

const analyzeGrievance = async ({
    district,
    subject,
    description,
    departments
}) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

    if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
    }

    const departmentNames = departments.map(
        department => department.name
    );

    const prompt = `
You are an AI assistant for a Kerala public grievance
redressal prototype.

Analyze the following citizen complaint.

District: ${district}
Subject: ${subject}
Description: ${description}

Available departments:
${departmentNames.join("\n")}

Return ONLY a valid JSON object in this exact format:

{
  "department": "Exact department name from the available list",
  "category": "Short grievance category",
  "priority": "Low, Medium or High",
  "summary": "Short summary of the complaint"
}

Rules:
1. Select a department only from the supplied list.
2. Never invent a department.
3. Choose priority based on seriousness and urgency.
4. Do not make legal or official decisions.
5. Do not invent facts.
6. Keep the summary concise.
`;

    let response;

    try {
        response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.2,
                        responseMimeType: "application/json"
                    }
                }),
                signal: AbortSignal.timeout(15000)
            }
        );
    } catch (error) {
        if (error.name === "TimeoutError" || error.name === "AbortError") {
            throw new Error("Gemini request timed out after 15 seconds.");
        }

        throw new Error(`Gemini connection failed: ${error.message}`);
    }

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${error}`);
    }

    const result = await response.json();

    const generatedText =
        result.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("")
            .trim();

    if (!generatedText) {
        throw new Error("Gemini returned an empty response.");
    }

    let analysis;

    try {
        analysis = JSON.parse(generatedText);
    } catch {
        throw new Error("Gemini returned invalid JSON.");
    }

    const department = departments.find(
        item => item.name === analysis.department
    );

    const validPriorities = ["Low", "Medium", "High"];

    if (
        !department ||
        !validPriorities.includes(analysis.priority) ||
        !analysis.category ||
        !analysis.summary
    ) {
        throw new Error("Gemini returned invalid grievance analysis.");
    }

    return {
        department_id: department.id,
        department: department.name,
        category: analysis.category,
        priority: analysis.priority,
        summary: analysis.summary
    };
};

module.exports = analyzeGrievance;
