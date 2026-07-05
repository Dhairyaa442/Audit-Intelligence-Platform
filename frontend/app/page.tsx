"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { LabelList } from "recharts";
import ReactMarkdown from "react-markdown";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  ShieldCheck,
  AlertTriangle,
  BrainCircuit,
  Building2,
  TrendingUp,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";

type Policy = {
  policy_id: string;
  policy_name: string;
  department: string;
  compliance_score: number;
  critical_findings: number;
};

export default function Home() {
  const API = "http://127.0.0.1:8000";
  const [dashboard, setDashboard] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [analysis, setAnalysis] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const departmentColors: Record<string, string> = {
    Finance: "bg-green-100 text-green-700",
    HR: "bg-purple-100 text-purple-700",
    IT: "bg-blue-100 text-blue-700",
    Legal: "bg-red-100 text-red-700",
    Operations: "bg-orange-100 text-orange-700",
  };

  const [roadmap, setRoadmap] = useState("");
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  const analyzePolicy = async (policy: any) => {
    setLoadingAI(true);

    try {
      const res = await axios.post(
        `${API}/analyze-policy`,
        policy
      );

      setAnalysis(res.data.analysis);

    } catch (err) {
      console.error(err);
      setAnalysis("Failed to generate AI analysis.");

    } finally {
      setLoadingAI(false);
    }
  };

  const askAI = async () => {
    if (!question.trim() || !selectedPolicy) return;

    const userMessage = {
      role: "user" as const,
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatLoading(true);

    try {
      const res = await axios.post(`${API}/policy-chat`, {
        policy_name: selectedPolicy.policy_name,
        department: selectedPolicy.department,
        report: analysis,
        question,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.answer,
        },
      ]);

      setQuestion("");
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't generate a response.",
        },
      ]);
    }

    setChatLoading(false);
  };

  const generateRoadmap = async () => {
    if (!selectedPolicy) return;

    setLoadingRoadmap(true);

    try {
      const res = await axios.post(
        `${API}/generate-roadmap`,
        {
          policy_name: selectedPolicy.policy_name,
          department: selectedPolicy.department,
          report: analysis,
        }
      );

      setRoadmap(res.data.roadmap);
    } catch (err) {
      console.error(err);
      setRoadmap("Failed to generate roadmap.");
    }

    setLoadingRoadmap(false);
  };
const [question, setQuestion] = useState("");
const [chatLoading, setChatLoading] = useState(false);

const downloadReport = async () => {
  if (!selectedPolicy) return;

  const res = await axios.post(
    `${API}/generate-report`,
    {
      policy_name: selectedPolicy.policy_name,
      department: selectedPolicy.department,
      analysis,
      roadmap,
    },
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(res.data);

  const link = document.createElement("a");

  link.href = url;
  link.download = "Executive_Audit_Report.pdf";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};

const [messages, setMessages] = useState<
  {
    role: "user" | "assistant";
    content: string;
  }[]
>([]);

const suggestions = [
  "Summarize this policy",
  "What are the biggest risks?",
  "What controls are missing?",
  "How can this policy be improved?",
  "Which regulations apply?",
];

const [training, setTraining] = useState(60);
const [documentation, setDocumentation] = useState(60);
const [auditFrequency, setAuditFrequency] = useState(60);
const [automation, setAutomation] = useState(60);

const [simulation, setSimulation] = useState<any>(null);
const [loadingSimulation, setLoadingSimulation] = useState(false);

const runSimulation = async () => {
  if (!selectedPolicy) return;

  setLoadingSimulation(true);

  try {
    const res = await axios.post(
      `${API}/simulate-compliance`,
      {
        policy_name: selectedPolicy.policy_name,
        department: selectedPolicy.department,
        current_score: selectedPolicy.compliance_score,
        training,
        documentation,
        audit_frequency: auditFrequency,
        automation,
      }
    );

    setSimulation(res.data);

  } catch (err) {
    console.error(err);
    alert("Simulation failed.");
  } finally {
    setLoadingSimulation(false);
  }
};

const getSeverity = (score: number) => {
  if (score < 60)
    return {
      label: "Critical",
      color: "bg-red-100 text-red-700",
    };

  if (score < 70)
    return {
      label: "High",
      color: "bg-orange-100 text-orange-700",
    };

  if (score < 80)
    return {
      label: "Medium",
      color: "bg-yellow-100 text-yellow-700",
    };

  return {
    label: "Low",
    color: "bg-green-100 text-green-700",
  };
};

useEffect(() => {
  
  axios
    .get("http://127.0.0.1:8000/dashboard")
    .then((res) => setDashboard(res.data))
    .catch((err) => console.error(err));

  axios
    .get("http://127.0.0.1:8000/departments")
    .then((res) => setDepartments(res.data))
    .catch((err) => console.error(err));

  axios
    .get("http://127.0.0.1:8000/risks")
    .then((res) => setRisks(res.data))
    .catch((err) => console.error(err));
}, []);


useEffect(() => {
  if (!selectedPolicy) return;

  setSimulation(null);

  setTraining(60);
  setDocumentation(60);
  setAuditFrequency(60);
  setAutomation(60);
}, [selectedPolicy]);

const filteredRisks = risks.filter((risk) => {
  const departmentMatch =
    selectedDepartment === "All" ||
    risk.department === selectedDepartment;

  const searchMatch = risk.policy_name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  return departmentMatch && searchMatch;
});

const riskSummary = [
  {
    name: "Critical",
    value: risks.filter((r) => r.compliance_score < 60).length,
  },
  {
    name: "High",
    value: risks.filter(
      (r) => r.compliance_score >= 60 && r.compliance_score < 70
    ).length,
  },
  {
    name: "Medium",
    value: risks.filter(
      (r) => r.compliance_score >= 70 && r.compliance_score < 80
    ).length,
  },
  {
    name: "Low",
    value: risks.filter((r) => r.compliance_score >= 80).length,
  },
].filter((item) => item.value > 0);

const COLORS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
];

