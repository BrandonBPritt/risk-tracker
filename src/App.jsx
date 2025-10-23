import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const RiskAssessmentTracker = () => {
  const [assessments, setAssessments] = useState([
    {
      id: 'IA-00910',
      auditType: 'Vendor Qualification',
      entity: 'PharmaLex',
      auditStartDate: '2025-03-24',
      riskAssessmentDate: '2025-06-25',
      isr: 'High',
      rcr: 'Low',
      ora: 'High',
      notes: 'CSV validation and QMS governance gaps'
    },
    {
      id: 'IA-00896',
      auditType: 'Internal Audit',
      entity: 'Data Management',
      auditStartDate: '2025-05-13',
      riskAssessmentDate: '2025-07-21',
      isr: 'Medium',
      rcr: 'High',
      ora: 'Medium',
      notes: 'Training CAPA effective, no repeat deviations'
    },
    {
      id: 'IA-00880',
      auditType: 'Process Audit',
      entity: 'Phlexeview',
      auditStartDate: '2025-07-21',
      riskAssessmentDate: '2025-08-04',
      isr: 'Low',
      rcr: 'Medium',
      ora: 'Low',
      notes: 'Phlexeview control enhancements implemented'
    }
  ]);

  const [filters, setFilters] = useState({
    auditStartDate: { from: '', to: '' },
    riskAssessmentDate: { from: '', to: '' },
    auditType: '',
    isr: '',
    rcr: '',
    ora: '',
    searchText: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editingIndex, setEditingIndex] = useState(null);

  const [newAssessment, setNewAssessment] = useState({
    id: '',
    auditType: '',
    entity: '',
    auditStartDate: '',
    riskAssessmentDate: '',
    isr: '',
    rcr: '',
    ora: '',
    notes: ''
  });

  const riskLevels = ['Low', 'Medium', 'High'];
  const auditTypes = ['Vendor Qualification', 'Internal Audit', 'Process Audit', 'Compliance Audit', 'System Audit'];

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      if (filters.auditStartDate.from && assessment.auditStartDate < filters.auditStartDate.from) return false;
      if (filters.auditStartDate.to && assessment.auditStartDate > filters.auditStartDate.to) return false;
      if (filters.riskAssessmentDate.from && assessment.riskAssessmentDate < filters.riskAssessmentDate.from) return false;
      if (filters.riskAssessmentDate.to && assessment.riskAssessmentDate > filters.riskAssessmentDate.to) return false;
      
      if (filters.auditType && assessment.auditType !== filters.auditType) return false;
      if (filters.isr && assessment.isr !== filters.isr) return false;
      if (filters.rcr && assessment.rcr !== filters.rcr) return false;
      if (filters.ora && assessment.ora !== filters.ora) return false;
      
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        return (
          assessment.id.toLowerCase().includes(searchLower) ||
          assessment.entity.toLowerCase().includes(searchLower) ||
          assessment.notes.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [assessments, filters]);

  const sortedAssessments = useMemo(() => {
    if (!sortConfig.key) return filteredAssessments;
    
    const sorted = [...filteredAssessments].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (sortConfig.key === 'auditStartDate' || sortConfig.key === 'riskAssessmentDate') {
        return sortConfig.direction === 'asc' 
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [filteredAssessments, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (filterType, value, subType = null) => {
    setFilters(prev => {
      if (subType) {
        return {
          ...prev,
          [filterType]: { ...prev[filterType], [subType]: value }
        };
      }
      return { ...prev, [filterType]: value };
    });
  };

  const clearFilters = () => {
    setFilters({
      auditStartDate: { from: '', to: '' },
      riskAssessmentDate: { from: '', to: '' },
      auditType: '',
      isr: '',
      rcr: '',
      ora: '',
      searchText: ''
    });
  };

  const handleAddAssessment = () => {
    if (newAssessment.id && newAssessment.entity) {
      setAssessments([...assessments, { ...newAssessment }]);
      setNewAssessment({
        id: '',
        auditType: '',
        entity: '',
        auditStartDate: '',
        riskAssessmentDate: '',
        isr: '',
        rcr: '',
        ora: '',
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  const handleEditAssessment = (index) => {
    setEditingIndex(index);
    setNewAssessment({ ...assessments[index] });
    setShowAddForm(true);
  };

  const handleUpdateAssessment = () => {
    if (newAssessment.id && newAssessment.entity && editingIndex !== null) {
      const updatedAssessments = [...assessments];
      updatedAssessments[editingIndex] = { ...newAssessment };
      setAssessments(updatedAssessments);
      setNewAssessment({
        id: '',
        auditType: '',
        entity: '',
        auditStartDate: '',
        riskAssessmentDate: '',
        isr: '',
        rcr: '',
        ora: '',
        notes: ''
      });
      setEditingIndex(null);
      setShowAddForm(false);
    }
  };

  const handleDeleteAssessment = (index) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      const updatedAssessments = assessments.filter((_, i) => i !== index);
      setAssessments(updatedAssessments);
    }
  };

  const handleCancelEdit = () => {
    setNewAssessment({
      id: '',
      auditType: '',
      entity: '',
      auditStartDate: '',
      riskAssessmentDate: '',
      isr: '',
      rcr: '',
      ora: '',
      notes: ''
    });
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const exportToCSV = () => {
    const headers = ['Audit ID', 'Audit Type', 'Entity/Vendor/Process', 'Audit Start Date', 'Risk Assessment Date', 'ISR', 'RCR', 'ORA', 'Key Drivers/Notes'];
    const csvContent = [
      headers.join(','),
      ...sortedAssessments.map(a => [
        a.id, a.auditType, a.entity, a.auditStartDate, a.riskAssessmentDate, a.isr, a.rcr, a.ora, `"${a.notes}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'risk_assessments.csv';
    a.click();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const analyticsData = useMemo(() => {
    const trendData = [...sortedAssessments]
      .sort((a, b) => new Date(a.riskAssessmentDate) - new Date(b.riskAssessmentDate))
      .map(assessment => ({
        date: formatDate(assessment.riskAssessmentDate),
        high: assessment.ora === 'High' ? 1 : 0,
        medium: assessment.ora === 'Medium' ? 1 : 0,
        low: assessment.ora === 'Low' ? 1 : 0
      }));

    let highCount = 0, mediumCount = 0, lowCount = 0;
    const cumulativeTrend = trendData.map(item => {
      highCount += item.high;
      mediumCount += item.medium;
      lowCount += item.low;
      return {
        date: item.date,
        High: highCount,
        Medium: mediumCount,
        Low: lowCount
      };
    });

    const typeDistribution = {};
    sortedAssessments.forEach(assessment => {
      if (!typeDistribution[assessment.auditType]) {
        typeDistribution[assessment.auditType] = { High: 0, Medium: 0, Low: 0 };
      }
      typeDistribution[assessment.auditType][assessment.ora]++;
    });

    const typeData = Object.entries(typeDistribution).map(([type, risks]) => ({
      type,
      High: risks.High,
      Medium: risks.Medium,
      Low: risks.Low
    }));

    const isrOraComparison = sortedAssessments.map(assessment => ({
      entity: assessment.entity,
      ISR: assessment.isr === 'High' ? 3 : assessment.isr === 'Medium' ? 2 : 1,
      ORA: assessment.ora === 'High' ? 3 : assessment.ora === 'Medium' ? 2 : 1
    }));

    const oraDistribution = [
      { name: 'High Risk', value: sortedAssessments.filter(a => a.ora === 'High').length, color: '#ef4444' },
      { name: 'Medium Risk', value: sortedAssessments.filter(a => a.ora === 'Medium').length, color: '#f59e0b' },
      { name: 'Low Risk', value: sortedAssessments.filter(a => a.ora === 'Low').length, color: '#10b981' }
    ].filter(item => item.value > 0);

    const riskChanges = {
      increased: 0,
      decreased: 0,
      unchanged: 0
    };

    sortedAssessments.forEach(assessment => {
      const isrLevel = assessment.isr === 'High' ? 3 : assessment.isr === 'Medium' ? 2 : 1;
      const oraLevel = assessment.ora === 'High' ? 3 : assessment.ora === 'Medium' ? 2 : 1;
      
      if (oraLevel > isrLevel) riskChanges.increased++;
      else if (oraLevel < isrLevel) riskChanges.decreased++;
      else riskChanges.unchanged++;
    });

    const riskChangeData = [
      { name: 'Risk Increased', value: riskChanges.increased, color: '#ef4444' },
      { name: 'Risk Decreased', value: riskChanges.decreased, color: '#10b981' },
      { name: 'Risk Unchanged', value: riskChanges.unchanged, color: '#6b7280' }
    ].filter(item => item.value > 0);

    return {
      cumulativeTrend,
      typeData,
      isrOraComparison,
      oraDistribution,
      riskChangeData
    };
  }, [sortedAssessments]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Risk Assessment Tracker</h1>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
              >
                {showAnalytics ? '📊 Hide Analytics' : '📊 Show Analytics'}
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                {showFilters ? '🔍 Hide Filters' : '🔍 Show Filters'}
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              >
                {showAddForm ? '✖ Cancel' : '➕ Add New'}
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
              >
                💾 Export CSV
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Total Assessments</div>
              <div className="text-2xl font-bold text-blue-900">{sortedAssessments.length}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-sm text-red-600 font-medium">High Risk (ORA)</div>
              <div className="text-2xl font-bold text-red-900">{sortedAssessments.filter(a => a.ora === 'High').length}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-sm text-yellow-600 font-medium">Medium Risk (ORA)</div>
              <div className="text-2xl font-bold text-yellow-900">{sortedAssessments.filter(a => a.ora === 'Medium').length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 font-medium">Low Risk (ORA)</div>
              <div className="text-2xl font-bold text-green-900">{sortedAssessments.filter(a => a.ora === 'Low').length}</div>
            </div>
          </div>
        </div>

        {showAnalytics && (
          <div className="space-y-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📈 Cumulative Risk Trend Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.cumulativeTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="High" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Medium" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Low" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Risk Distribution by Audit Type</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.typeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="High" fill="#ef4444" />
                    <Bar dataKey="Medium" fill="#f59e0b" />
                    <Bar dataKey="Low" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🥧 Current Risk Distribution (ORA)</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={analyticsData.oraDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.oraDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📈 Risk Level Changes (ISR → ORA)</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={analyticsData.riskChangeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.riskChangeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 ISR vs ORA Comparison by Entity</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.isrOraComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="entity" angle={-45} textAnchor="end" height={100} />
                    <YAxis ticks={[1, 2, 3]} tickFormatter={(value) => ['', 'Low', 'Medium', 'High'][value]} />
                    <Tooltip 
                      formatter={(value) => ['', 'Low', 'Medium', 'High'][value]}
                    />
                    <Legend />
                    <Bar dataKey="ISR" fill="#8b5cf6" />
                    <Bar dataKey="ORA" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm p-6 border border-purple-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 Key Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="text-sm text-gray-600 mb-1">High Risk Assessments</div>
                  <div className="text-2xl font-bold text-red-600">
                    {sortedAssessments.filter(a => a.ora === 'High').length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {sortedAssessments.length > 0 ? ((sortedAssessments.filter(a => a.ora === 'High').length / sortedAssessments.length) * 100).toFixed(1) : 0}% of total
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="text-sm text-gray-600 mb-1">Risk Improvements</div>
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsData.riskChangeData.find(d => d.name === 'Risk Decreased')?.value || 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ISR reduced to lower ORA
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="text-sm text-gray-600 mb-1">Most Common Audit Type</div>
                  <div className="text-sm font-bold text-purple-600">
                    {analyticsData.typeData.length > 0 
                      ? analyticsData.typeData.reduce((prev, curr) => 
                          (curr.High + curr.Medium + curr.Low) > (prev.High + prev.Medium + prev.Low) ? curr : prev
                        ).type 
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Based on assessment count
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">🔍 Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  value={filters.searchText}
                  onChange={(e) => handleFilterChange('searchText', e.target.value)}
                  placeholder="Search by ID, entity, or notes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audit Start Date (From)</label>
                <input
                  type="date"
                  value={filters.auditStartDate.from}
                  onChange={(e) => handleFilterChange('auditStartDate', e.target.value, 'from')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audit Start Date (To)</label>
                <input
                  type="date"
                  value={filters.auditStartDate.to}
                  onChange={(e) => handleFilterChange('auditStartDate', e.target.value, 'to')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Assessment Date (From)</label>
                <input
                  type="date"
                  value={filters.riskAssessmentDate.from}
                  onChange={(e) => handleFilterChange('riskAssessmentDate', e.target.value, 'from')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Assessment Date (To)</label>
                <input
                  type="date"
                  value={filters.riskAssessmentDate.to}
                  onChange={(e) => handleFilterChange('riskAssessmentDate', e.target.value, 'to')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audit Type</label>
                <select
                  value={filters.auditType}
                  onChange={(e) => handleFilterChange('auditType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {auditTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISR</label>
                <select
                  value={filters.isr}
                  onChange={(e) => handleFilterChange('isr', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  {riskLevels.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RCR</label>
                <select
                  value={filters.rcr}
                  onChange={(e) => handleFilterChange('rcr', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  {riskLevels.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ORA</label>
                <select
                  value={filters.ora}
                  onChange={(e) => handleFilterChange('ora', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  {riskLevels.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingIndex !== null ? '✏️ Edit Assessment' : '➕ Add New Assessment'}
              </h2>
              <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600 text-2xl">
                ✖
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audit ID *</label>
                <input
                  type="text"
                  value={newAssessment.id}
                  onChange={(e) => setNewAssessment({...newAssessment, id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="IA-00000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audit Type</label>
                <select
                  value={newAssessment.auditType}
                  onChange={(e) => setNewAssessment({...newAssessment, auditType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  {auditTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entity/Vendor/Process *</label>
                <input
                  type="text"
                  value={newAssessment.entity}
                  onChange={(e) => setNewAssessment({...newAssessment, entity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audit Start Date</label>
                <input
                  type="date"
                  value={newAssessment.auditStartDate}
                  onChange={(e) => setNewAssessment({...newAssessment, auditStartDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Assessment Date</label>
                <input
                  type="date"
                  value={newAssessment.riskAssessmentDate}
                  onChange={(e) => setNewAssessment({...newAssessment, riskAssessmentDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISR</label>
                <select
                  value={newAssessment.isr}
                  onChange={(e) => setNewAssessment({...newAssessment, isr: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Level</option>
                  {riskLevels.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RCR</label>
                <select
                  value={newAssessment.rcr}
                  onChange={(e) => setNewAssessment({...newAssessment, rcr: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Level</option>
                  {riskLevels.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ORA</label>
                <select
                  value={newAssessment.ora}
                  onChange={(e) => setNewAssessment({...newAssessment, ora: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Level</option>
                  {riskLevels.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Drivers / Notes</label>
                <textarea
                  value={newAssessment.notes}
                  onChange={(e) => setNewAssessment({...newAssessment, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingIndex !== null ? handleUpdateAssessment : handleAddAssessment}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingIndex !== null ? 'Update Assessment' : 'Add Assessment'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th onClick={() => handleSort('id')} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Audit ID <SortIcon columnKey="id" />
                  </th>
                  <th onClick={() => handleSort('auditType')} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Audit Type <SortIcon columnKey="auditType" />
                  </th>
                  <th onClick={() => handleSort('entity')} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Entity <SortIcon columnKey="entity" />
                  </th>
                  <th onClick={() => handleSort('auditStartDate')} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Audit Start <SortIcon columnKey="auditStartDate" />
                  </th>
                  <th onClick={() => handleSort('riskAssessmentDate')} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Risk Assessment <SortIcon columnKey="riskAssessmentDate" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ISR</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">RCR</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ORA</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Notes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAssessments.map((assessment, idx) => {
                  const originalIndex = assessments.findIndex(a => a === assessment);
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{assessment.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{assessment.auditType}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.entity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(assessment.auditStartDate)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(assessment.riskAssessmentDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getRiskColor(assessment.isr)}`}>
                          {assessment.isr}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getRiskColor(assessment.rcr)}`}>
                          {assessment.rcr}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getRiskColor(assessment.ora)}`}>
                          {assessment.ora}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{assessment.notes}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAssessment(originalIndex)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium"
                            title="Edit"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAssessment(originalIndex)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-medium"
                            title="Delete"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {sortedAssessments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No assessments found matching the current filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentTracker;
