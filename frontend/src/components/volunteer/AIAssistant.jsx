import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Copy, ChevronDown, Zap } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import { useToast } from '../../context/ToastContext';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

/**
 * Parses the 8-field structured AI response into an array of sections.
 * Fields are delimited by **🎯 FIELDNAME:** markers.
 */
function parseStructuredResponse(text) {
  if (!text) return null;

  const FIELDS = [
    { key: 'situation',   label: '🎯 SITUATION',        emoji: '🎯' },
    { key: 'analysis',    label: '🔍 ANALYSIS',          emoji: '🔍' },
    { key: 'reasoning',   label: '💡 REASONING',         emoji: '💡' },
    { key: 'action',      label: '✅ RECOMMENDED ACTION', emoji: '✅' },
    { key: 'priority',    label: '⚠️ PRIORITY',          emoji: '⚠️' },
    { key: 'outcome',     label: '📈 EXPECTED OUTCOME',  emoji: '📈' },
    { key: 'confidence',  label: '🎯 CONFIDENCE',        emoji: '🎯' },
    { key: 'safety',      label: '🛡️ SAFETY NOTES',     emoji: '🛡️' },
  ];

  const sections = [];
  let remaining = text;

  for (let i = 0; i < FIELDS.length; i++) {
    const field = FIELDS[i];
    const nextField = FIELDS[i + 1];

    const startMarker = `**${field.label}:**`;
    const startIdx = remaining.indexOf(startMarker);
    if (startIdx === -1) continue;

    const contentStart = startIdx + startMarker.length;
    let contentEnd = remaining.length;

    if (nextField) {
      const nextMarker = `**${nextField.label}:**`;
      const nextIdx = remaining.indexOf(nextMarker, contentStart);
      if (nextIdx !== -1) contentEnd = nextIdx;
    }

    const content = remaining.slice(contentStart, contentEnd).trim();
    if (content) {
      sections.push({ key: field.key, label: field.label.replace(/[🎯🔍💡✅⚠️📈🛡️] /, ''), content });
    }
  }

  return sections.length >= 3 ? sections : null;
}

const SECTION_STYLES = {
  situation:  { bg: 'bg-blue-900/20',   border: 'border-blue-500/40',   title: 'text-blue-300' },
  analysis:   { bg: 'bg-purple-900/20', border: 'border-purple-500/40', title: 'text-purple-300' },
  reasoning:  { bg: 'bg-cyan-900/20',   border: 'border-cyan-500/40',   title: 'text-cyan-300' },
  action:     { bg: 'bg-green-900/20',  border: 'border-green-500/40',  title: 'text-green-300' },
  priority:   { bg: 'bg-orange-900/20', border: 'border-orange-500/40', title: 'text-orange-300' },
  outcome:    { bg: 'bg-teal-900/20',   border: 'border-teal-500/40',   title: 'text-teal-300' },
  confidence: { bg: 'bg-indigo-900/20', border: 'border-indigo-500/40', title: 'text-indigo-300' },
  safety:     { bg: 'bg-red-900/20',    border: 'border-red-500/40',    title: 'text-red-300' },
};

