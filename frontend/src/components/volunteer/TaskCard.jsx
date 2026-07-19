import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Clock, MapPin, Brain, ChevronDown, CheckCircle } from 'lucide-react';

export default function TaskCard({ assignment, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const [accepted, setAccepted] = useState(false);

  if (!assignment) return null;

  return (
    <Card 
      animate 
      className={`transition-all duration-300 ${accepted ? 'opacity-60 grayscale-[0.5]' : ''}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex justify-between items-start mb-3">
        <Badge status={assignment.priority} />
        <div className="flex items-center text-gray-400 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>~{assignment.estimated_minutes} min</span>
        </div>
      </div>
      
      <div className="flex items-center text-blue-400 text-sm mb-2 font-medium">
        <MapPin className="h-4 w-4 mr-1" />
        {assignment.zone}
      </div>
      
      <h3 className="text-xl font-bold mb-4">{assignment.task}</h3>
      
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4 w-full"
      >
        <Brain className="h-4 w-4 mr-1 text-purple-400" />
        <span className="flex-1 text-left">AI Reasoning & Guidelines</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      {expanded && (
        <div className="bg-white/5 rounded-lg p-4 mb-4 text-sm space-y-3 animate-slide-up">
          <div>
            <span className="text-gray-400 text-xs uppercase block mb-1">Reasoning</span>
            <p className="text-gray-200">{assignment.reasoning}</p>
          </div>
          {assignment.suggested_response && (
            <div>
              <span className="text-gray-400 text-xs uppercase block mb-1">Suggested Script</span>
              <p className="text-blue-200 italic border-l-2 border-blue-500 pl-2">"{assignment.suggested_response}"</p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
        <Button 
          variant={accepted ? 'secondary' : 'primary'} 
          className="flex-1"
          onClick={() => setAccepted(!accepted)}
          icon={accepted ? CheckCircle : null}
        >
          {accepted ? 'Task Accepted' : 'Accept Task'}
        </Button>
        <Button variant="ghost">View Zone</Button>
      </div>
    </Card>
  );
}
