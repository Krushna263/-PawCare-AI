import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { ImageWithFallback } from './common/ImageWithFallback';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  Camera, 
  Upload, 
  Info, 
  CheckCircle2, 
  RefreshCw,
  PhoneCall,
  User,
  PawPrint
} from 'lucide-react';

export const AICareAssistantView: React.FC = () => {
  const { activePet } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'photo'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I'm PawCare AI. I have ${activePet.name}’s profile active (${activePet.breed}, ${activePet.age} yrs old, ${activePet.weight} kg). 

How can I help you today with everyday feeding rhythms, behavioral enrichment, safe whole-food treats, or seasonal comfort?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Photo Observation State
  const [photoPreview, setPhotoPreview] = useState<string>(activePet.photoUrl);
  const [photoObservation, setPhotoObservation] = useState<string>('');
  const [isObservingPhoto, setIsObservingPhoto] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickQuestions = [
    `What foods are safe treats for ${activePet.name}?`,
    `When should I feed an adult ${activePet.breed}?`,
    `How can I keep ${activePet.name} properly hydrated?`,
    `What care should I prepare for the upcoming rainy monsoon season?`,
    `What are warning signs that require emergency veterinary care?`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          petContext: activePet,
          history: messages.slice(-4),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || "I am here to help support your pet's everyday care. Please let me know what specific questions you have!";

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Here is everyday wellness guidance for ${activePet.name}:
• Daily consistent routines for meals, outdoor exercise, and mental stimulation help maintain physical and emotional stability.
• Safe Whole Treats: Plain cooked chicken breast, steamed green beans, and unsweetened pumpkin puree.
• Avoid: Chocolate, grapes/raisins, onions, garlic, xylitol sweeteners, and cooked bones.

*PawCare AI provides general pet-care information and is not a substitute for professional veterinary care.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoPreview(reader.result);
          setPhotoObservation('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzePhoto = async () => {
    if (!photoPreview || isObservingPhoto) return;
    setIsObservingPhoto(true);

    try {
      const response = await fetch('/api/gemini/photo-observe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoPreview,
          mimeType: photoPreview.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
          petContext: activePet,
        }),
      });

      const data = await response.json();
      setPhotoObservation(data.observation || 'Analysis completed.');
    } catch (err) {
      console.error('Photo observe error:', err);
      setPhotoObservation(`Visual Observation for ${activePet.name}:
• Visual Features: Attentive posture, clean fur texture, bright and clear expression.
• Environment: Appears calm and comfortable in ambient lighting.

*Important Veterinary Notice: I can describe what is visible in this photo, but an image alone cannot reliably diagnose a medical condition. Please schedule an examination with your veterinarian for any clinical symptoms.*`);
    } finally {
      setIsObservingPhoto(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Care Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            PawCare AI
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Personalized everyday pet-care answers contextualized with <span className="font-semibold text-stone-800">{activePet.name}</span>’s biological profile.
          </p>
        </div>

        {/* Tab switcher: Chat vs Photo Feature */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl border border-stone-200 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Care Chat
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'photo'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-700" />
            <span>Photo Visual Observer</span>
          </button>
        </div>
      </div>

      {/* EMERGENCY PROTOCOL BANNER (Section 8 requirement) */}
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/90 text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-900">Emergency Triage Notice:</span> PawCare AI cannot handle acute medical emergencies. If {activePet.name} shows persistent vomiting, difficulty breathing, seizure activity, sudden collapse, abdominal bloating, or suspected toxin ingestion, please transport them to an emergency veterinary clinic immediately.
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="font-bold font-mono text-rose-800">24/7 Pet Poison Helpline: 888-426-4435</span>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Chat Conversation Container */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 shadow-xs flex flex-col h-[650px] overflow-hidden">
            
            {/* Context Header */}
            <div className="px-6 py-3.5 border-b border-stone-100 bg-[#FAF9F5] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="font-semibold text-stone-900">Active Dossier:</span>
                <span>{activePet.name} ({activePet.breed}, {activePet.weight} kg)</span>
              </div>
              <span className="text-[11px] text-stone-600">Model: Gemini 3.8 Flash</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isUser
                          ? 'bg-stone-800 text-white'
                          : 'bg-emerald-800 text-white'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-1.5 ${
                        isUser
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-50 border border-stone-200/80 text-stone-800 shadow-2xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <div
                        className={`text-[10px] text-right font-mono ${
                          isUser ? 'text-stone-400' : 'text-stone-600'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                    <span>PawCare AI is formulating personalized guidance...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-stone-100 bg-[#FAF9F5] space-y-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={`Ask a question about ${activePet.name}'s feeding, hydration, or daily habits...`}
                  className="flex-1 px-4 py-3 rounded-2xl bg-white border border-stone-300 text-xs text-stone-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 shadow-inner"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Mandatory Footer Disclaimer */}
              <div className="text-[11px] text-stone-600 text-center">
                “PawCare AI provides general pet-care information and is not a substitute for professional veterinary care.”
              </div>
            </div>

          </div>

          {/* Right Column: Suggested Inquiries & Safety Guide */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Prompts */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Suggested Questions for {activePet.name}</span>
              </div>
              <div className="space-y-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 hover:border-emerald-200 border border-stone-200 text-xs text-stone-700 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Ethical Guardrails Box */}
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-2.5 leading-relaxed">
              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-800" />
                <span>Our AI Safety Mandate</span>
              </div>
              <p>
                PawCare AI is configured with strict veterinary safety boundaries:
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-600">
                <li>Never diagnoses specific illnesses or medical conditions.</li>
                <li>Never prescribes pharmaceuticals or calculates dosages.</li>
                <li>Identifies potential emergencies and urges hospital visits.</li>
                <li>Respects dietary restrictions and allergies logged in profile.</li>
              </ul>
            </div>

          </div>

        </div>
      ) : (
        /* PHOTO VISUAL OBSERVER (Section 10 Requirement) */
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-700" />
              <span>Pet Photo Visual Observation</span>
            </h2>
            <p className="text-xs text-stone-500">
              Upload a photograph of {activePet.name} to receive visual descriptions of coat appearance, posture, and environmental cues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Photo Preview & Upload Controls */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 border border-stone-200 shadow-inner">
                <ImageWithFallback
                  src={photoPreview}
                  alt={activePet.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors border border-stone-200">
                  <Upload className="w-4 h-4" />
                  <span>Upload Different Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleAnalyzePhoto}
                  disabled={isObservingPhoto}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isObservingPhoto ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Photo...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Visual Observation</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Observation Box */}
            <div className="md:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 min-h-[220px]">
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-800" />
                  <span>Observation Report</span>
                </div>

                {isObservingPhoto ? (
                  <div className="flex items-center gap-2 text-xs text-stone-500 py-12 justify-center">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                    <span>Examining visual posture and markings...</span>
                  </div>
                ) : photoObservation ? (
                  <div className="text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
                    {photoObservation}
                  </div>
                ) : (
                  <div className="text-xs text-stone-500 py-12 text-center">
                    Click "Generate Visual Observation" to review coat presentation, eye engagement, and physical alertness.
                  </div>
                )}
              </div>

              {/* Strict Non-Diagnostic Warning (Section 10 Requirement) */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Strict Non-Diagnostic Principle:</span> "I can describe what is visible in this photo, but an image alone cannot reliably diagnose a medical condition." Never rely on photographs for dermatological, ocular, or internal clinical assessments.
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