if (!dashboard) {
  return (
    <main className="min-h-screen bg-slate-100 p-8 text-black">
      <h1 className="text-4xl font-bold mb-8">
        Audit Intelligence Platform
      </h1>
      <p>Loading...</p>
    </main>
  );
}

return (
  <main className="min-h-screen bg-slate-100 p-8 text-black">
    <h1 className="text-4xl font-bold">
      Audit Intelligence Platform
    </h1>
    <p className="text-gray-500 mt-2">
      Enterprise Compliance & Risk Intelligence, Real-time audit analytics powered by AI.
    </p>

    {/* KPI Cards */}

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-start">

          <div>
            <p className="text-gray-500 text-sm font-medium">
              Total Policies
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {dashboard.total_policies}
            </h2>

            <p className="flex items-center gap-1 mt-3 text-blue-600 text-sm">
              <FileText size={16} />
              Enterprise Policies
            </p>
          </div>

          <div className="bg-blue-100 rounded-xl p-4">
            <FileText
              size={30}
              className="text-blue-600"
            />
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-start">

          <div>
            <p className="text-gray-500 text-sm font-medium">
              Compliant Policies
            </p>

            <h2 className="text-4xl font-bold mt-2 text-green-600">
              {dashboard.compliant_policies}
            </h2>

            <p className="mt-3 text-green-600 text-sm">
              Meeting Standards
            </p>
          </div>

          <div className="bg-green-100 rounded-xl p-4">
            <ShieldCheck
              size={30}
              className="text-green-600"
            />
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-start">

          <div>
            <p className="text-gray-500 text-sm font-medium">
              At Risk
            </p>

            <h2 className="text-4xl font-bold mt-2 text-orange-500">
              {dashboard.high_risk_policies}
            </h2>

            <p className="flex items-center gap-1 mt-3 text-orange-500 text-sm">
              <TrendingUp size={16} />
              Immediate Attention
            </p>
          </div>

          <div className="bg-orange-100 rounded-xl p-4">
            <AlertTriangle
              size={30}
              className="text-orange-500"
            />
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-start">

          <div>
            <p className="text-gray-500 text-sm font-medium">
              Audit Readiness
            </p>

            <h2 className="text-4xl font-bold mt-2 text-indigo-600">
              {dashboard.audit_readiness}%
            </h2>

            <p className="flex items-center gap-1 mt-3 text-indigo-600 text-sm">
              <BrainCircuit size={16} />
              AI Powered
            </p>
          </div>

          <div className="bg-indigo-100 rounded-xl p-4">
            <BrainCircuit
              size={30}
              className="text-indigo-600"
            />
          </div>

        </div>
      </div>
    </div>
    {/* Charts */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">

      {/* Department Compliance */}
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 border border-gray-100">

        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Department Compliance
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Average compliance score by department
            </p>
          </div>

          <div className="bg-blue-100 rounded-xl p-3">
            <Building2
              size={24}
              className="text-blue-600"
            />
          </div>

        </div>

        <div className="h-72 flex items-center justify-center">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={departments}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toFixed(1)}%`,
                  "Average Score",
                ]}
              />
              <Bar
                dataKey="average_compliance_score"
                fill="#2563EB"
                radius={[8, 8, 0, 0]}
              >
                <LabelList
                  dataKey="average_compliance_score"
                  position="top"
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                  fill="#374151"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 border border-gray-100">

        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Risk Distribution
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enterprise risk exposure
            </p>
          </div>

          <div className="bg-red-100 rounded-xl p-3">
            <AlertTriangle
              size={24}
              className="text-red-500"
            />
          </div>

        </div>
        <div className="h-72">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={riskSummary}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={125}
                paddingAngle={3}
                label={({ name, percent }) => {
                  const p = percent ?? 0;
                  return `${name} ${(p * 100).toFixed(0)}%`;
                }}
              >
                {riskSummary.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    {/* High Risk Policies */}
    <div className="bg-white
          rounded-2xl
          shadow-lg
          hover:shadow-2xl
          transition-all
          duration-300
          border
          border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          High Risk Policies
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search Policy..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-3 py-2 w-64
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition duration-200 outline-none"
          />

          <select
            value={selectedDepartment}
            onChange={(e) =>
              setSelectedDepartment(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            <option value="All">
              All Departments
            </option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Legal">Legal</option>
            <option value="Operations">
              Operations
            </option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b text-gray-700 uppercase text-xs tracking-wider">
              <th className="text-left p-3">
                Policy ID
              </th>
              <th className="text-left p-3">
                Policy Name
              </th>
              <th className="text-left p-3">
                Department
              </th>
              <th className="text-left p-3">
                Score
              </th>
              <th className="text-left p-3">
                Critical Findings
              </th>
              <th className="text-left p-3">
                AI Copilot
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredRisks
              .slice(0, 10)
              .map((risk) => (
                <tr
                  key={risk.policy_id}
                  className="border-b hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="p-3">
                    {risk.policy_id}
                  </td>
                  <td className="p-3">
                    {risk.policy_name}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${departmentColors[risk.department] ||
                        "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {risk.department}
                    </span>
                  </td>


                  <td className="p-3">
                    <div className="flex items-center gap-3">

                      <span
                        className={`font-bold text-lg ${risk.compliance_score >= 80
                            ? "text-green-600"
                            : risk.compliance_score >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                      >
                        {risk.compliance_score}%
                      </span>

                      <div className="w-28">
                        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">

                          <div
                            className={`h-full ${risk.compliance_score >= 80
                                ? "bg-green-500"
                                : risk.compliance_score >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            style={{
                              width: `${risk.compliance_score}%`,
                            }}
                          />

                        </div>
                      </div>

                    </div>
                  </td>
                  <td className="p-3">
                    <span className="flex items-center gap-2">
                      <AlertTriangle size={15} className="text-red-500" />
                      {risk.critical_findings}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={async () => {
                        setSelectedPolicy(risk);
                        setShowModal(true);
                        setMessages([]);
                        setQuestion("");
                        await analyzePolicy(risk);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                    >
                      AI Analyze
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
    {showModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              AI Audit Copilot
            </h2>

            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 text-xl"
            >
              ✕
            </button>
          </div>

          {selectedPolicy && (
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedPolicy.policy_name}
              </h3>

              <p className="text-gray-500 mb-4">
                Department: {selectedPolicy.department}
              </p>
            </>
          )}

          {loadingAI ? (
            <div className="flex flex-col items-center justify-center py-16">

              <BrainCircuit
                size={56}
                className="text-blue-600 animate-pulse mb-5"
              />

              <h3 className="text-xl font-semibold text-gray-800">
                AI is analyzing this policy
              </h3>

              <p className="text-gray-500 mt-2">
                Reviewing compliance, risks, and recommendations...
              </p>

            </div>
          ) : (
            <div className="mt-5 bg-slate-50 rounded-xl border border-slate-200 p-5">

            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BrainCircuit className="text-blue-600" size={22} />
              AI Compliance Report
            </h3>

            <div className="mt-8">

            <div className="whitespace-pre-wrap text-gray-700 leading-8">
              {analysis}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">

              <button
                onClick={generateRoadmap}
                disabled={loadingRoadmap}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-medium disabled:opacity-50"
              >
                {loadingRoadmap
                  ? "Generating..."
                  : "📋 Generate Remediation Roadmap"}
              </button>

              <button
                onClick={downloadReport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
              >
                📄 Download Executive Report
              </button>

            </div>

            {loadingRoadmap && (

            <div className="mt-6 p-5 rounded-xl bg-green-50 border">

              Generating AI Roadmap...

            </div>

          )}

          {roadmap && (

            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5">

              <h3 className="font-bold text-lg mb-4">
                📋 AI Remediation Roadmap
              </h3>
              <div className="prose max-w-none">
                <ReactMarkdown>
                  {roadmap}
                </ReactMarkdown>
              </div>

            </div>
            

          )}
          <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">

          <h3 className="text-xl font-bold mb-5">
            📈 AI Compliance Simulator
          </h3>

          {/* Training */}

          <div className="mb-5">
            <div className="flex justify-between mb-1">
              <span>Training Coverage</span>
              <span>{training}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={training}
              onChange={(e)=>setTraining(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Documentation */}

          <div className="mb-5">
            <div className="flex justify-between mb-1">
              <span>Documentation Quality</span>
              <span>{documentation}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={documentation}
              onChange={(e)=>setDocumentation(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Audit */}

          <div className="mb-5">
            <div className="flex justify-between mb-1">
              <span>Audit Frequency</span>
              <span>{auditFrequency}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={auditFrequency}
              onChange={(e)=>setAuditFrequency(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Automation */}

          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span>Automation Level</span>
              <span>{automation}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={automation}
              onChange={(e)=>setAutomation(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={runSimulation}
            disabled={loadingSimulation}
            className={`px-5 py-3 rounded-lg text-white transition ${
              loadingSimulation
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loadingSimulation
              ? "Running Simulation..."
              : "Run AI Simulation"}
          </button>

        </div>
              {loadingSimulation ? (
        <div className="mt-6 rounded-xl bg-white p-8 border flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        simulation && (
          <div className="mt-6 rounded-xl bg-white p-5 border animate-fade-in">

            <h3 className="font-bold text-xl mb-4">
              AI Prediction
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              <div>
                <p className="text-gray-500">
                  Current Score
                </p>

                <p className="text-3xl font-bold">
                  {selectedPolicy?.compliance_score}%
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Predicted Score
                </p>

                <p className="text-3xl font-bold text-green-600">
                  {simulation.predicted_score}%
                </p>
                <div className="mt-2 h-2 rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      simulation.predicted_score >= 80
                        ? "bg-green-500"
                        : simulation.predicted_score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${simulation.predicted_score}%` }}
                  />
                </div>
                <p className="text-gray-500">
                  Risk Level
                </p>

                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                    simulation.risk === "Low"
                      ? "bg-green-100 text-green-700"
                      : simulation.risk === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : simulation.risk === "High"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {simulation.risk}
                </span>
              </div>

              <div>
                <p className="text-gray-500">
                  Critical Findings
                </p>

                <p
                  className={`font-semibold ${
                    simulation.critical_findings === 0
                      ? "text-green-600"
                      : simulation.critical_findings <= 2
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {simulation.critical_findings}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Improvement
                </p>

                <p className="text-2xl font-bold text-green-600">
                  +{simulation.predicted_score - selectedPolicy!.compliance_score}%
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h4 className="font-semibold text-lg">
                    AI Explanation
                </h4>
            </div>
            <p className="leading-8 text-gray-800">
                {simulation.explanation}
            </p>
            

          </div>
        )
      )}

              <h3 className="font-semibold text-xl mb-4">
                💬 Ask AI
              </h3>

              <div className="flex gap-3">

              <input
              value={question}
              onChange={(e)=>setQuestion(e.target.value)}
              placeholder="Ask about this policy..."
              className="flex-1 border rounded-lg px-4 py-3"
              />

              <button
                onClick={askAI}
                disabled={chatLoading}
                className="bg-blue-600 text-white px-5 rounded-lg disabled:opacity-50"
              >
                {chatLoading ? "Thinking..." : "Send"}
              </button>

              </div>

            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  className="px-3 py-2 rounded-full bg-slate-100 hover:bg-blue-100 transition"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-4">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded-xl p-4 ${
                  msg.role === "user"
                    ? "bg-blue-50"
                    : "bg-gray-100"
                }`}
              >
                <div className="font-semibold mb-2">
                  {msg.role === "user"
                    ? "You"
                    : "AI Copilot"}
                </div>

                <p className="whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            ))}
            </div>

          </div>
          )}
        </div>
      </div>
    )}
  </main>
  );
}