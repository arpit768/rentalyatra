import { useState } from 'react';
import { AlertTriangle, Camera, Check, X, Plus } from 'lucide-react';
import type { DamagePoint } from '../types';

interface DamageTrackerProps {
  vehicleId: string;
  vehicleName: string;
  existingDamages?: DamagePoint[];
  onSave: (damages: DamagePoint[]) => void;
  readOnly?: boolean;
}

export default function DamageTracker({
  vehicleId,
  vehicleName,
  existingDamages = [],
  onSave,
  readOnly = false,
}: DamageTrackerProps) {
  const [damages, setDamages] = useState<DamagePoint[]>(existingDamages);
  const [selectedView, setSelectedView] = useState<'front' | 'back' | 'left' | 'right'>('front');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDamage, setNewDamage] = useState({
    part: 'bumper_front' as DamagePoint['part'],
    severity: 'low' as DamagePoint['severity'],
    description: '',
  });

  const viewDamages = damages.filter(d => d.view === selectedView);

  const partsByView = {
    front: ['bumper_front', 'hood', 'windshield', 'wheel'],
    back: ['bumper_rear', 'trunk', 'wheel'],
    left: ['door_left', 'wheel'],
    right: ['door_right', 'wheel'],
  };

  const getSeverityColor = (severity: DamagePoint['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
    }
  };

  const getSeverityBadge = (severity: DamagePoint['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
    }
  };

  const addDamage = () => {
    if (!newDamage.description.trim()) {
      alert('Please enter damage description');
      return;
    }

    const damage: DamagePoint = {
      id: Math.random().toString(36).substr(2, 9),
      part: newDamage.part,
      severity: newDamage.severity,
      description: newDamage.description,
      view: selectedView,
    };

    setDamages([...damages, damage]);
    setNewDamage({
      part: 'bumper_front',
      severity: 'low',
      description: '',
    });
    setShowAddModal(false);
  };

  const removeDamage = (id: string) => {
    setDamages(damages.filter(d => d.id !== id));
  };

  const handleSave = () => {
    onSave(damages);
  };

  const damageStats = {
    total: damages.length,
    critical: damages.filter(d => d.severity === 'critical').length,
    medium: damages.filter(d => d.severity === 'medium').length,
    low: damages.filter(d => d.severity === 'low').length,
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Damage Report</h2>
          <p className="text-gray-600">{vehicleName}</p>
        </div>
        {!readOnly && (
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Save Report
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900">{damageStats.total}</p>
          <p className="text-sm text-gray-600">Total Issues</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-600">{damageStats.critical}</p>
          <p className="text-sm text-gray-600">Critical</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-600">{damageStats.medium}</p>
          <p className="text-sm text-gray-600">Medium</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-600">{damageStats.low}</p>
          <p className="text-sm text-gray-600">Low</p>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex gap-2 mb-6">
        {(['front', 'back', 'left', 'right'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view)}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              selectedView === view
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)} View
            {damages.filter(d => d.view === view).length > 0 && (
              <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                {damages.filter(d => d.view === view).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Vehicle Diagram (Simplified) */}
      <div className="bg-gray-100 rounded-lg p-8 mb-6 relative">
        <div className="text-center mb-4">
          <p className="text-lg font-semibold text-gray-700">{selectedView.toUpperCase()} VIEW</p>
        </div>

        {/* Simple car outline representation */}
        <div className="relative mx-auto" style={{ width: '300px', height: '200px' }}>
          <svg viewBox="0 0 300 200" className="w-full h-full">
            {/* Simple car outline */}
            <rect x="50" y="60" width="200" height="80" fill="#e5e7eb" stroke="#374151" strokeWidth="2" rx="10"/>
            {/* Wheels */}
            <circle cx="80" cy="140" r="20" fill="#374151"/>
            <circle cx="220" cy="140" r="20" fill="#374151"/>
            {/* Windows */}
            <rect x="70" y="70" width="160" height="40" fill="#9ca3af" stroke="#374151" strokeWidth="1" rx="5"/>

            {/* Damage indicators */}
            {viewDamages.map((damage) => {
              // Position based on part
              const positions: Record<string, { x: number; y: number }> = {
                bumper_front: { x: 40, y: 100 },
                bumper_rear: { x: 260, y: 100 },
                hood: { x: 150, y: 50 },
                trunk: { x: 150, y: 50 },
                door_left: { x: 150, y: 100 },
                door_right: { x: 150, y: 100 },
                windshield: { x: 150, y: 75 },
                wheel: { x: 150, y: 140 },
              };

              const pos = positions[damage.part] || { x: 150, y: 100 };

              return (
                <g key={damage.id}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="12"
                    fill={damage.severity === 'critical' ? '#ef4444' : damage.severity === 'medium' ? '#f59e0b' : '#3b82f6'}
                    opacity="0.8"
                  />
                  <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">!</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Damage List */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Damages on {selectedView} view</h3>
          {!readOnly && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Damage
            </button>
          )}
        </div>

        {viewDamages.length === 0 ? (
          <div className="text-center py-8 bg-green-50 rounded-lg">
            <Check className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <p className="text-green-700 font-medium">No damages reported on this view</p>
          </div>
        ) : (
          viewDamages.map((damage) => (
            <div key={damage.id} className="bg-gray-50 rounded-lg p-4 border-l-4" style={{ borderLeftColor: getSeverityColor(damage.severity).replace('bg-', '#') }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900 capitalize">
                      {damage.part.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityBadge(damage.severity)}`}>
                      {damage.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700">{damage.description}</p>
                </div>
                {!readOnly && (
                  <button
                    onClick={() => removeDamage(damage.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Damage Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 m-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Damage - {selectedView} view</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Part</label>
                <select
                  value={newDamage.part}
                  onChange={(e) => setNewDamage({ ...newDamage, part: e.target.value as DamagePoint['part'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {partsByView[selectedView].map((part) => (
                    <option key={part} value={part}>
                      {part.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'critical'] as const).map((severity) => (
                    <button
                      key={severity}
                      onClick={() => setNewDamage({ ...newDamage, severity })}
                      className={`py-2 rounded-lg font-medium transition-colors ${
                        newDamage.severity === severity
                          ? getSeverityColor(severity) + ' text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newDamage.description}
                  onChange={(e) => setNewDamage({ ...newDamage, description: e.target.value })}
                  placeholder="Describe the damage in detail..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addDamage}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Add Damage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Card */}
      {damages.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">Inspection Summary</p>
              <p className="text-sm text-yellow-800 mt-1">
                {damageStats.total} issue(s) reported across all views.
                {damageStats.critical > 0 && ` ${damageStats.critical} critical issue(s) require immediate attention.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
