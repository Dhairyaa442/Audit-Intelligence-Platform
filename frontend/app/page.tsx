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
} from "recharts";

export default function Home() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/dashboard")
      .then((res) => setDashboard(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://127.0.0.1:8000/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!dashboard) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <h1 className="text-4xl font-bold mb-8">
          Audit Intelligence Platform
        </h1>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-4xl font-bold mb-8">
        Audit Intelligence Platform
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500 text-sm">Total Policies</h2>
          <p className="text-4xl font-bold mt-2">
            {dashboard.total_policies}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500 text-sm">Compliant</h2>
          <p className="text-4xl font-bold mt-2 text-green-600">
            {dashboard.compliant_policies}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500 text-sm">At Risk</h2>
          <p className="text-4xl font-bold mt-2 text-yellow-600">
            {dashboard.at_risk_policies}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500 text-sm">Audit Readiness</h2>
          <p className="text-4xl font-bold mt-2 text-blue-600">
            {dashboard.audit_readiness}%
          </p>
        </div>
      </div>

      {/* Department Compliance Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Department Compliance Score
        </h2>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
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
    </main>
  );
}