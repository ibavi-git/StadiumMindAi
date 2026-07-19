import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Copy, Printer, AlertOctagon, CheckCircle2, Megaphone, Users, ArrowRightCircle } from 'lucide-react';

export default function ResponseCard({ response }) {
  if (!response) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Could show a toast here if we had one globally
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card animate glow={response.severity === 'CRITICAL' ? 'red' : 'blue'} className="h-full overflow-y-auto print:bg-white print:text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-red-500/20 p-3 rounded-full">
            <AlertOctagon className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white print:text-black">AI Response Plan</h2>
            <div className="flex gap-2 mt-1">
              <Badge status={response.severity} />
              <Badge status="ACTIVE" label={response.emergency_type} />
              <Badge status="ACTIVE" label={response.zone} />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0 print:hidden">
          <Button variant="secondary" size="sm" icon={Printer} onClick={handlePrint}>Print</Button>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Volunteer Instructions */}
        {response.volunteer_instructions && response.volunteer_instructions.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold flex items-center text-blue-400">
                <Users className="h-5 w-5 mr-2" />
                Volunteer Instructions
              </h3>
            </div>
            <div className="space-y-3">
              {response.volunteer_instructions.map((inst, idx) => (
                <div key={idx} className="flex items-start bg-white/5 p-3 rounded-lg print:border print:border-gray-300">
                  <CheckCircle2 className="h-5 w-5 mr-3 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-200 print:text-gray-800">{inst}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Public Announcement */}
        {response.public_announcement && (
          <section>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold flex items-center text-yellow-400">
                <Megaphone className="h-5 w-5 mr-2" />
                Public Announcement Script
              </h3>
              <button onClick={() => handleCopy(response.public_announcement)} className="text-gray-400 hover:text-white print:hidden">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-black/50 border border-yellow-500/30 p-4 rounded-lg font-mono text-yellow-100 text-sm md:text-base print:border-gray-800 print:text-black">
              "{response.public_announcement}"
            </div>
          </section>
        )}

        {/* Organizer Recommendations */}
        {response.organizer_recommendations && response.organizer_recommendations.length > 0 && (
          <section>
            <h3 className="text-lg font-bold flex items-center text-purple-400 mb-3">
              <ArrowRightCircle className="h-5 w-5 mr-2" />
              Organizer Actions
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300 print:text-gray-800 marker:text-purple-500">
              {response.organizer_recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Evacuation Guidance */}
        {response.evacuation_guidance && (
          <section className="bg-red-900/30 border border-red-500/50 p-5 rounded-xl print:border-red-600 print:text-red-800">
            <h3 className="text-lg font-bold flex items-center text-red-400 mb-3 print:text-red-600">
              <AlertOctagon className="h-5 w-5 mr-2" />
              Evacuation Protocol
            </h3>
            <p className="text-red-100 font-medium whitespace-pre-wrap">{response.evacuation_guidance}</p>
          </section>
        )}
        
      </div>
    </Card>
  );
}