function StructuredResponseCard({ sections }) {
  return (
    <div className="space-y-3 mt-2">
      {sections.map((section) => {
        const style = SECTION_STYLES[section.key] || SECTION_STYLES.situation;
        return (
          <div
            key={section.key}
            className={`rounded-lg border p-3 ${style.bg} ${style.border}`}
          >
            <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${style.title}`}>
              {section.label}
            </p>
            <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
              {section.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * AIAssistant — the Volunteer Co-Pilot chat interface.
 *
 * Renders structured 8-field AI reasoning responses as colour-coded cards.
 * Falls back to plain text rendering for non-structured responses.
 */
export default function AIAssistant({ volunteerId, volunteerName, volunteerZone, language }) {
  const { ask, loading } = useAI();
  const toast = useToast();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${volunteerName || 'Volunteer'}! I'm your StadiumMind AI Co-Pilot. I'm monitoring all stadium zones in real-time.\n\nI can reason over crowd density, active incidents, volunteer gaps, transport status, and match context simultaneously to give you accurate, grounded guidance.\n\nHow can I help with your shift?`,
      timestamp: new Date().toISOString(),
      isWelcome: true,
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await ask(text, language, volunteerId, volunteerZone);
      const parsed = parseStructuredResponse(res.answer);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.answer,
        parsedSections: parsed,
        confidence: res.confidence,
        sources_used: res.sources_used,
        reasoning_summary: res.reasoning_summary,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I encountered an error connecting to the intelligence network. Please try again or contact command on Radio Channel 1.',
        isError: true,
        timestamp: new Date().toISOString(),
      }]);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard');
    });
  };

  const suggestions = [
    'Where am I needed most right now?',
    'What is the crowd situation at South Stand?',
    'Emergency protocol if Gate C gets blocked?',
    'How do I assist a fan in my zone who needs medical help?',
  ];

  return (
    <Card className="flex flex-col h-[620px] p-0 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/10 border-b border-blue-500/30 p-4 flex items-center gap-3">
        <div className="relative">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          {loading && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">AI Co-Pilot</h3>
          <p className="text-xs text-blue-200">
            {loading
              ? '⚡ Reasoning over 6 data sources...'
              : 'Powered by Google Gemini · 6 Context Sources Active'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-full">
          <Zap className="h-3 w-3 text-yellow-400" />
          <span className="text-xs text-yellow-300 font-semibold">RAG</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-slide-up`}>
            {msg.role === 'assistant' && (
              <div className="w-full">
                {/* Welcome / plain messages */}
                {(!msg.parsedSections || msg.isWelcome) && (
                  <div className={`max-w-[90%] rounded-2xl rounded-bl-none p-4 ${
                    msg.isError
                      ? 'bg-red-500/20 border border-red-500/50 text-red-200'
                      : 'bg-white/10 border border-white/10 text-gray-100'
                  }`}>
                    <p className="text-sm md:text-base whitespace-pre-wrap">{msg.content}</p>
                  </div>
                )}

                {/* Structured 8-field response */}
                {msg.parsedSections && !msg.isWelcome && (
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                        AI Structured Response
                      </span>
                      <div className="flex-1 h-px bg-white/10" />
                      <button
                        onClick={() => handleCopy(msg.content)}
                        className="text-gray-500 hover:text-white transition-colors"
                        title="Copy full response"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <StructuredResponseCard sections={msg.parsedSections} />
                  </div>
                )}

                {/* Metadata footer */}
                {msg.sources_used && (
                  <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs text-gray-500">Sources:</span>
                    {msg.sources_used.map((src, idx) => (
                      <span key={idx} className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-400">
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {msg.role === 'user' && (
              <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-br-none p-4">
                <p className="text-sm md:text-base">{msg.content}</p>
              </div>
            )}

            <span className="text-xs text-gray-600 mt-1 mx-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {/* AI Thinking Indicator */}
        {loading && (
          <div className="flex items-start animate-fade-in">
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-2xl rounded-bl-none p-4 max-w-sm">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-400 animate-pulse" />
                <span className="text-xs text-blue-300 font-semibold">Reasoning over stadium context...</span>
              </div>
              <div className="space-y-1">
                {['Crowd density', 'Volunteer gaps', 'Active incidents', 'Transport status'].map((src, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    Analysing {src}...
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-1">
                <div className="h-2 w-2 bg-blue-400 rounded-full typing-dot"></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full typing-dot"></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        {/* Suggested Questions */}
        <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              disabled={loading}
              className="whitespace-nowrap text-xs bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/40 rounded-full px-3 py-1.5 transition-colors disabled:opacity-40 text-gray-300"
            >
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Co-Pilot anything about your shift..."
            className="input-field flex-1"
            disabled={loading}
            aria-label="Ask the AI Co-Pilot"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            id="ai-send-btn"
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 text-white p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Send question to AI"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </Card>
  );
}
