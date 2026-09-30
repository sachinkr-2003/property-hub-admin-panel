import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  trend, 
  isPositive = true, 
  icon: Icon, 
  accentColor = 'var(--accent-primary)',
  glowColor = 'var(--glow-primary)'
}) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div 
          className="stat-icon-wrapper" 
          style={{ 
            backgroundColor: `${accentColor}15`, 
            color: accentColor,
            border: `1px solid ${accentColor}30` 
          }}
        >
          {Icon && <Icon size={18} />}
        </div>
      </div>

      <div className="stat-value">{value}</div>

      {trend && (
        <div className="stat-footer">
          <span className={`stat-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </span>
          <span>vs previous period</span>
        </div>
      )}
    </div>
  );
}
