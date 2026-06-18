"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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

export default function Home() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const departmentColors: Record<string, string> = {
    Finance: "bg-green-100 text-green-700",
    HR: "bg-purple-100 text-purple-700",
    IT: "bg-blue-100 text-blue-700",
    Legal: "bg-red-100 text-red-700",
    Operations: "bg-orange-100 text-orange-700",
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
      <h1 className="text-4xl font-bold mb-8">
        Audit Intelligence Platform
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-gray-500 text-sm">
            Total Policies
          </h2>
          <p className="text-4xl font-bold mt-2">
            {dashboard.total_policies}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-gray-500 text-sm">
            Compliant
          </h2>
          <p className="text-4xl font-bold mt-2 text-green-600">
            {dashboard.compliant_policies}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-gray-500 text-sm">
            At Risk
          </h2>
          <p className="text-4xl font-bold mt-2 text-yellow-600">
            {dashboard.at_risk_policies}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-gray-500 text-sm">
            Audit Readiness
          </h2>
          <p className="text-4xl font-bold mt-2 text-blue-600">
            {dashboard.audit_readiness}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Department Compliance Score
          </h2>

          <div className="h-96">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={departments}>
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="average_compliance_score"
                  fill="#3B82F6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Risk Distribution
          </h2>

          <div className="h-96">
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
                  outerRadius={120}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
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
      <div className="bg-white rounded-xl shadow p-6">
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
              className="border border-gray-300 rounded-lg px-3 py-2 w-64"
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
              <tr className="bg-slate-100 border-b">
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
              </tr>
            </thead>

            <tbody>
              {filteredRisks
                .slice(0, 10)
                .map((risk) => (
                  <tr
                    key={risk.policy_id}
                    className="border-b hover:bg-slate-50 transition-colors duration-200"
                  >
                    <td className="p-3">
                      {risk.policy_id}
                    </td>
                    <td className="p-3">
                      {risk.policy_name}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          departmentColors[risk.department] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {risk.department}
                      </span>
                    </td>

                    
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-red-600 font-bold">
                          {risk.compliance_score}
                        </span>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getSeverity(risk.compliance_score).color
                          }`}
                        >
                          {getSeverity(risk.compliance_score).label}
                        </span>

                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${100 - risk.compliance_score}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {risk.critical_findings}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}