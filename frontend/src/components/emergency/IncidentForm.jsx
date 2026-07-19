import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function IncidentForm({ onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    type: 'MEDICAL',
    severity: 'MODERATE',
    zone: 'ZONE_CONCOURSE',
    gate: '',
    description: '',
    reported_by: ''
  });

  const isValid = formData.description.length >= 10 && formData.reported_by.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card animate glow="red" className="border-t-4 border-t-red-500">
      <h2 className="text-xl font-bold mb-4">Report Incident</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Incident Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="input-field appearance-none">
              <option value="MEDICAL">Medical Emergency</option>
              <option value="SECURITY">Security Incident</option>
              <option value="WEATHER">Severe Weather</option>
              <option value="FIRE">Fire / Hazard</option>
              <option value="EVACUATION">Evacuation Required</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Severity</label>
            <select name="severity" value={formData.severity} onChange={handleChange} className="input-field appearance-none">
              <option value="LOW">Low</option>
              <option value="MODERATE">Moderate</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Zone</label>
            <select name="zone" value={formData.zone} onChange={handleChange} className="input-field appearance-none">
              <option value="ZONE_NORTH">North Stand</option>
              <option value="ZONE_SOUTH">South Stand</option>
              <option value="ZONE_EAST">East Stand</option>
              <option value="ZONE_WEST">West Stand</option>
              <option value="ZONE_FIELD_LEVEL">Field Level</option>
              <option value="ZONE_CONCOURSE">Main Concourse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Gate / Section (Optional)</label>
            <input 
              type="text" 
              name="gate" 
              value={formData.gate} 
              onChange={handleChange} 
              placeholder="e.g. Gate C, Sec 112"
              className="input-field" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows="3"
            placeholder="Detailed description of the incident..."
            className="input-field resize-none"
          ></textarea>
          {formData.description.length > 0 && formData.description.length < 10 && (
            <p className="text-red-400 text-xs mt-1">Description must be at least 10 characters.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Reported By</label>
          <input 
            type="text" 
            name="reported_by" 
            value={formData.reported_by} 
            onChange={handleChange} 
            placeholder="Your Name / ID"
            className="input-field" 
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="danger" loading={loading} disabled={!isValid} className="flex-1">
            Submit Report
          </Button>
        </div>

      </form>
    </Card>
  );
}
