import React, { useRef, useEffect, useState } from 'react';
import { CapsuleEntry, UserProfile } from '../types';
import VoiceRecorder from './VoiceRecorder';
import StreakBadge from './StreakBadge';

interface ChatInterfaceProps {
  entries: CapsuleEntry[];
  profile: UserProfile;
  onRecordingComplete: (blob: Blob, base64: string) => void;
  onTextEntryComplete: (text: string) => void;
  isProcessing: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ entries, profile, onRecordingComplete, onTextEntryComplete, isProcessing }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');

  const handleTextSubmit = () => {
    if (textInput.trim() && !isProcessing) {
      onTextEntryComplete(textInput);
      setTextInput('');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, isProcessing]);

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto glass-morphism rounded-3xl border border-stone-200 overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="bg-stone-800 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
            <i className="fas fa-leaf"></i>
          </div>
          <div>
            <h3 className="font-bold text-sm">The Capsule Archivist</h3>
            <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold">Online • Listening</p>
          </div>
        </div>
        <StreakBadge entries={entries} />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {/* User-defined Greeting Message */}
        <div className="flex justify-start">
          <div className="max-w-[85%] bg-stone-100 p-4 rounded-2xl rounded-tl-none shadow-sm border border-stone-200/50">
            <p className="text-sm text-stone-700 leading-relaxed">
              {profile.initialGreeting}
            </p>
          </div>
        </div>

        {entries.slice().reverse().map((entry) => (
          <React.Fragment key={entry.id}>
            {/* User Entry: Just the transcript */}
            <div className="flex justify-end animate-in slide-in-from-right-4 duration-300">
              <div className="max-w-[85%] bg-stone-800 p-4 rounded-2xl rounded-tr-none shadow-md text-white border border-stone-700">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Transcript</p>
                <p className="text-sm leading-relaxed text-stone-100">
                  {entry.transcript}
                </p>
                <span className="text-[9px] text-stone-400 block mt-2 text-right">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Bot Response: Just the text response */}
            <div className="flex justify-start animate-in slide-in-from-left-4 duration-500 delay-200">
              <div className="max-w-[85%] bg-white p-4 rounded-2xl rounded-tl-none shadow-md border border-stone-100">
                <p className="text-sm text-stone-800 leading-relaxed italic serif">
                  "{entry.response}"
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-emerald-200"></span>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">Memory Archived</p>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}

        {isProcessing && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-stone-50 p-4 rounded-2xl rounded-tl-none border border-stone-100">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-60"></div>
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-stone-50 border-t border-stone-200 relative">
        <div className="flex justify-center mb-4">
          <div className="flex bg-stone-200 p-1 rounded-full">
            <button
              onClick={() => setInputMode('voice')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${inputMode === 'voice' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Voice
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${inputMode === 'text' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Text
            </button>
          </div>
        </div>

        {inputMode === 'voice' ? (
          <div className="flex justify-center">
            <VoiceRecorder onRecordingComplete={onRecordingComplete} isProcessing={isProcessing} compact />
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="relative">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Write your thought here..."
                disabled={isProcessing}
                className="w-full bg-white border border-stone-200 rounded-xl p-4 pr-12 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none h-24"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTextSubmit();
                  }
                }}
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim() || isProcessing}
                className="absolute bottom-3 right-3 w-8 h-8 bg-stone-800 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-stone-800 transition-colors"
              >
                <i className="fas fa-arrow-up text-xs"></i>
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-[9px] text-stone-400 mt-4 uppercase tracking-[0.2em]">
          {inputMode === 'voice' ? 'Hold for deeper reflection' : 'Type your inner thoughts'}
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;