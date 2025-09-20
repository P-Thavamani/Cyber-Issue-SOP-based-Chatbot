import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserRole } from '../types';
import { MOCK_USER_ANALYTICS, MOCK_ADMIN_ANALYTICS } from '../constants';
import DashboardCard from '../components/DashboardCard';

interface DashboardPageProps {
  userRole: UserRole;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

const UserDashboard: React.FC = () => {
  const data = MOCK_USER_ANALYTICS;
  const issueData = data.frequentIssues.map(item => ({ name: item.issue, count: item.count }));
  const complianceData = [
      { name: 'NIST', value: data.complianceAdherence.nist },
      { name: 'ISO', value: data.complianceAdherence.iso },
      { name: 'GDPR', value: data.complianceAdherence.gdpr }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard title="Total SOPs Created" value={data.totalSops} />
      <DashboardCard title="SOP Completion Rate" value={`${data.completionRate}%`} />
      <DashboardCard title="Compliance Adherence">
        <ResponsiveContainer width="100%" height={150}>
            <PieChart>
                <Pie data={complianceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                    {complianceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
      </DashboardCard>
      <div className="md:col-span-2 lg:col-span-3">
        {/* Fix: Removed redundant `value` prop now that DashboardCard handles optional values. */}
        <DashboardCard title="Top 5 Frequent Issues">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={issueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip wrapperClassName="dark:!bg-gray-700 dark:!border-gray-600" />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </DashboardCard>
      </div>
    </div>
  );
};


const AdminDashboard: React.FC = () => {
  const data = MOCK_ADMIN_ANALYTICS;
  const teamData = data.teamPerformance.map(item => ({ name: item.team, 'Completion Rate': item.completionRate }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard title="Total SOPs (All Users)" value={data.totalSops} />
      <DashboardCard title="Avg. Completion Rate" value={`${data.completionRate}%`} />
      <DashboardCard title="Unresolved Issues" value={data.unresolvedIssues} />
      <DashboardCard title="Evidence Submissions" value={data.evidenceStats.total} />
      <div className="md:col-span-2 lg:col-span-4">
        {/* Fix: Removed redundant `value` prop now that DashboardCard handles optional values. */}
        <DashboardCard title="Team Performance">
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip wrapperClassName="dark:!bg-gray-700 dark:!border-gray-600" />
                    <Legend />
                    <Bar dataKey="Completion Rate" fill="#8b5cf6" />
                </BarChart>
            </ResponsiveContainer>
        </DashboardCard>
      </div>
    </div>
  )
};


const DashboardPage: React.FC<DashboardPageProps> = ({ userRole }) => {
  return (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">{userRole} Dashboard</h1>
        {userRole === UserRole.Admin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
};

export default DashboardPage;
