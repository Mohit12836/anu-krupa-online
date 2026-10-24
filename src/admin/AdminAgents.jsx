import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  MessageCircle, 
  ExternalLink, 
  Cpu, 
  Sliders, 
  HelpCircle,
  RefreshCw,
  Terminal,
  Activity,
  UserCheck,
  Flame,
  Award,
  Layers,
  CheckCircle2,
  Share2,
  PlusCircle,
  Edit3,
  Trash2,
  GraduationCap,
  BookOpen,
  Key,
  ShieldAlert,
  Play,
  RotateCcw,
  X,
  Lock,
  Unlock,
  CheckSquare,
  Square
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { 
  DEFAULT_AGENTS, 
  getStoredAgents, 
  saveStoredAgents, 
  getStoredProviders, 
  saveStoredProviders,
  executeMultiAgentWorkflow,
  executeAgentTask,
  classifyCustomerIntent
} from '../services/aiAgentEngine';

export default function AdminAgents() {
  const { inquiries, settings } = useStore();

  // Navigation Subtabs
  const [activeSubTab, setActiveSubTab] = useState('studio'); // 'studio' | 'simulator' | 'tasks' | 'providers' | 'integration'

  // Agents State
  const [agents, setAgents] = useState(() => getStoredAgents());
  const [selectedAgentId, setSelectedAgentId] = useState(() => (agents[0]?.id || 'agent_sales_closer'));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);

  // Providers State
  const [providers, setProviders] = useState(() => getStoredProviders());
  const [savedProviderNotice, setSavedProviderNotice] = useState(false);

  // Training State
  const [newKnowledgeItem, setNewKnowledgeItem] = useState('');
  const [trainedNotice, setTrainedNotice] = useState(false);

  // Task Runner State
  const [selectedTaskAgentId, setSelectedTaskAgentId] = useState(agents[0]?.id || '');
  const [taskInput, setTaskInput] = useState('');
  const [taskResult, setTaskResult] = useState(null);
  const [isTaskRunning, setIsTaskRunning] = useState(false);

  // Simulator State
  const [simAgentId, setSimAgentId] = useState('auto');
  const [customerName, setCustomerName] = useState('राजेश पाटीदार');
  const [testMessage, setTestMessage] = useState('PM सूर्य घर सोलर योजना में ₹78,000 की सब्सिडी कैसे मिलेगी और कितना खर्च आएगा?');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [copiedText, setCopiedText] = useState(false);

  // New Custom Agent Form State
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentAvatar, setNewAgentAvatar] = useState('⚡');
  const [newAgentProvider, setNewAgentProvider] = useState('groq');
  const [newAgentModel, setNewAgentModel] = useState('llama-3.3-70b-versatile');
  const [newAgentPrompt, setNewAgentPrompt] = useState('');
  const [newAgentCanDiscount, setNewAgentCanDiscount] = useState(false);
  const [newAgentMaxDiscount, setNewAgentMaxDiscount] = useState(10);
  const [newAgentCanPayment, setNewAgentCanPayment] = useState(true);
  const [newAgentCanAutoReply, setNewAgentCanAutoReply] = useState(true);

  // Save agents to storage on change
  const updateAgentsList = (newAgents) => {
    setAgents(newAgents);
    saveStoredAgents(newAgents);
  };

  const currentAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Quick Preset Scenarios
  const PRESET_SCENARIOS = [
    {
      label: '☀️ सोलर सब्सिडी',
      name: 'राजेश पाटीदार (उकेड़िया)',
      text: 'PM सूर्य घर सोलर योजना में ₹78,000 की सब्सिडी कैसे मिलेगी और कितना खर्च आएगा?',
    },
    {
      label: '🌾 KCC लोन लिमिट',
      name: 'दिनेश धाकड़ (जावरा)',
      text: 'किसान क्रेडिट कार्ड की लिमिट 3 लाख करवानी है, क्या-क्या डाक्यूमेंट्स लेकर आऊँ?',
    },
    {
      label: '🤝 WFH पार्टनर कमाई',
      name: 'अमित शर्मा (रतलाम)',
      text: 'मुझे घर बैठे मोबाइल से पैसे कमाने हैं, आपकी दुकान से कैसे जुडूं और कितना कमीशन मिलेगा?',
    },
    {
      label: '🖨️ 200 PVC कार्ड प्रिंट',
      name: 'विकास स्कूल प्रिंसिपल',
      text: 'हमारे स्कूल के 200 बच्चों के PVC आईकार्ड और बेल्ट प्रिंट करवाने हैं, थोक रेट क्या है?',
    },
  ];

  // 1. Add Knowledge / Train Agent (सिखाना)
  const handleAddTrainingFact = (e) => {
    e.preventDefault();
    if (!newKnowledgeItem.trim()) return;

    const updated = agents.map(a => {
      if (a.id === selectedAgentId) {
        return {
          ...a,
          knowledgeBase: [...(a.knowledgeBase || []), newKnowledgeItem.trim()],
        };
      }
      return a;
    });

    updateAgentsList(updated);
    setNewKnowledgeItem('');
    setTrainedNotice(true);
    setTimeout(() => setTrainedNotice(false), 2500);
  };

  const handleRemoveKnowledgeFact = (index) => {
    const updated = agents.map(a => {
      if (a.id === selectedAgentId) {
        const kb = [...(a.knowledgeBase || [])];
        kb.splice(index, 1);
        return { ...a, knowledgeBase: kb };
      }
      return a;
    });
    updateAgentsList(updated);
  };

  // 2. Toggle Permission (अधिकार व सीमाएं)
  const handleTogglePermission = (agentId, permKey) => {
    const updated = agents.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          permissions: {
            ...a.permissions,
            [permKey]: !a.permissions?.[permKey],
          },
        };
      }
      return a;
    });
    updateAgentsList(updated);
  };

  const handleUpdateMaxDiscount = (agentId, percent) => {
    const updated = agents.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          permissions: {
            ...a.permissions,
            maxDiscountPercent: Number(percent),
          },
        };
      }
      return a;
    });
    updateAgentsList(updated);
  };

  // 3. Toggle Agent Status (Active / Paused)
  const handleToggleAgentStatus = (agentId) => {
    const updated = agents.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          status: a.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
        };
      }
      return a;
    });
    updateAgentsList(updated);
  };

  // 4. Create New Agent (+ Add Agent)
  const handleCreateAgent = (e) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const newId = 'agent_custom_' + Date.now();
    const created = {
      id: newId,
      name: newAgentName.trim(),
      role: newAgentRole.trim() || 'विशेषज्ञ सलाहकार',
      avatar: newAgentAvatar || '⚡',
      badge: 'कस्टम AI',
      color: 'from-blue-600 to-indigo-600',
      description: newAgentPrompt.trim() || 'कस्टम AI एजेंट',
      provider: newAgentProvider,
      model: newAgentModel,
      temperature: 0.6,
      status: 'ACTIVE',
      isCustom: true,
      systemPrompt: newAgentPrompt.trim(),
      permissions: {
        canGiveDiscounts: newAgentCanDiscount,
        maxDiscountPercent: Number(newAgentMaxDiscount) || 10,
        canGeneratePaymentLinks: newAgentCanPayment,
        canAccessCustomerPhone: true,
        canAutoReplyWhatsApp: newAgentCanAutoReply,
        requireOwnerApproval: false,
      },
      capabilities: ['कस्टम कार्य संपादन', 'व्हाट्सएप उत्तर'],
      knowledgeBase: ['अनु कृपा ऑनलाइन, उकेड़िया (जावरा, रतलाम)'],
      assignedTasks: [{ id: 't_custom', title: 'ग्राहक सहायता', status: 'ACTIVE' }],
    };

    const updated = [...agents, created];
    updateAgentsList(updated);
    setSelectedAgentId(newId);
    setIsCreateModalOpen(false);

    // Reset Form
    setNewAgentName('');
    setNewAgentRole('');
    setNewAgentPrompt('');
  };

  // 5. Delete Custom Agent
  const handleDeleteAgent = (agentId) => {
    if (confirm('क्या आप सच में इस एजेंट को हटाना चाहते हैं?')) {
      const updated = agents.filter(a => a.id !== agentId);
      updateAgentsList(updated);
      setSelectedAgentId(updated[0]?.id || '');
    }
  };

  // 6. Reset Agents to Default
  const handleResetAgents = () => {
    if (confirm('क्या आप सभी एजेंट्स को फ़ैक्ट्री डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      updateAgentsList(DEFAULT_AGENTS);
      setSelectedAgentId(DEFAULT_AGENTS[0].id);
    }
  };

  // 7. Save Providers
  const handleSaveProviders = (e) => {
    e.preventDefault();
    saveStoredProviders(providers);
    setSavedProviderNotice(true);
    setTimeout(() => setSavedProviderNotice(false), 2500);
  };

  // 8. Run Task (काम करवाना)
  const handleExecuteTask = async (e) => {
    if (e) e.preventDefault();
    if (!taskInput.trim()) return;

    setIsTaskRunning(true);
    setTaskResult(null);

    try {
      const res = await executeAgentTask({
        agentId: selectedTaskAgentId,
        taskDescription: taskInput.trim(),
      });
      setTaskResult(res);
    } catch (err) {
      console.error('Task error:', err);
    } finally {
      setIsTaskRunning(false);
    }
  };

  // 9. Run Simulation (Sandbox)
  const handleRunSimulation = async (e) => {
    if (e) e.preventDefault();
    if (!testMessage.trim()) return;

    setIsSimulating(true);
    setSimResult(null);

    try {
      const res = await executeMultiAgentWorkflow({
        customerMessage: testMessage,
        customerName: customerName.trim() || 'ग्राहक',
        overrideAgentId: simAgentId,
        customAgents: agents,
      });
      setSimResult(res);
    } catch (err) {
      console.error('Sim error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* 1. Master Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-black tracking-wider text-emerald-400 uppercase">
                Dify / Coze-Grade Multi-Agent Studio
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black flex items-center gap-2">
              <Bot className="w-5 h-5 text-orange-400" />
              <span>AI एजेंट कार्यबल व परमिशन कंट्रोल हब</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              नए AI कर्मचारी बनाएं, भूमिका (Role) तय करें, अधिकार (Permissions) दें, नियम सिखाएं (Train) और काम करवाएं।
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg flex items-center gap-1.5 tap-bounce transition-all"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>+ नया AI एजेंट बनाएं</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-1">
        
        <button
          onClick={() => setActiveSubTab('studio')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'studio'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>एजेंट स्टूडियो (Role, Perms, Training)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'tasks'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>काम करवाएं (Task Runner)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'simulator'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>लाइव टेस्ट सिमुलेटर (Sandbox)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('providers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'providers'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>मल्टी-मॉडल प्रोवाइडर (Groq, Gemini, OpenAI)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('integration')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'integration'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>WACRM व Webhook</span>
        </button>

      </div>

      {/* 3. SUBTAB: AGENT STUDIO (Role, Permissions, Training) */}
      {activeSubTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Agent Selector List */}
          <div className="lg:col-span-4 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                सभी AI कर्मचारी ({agents.length})
              </span>
              <button
                onClick={handleResetAgents}
                className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1"
                title="फ़ैक्ट्री रीसेट करें"
              >
                <RotateCcw className="w-3 h-3" />
                <span>रीसेट</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {agents.map((agent) => {
                const isSelected = agent.id === selectedAgentId;
                const isPaused = agent.status === 'PAUSED';

                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-orange-500 shadow-md ring-1 ring-orange-500/30'
                        : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200/90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                        isSelected ? 'bg-slate-800' : 'bg-slate-100'
                      }`}>
                        {agent.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs truncate block">
                            {agent.name}
                          </span>
                          {agent.isCustom && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-bold shrink-0">
                              Custom
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] truncate block ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {agent.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-slate-400' : 'bg-emerald-400'}`} />
                      <span className="text-[10px] font-mono font-bold uppercase opacity-80">
                        {agent.provider || 'Groq'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Configuration Panel of Selected Agent */}
          {currentAgent && (
            <div className="lg:col-span-8 space-y-4">
              
              {/* Agent Overview Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-2xl flex items-center justify-center shadow-inner">
                      {currentAgent.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-slate-900">
                          {currentAgent.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                          {currentAgent.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {currentAgent.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAgentStatus(currentAgent.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        currentAgent.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${currentAgent.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>{currentAgent.status === 'ACTIVE' ? 'सक्रिय (Active)' : 'रोकें (Paused)'}</span>
                    </button>

                    {currentAgent.isCustom && (
                      <button
                        onClick={() => handleDeleteAgent(currentAgent.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Model & System Prompt Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-orange-500" />
                      <span>मॉडल इंजन: <strong>{currentAgent.provider?.toUpperCase()} ({currentAgent.model})</strong></span>
                    </span>
                    <span>तापमान (Temp): {currentAgent.temperature || 0.6}</span>
                  </div>
                  <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                    <strong>सिस्टम भूमिका (Role Instruction):</strong><br />
                    {currentAgent.systemPrompt || currentAgent.description}
                  </div>
                </div>
              </div>

              {/* 🔐 PERMISSIONS MATRIX (अधिकार व सीमाएं) */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-extrabold text-sm text-slate-900">
                      अधिकार व सुरक्षा सीमाएं (Agent Permissions & Guardrails)
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">1-टैप स्विच</span>
                </div>

                <p className="text-xs text-slate-500">
                  मालिक के तौर पर आप तय करते हैं कि यह AI एजेंट क्या कर सकता है ताकि कोई गलत वादा या अनधिकृत छूट न जाए।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  
                  {/* Permission 1: Discounts */}
                  <div className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                    currentAgent.permissions?.canGiveDiscounts 
                      ? 'bg-emerald-50/60 border-emerald-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>🏷️ डिस्काउंट व ऑफर देना</span>
                      </span>
                      <button
                        onClick={() => handleTogglePermission(currentAgent.id, 'canGiveDiscounts')}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                          currentAgent.permissions?.canGiveDiscounts ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          currentAgent.permissions?.canGiveDiscounts ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {currentAgent.permissions?.canGiveDiscounts && (
                      <div className="flex items-center gap-2 pt-1 border-t border-emerald-100 text-[11px] text-slate-600">
                        <span>अधिकतम छूट सीमा:</span>
                        <select
                          value={currentAgent.permissions?.maxDiscountPercent || 10}
                          onChange={(e) => handleUpdateMaxDiscount(currentAgent.id, e.target.value)}
                          className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold text-xs"
                        >
                          <option value="5">5%</option>
                          <option value="10">10%</option>
                          <option value="15">15%</option>
                          <option value="20">20%</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Permission 2: Payment Links */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    currentAgent.permissions?.canGeneratePaymentLinks 
                      ? 'bg-emerald-50/60 border-emerald-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        💳 डायनामिक पेमेंट लिंक बनाना
                      </span>
                      <span className="text-[10px] text-slate-500">बुकिंग व टोकन फीस लिंक</span>
                    </div>
                    <button
                      onClick={() => handleTogglePermission(currentAgent.id, 'canGeneratePaymentLinks')}
                      className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                        currentAgent.permissions?.canGeneratePaymentLinks ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        currentAgent.permissions?.canGeneratePaymentLinks ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Permission 3: Auto-Reply WhatsApp */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    currentAgent.permissions?.canAutoReplyWhatsApp 
                      ? 'bg-emerald-50/60 border-emerald-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        ⚡ सीधा WhatsApp रिप्लाई भेजना
                      </span>
                      <span className="text-[10px] text-slate-500">बिना पूछे तुरंत उत्तर दे</span>
                    </div>
                    <button
                      onClick={() => handleTogglePermission(currentAgent.id, 'canAutoReplyWhatsApp')}
                      className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                        currentAgent.permissions?.canAutoReplyWhatsApp ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        currentAgent.permissions?.canAutoReplyWhatsApp ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Permission 4: Require Owner Approval */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    currentAgent.permissions?.requireOwnerApproval 
                      ? 'bg-amber-50/60 border-amber-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        🛡️ मालिक की अनुमति अनिवार्य
                      </span>
                      <span className="text-[10px] text-slate-500">भेजने से पहले समीक्षा मांगे</span>
                    </div>
                    <button
                      onClick={() => handleTogglePermission(currentAgent.id, 'requireOwnerApproval')}
                      className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                        currentAgent.permissions?.requireOwnerApproval ? 'bg-amber-500' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        currentAgent.permissions?.requireOwnerApproval ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                </div>
              </div>

              {/* 🧠 TRAINING & KNOWLEDGE BASE ("सिखाना / स्मृति") */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-orange-500" />
                    <h4 className="font-extrabold text-sm text-slate-900">
                      एजेंट की स्मृति व सीखी हुई बातें (Knowledge Base & Training)
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    {(currentAgent.knowledgeBase || []).length} नियम सीखे
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  इस एजेंट को अपनी दुकान के नए नियम, फीस में बदलाव, या विशेष जानकारी सिखाएं। यह जवाब देते समय इन्हें याद रखेगा।
                </p>

                {/* Learned List */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pt-1">
                  {(currentAgent.knowledgeBase || []).map((fact, index) => (
                    <div
                      key={index}
                      className="p-2.5 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 text-xs text-slate-800 transition-all"
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{fact}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveKnowledgeFact(index)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="हटाएं"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Knowledge Input Box */}
                <form onSubmit={handleAddTrainingFact} className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={newKnowledgeItem}
                    onChange={(e) => setNewKnowledgeItem(e.target.value)}
                    placeholder="जैसे: आज से नया पैन कार्ड केवल ₹120 में 3 दिन में बनेगा..."
                    className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md tap-bounce flex items-center gap-1.5 shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{trainedNotice ? 'सीख लिया!' : 'एजेंट को सिखाएं'}</span>
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>
      )}

      {/* 4. SUBTAB: TASK RUNNER (काम करवाना) */}
      {activeSubTab === 'tasks' && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Play className="w-4 h-4 text-orange-500" />
              <span>एजेंट को सीधा काम सौंपें (AI Task Runner)</span>
            </h3>
            <p className="text-xs text-slate-500">
              किसी भी एजेंट को चुनें और तुरंत कोई काम सौंपें (जैसे: किसी ग्राहक का कोटेशन बनाना, फॉलो-अप संदेश लिखना, या रिपोर्ट तैयार करना)।
            </p>
          </div>

          <form onSubmit={handleExecuteTask} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  कार्य करने वाला एजेंट चुनें
                </label>
                <select
                  value={selectedTaskAgentId}
                  onChange={(e) => setSelectedTaskAgentId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.avatar} {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  कार्य का विवरण (Task Prompt)
                </label>
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="जैसे: कल के 3 पेंडिंग सोलर ग्राहकों के लिए 10% डिस्काउंट वाला फॉलो-अप मैसेज बनाओ..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  required
                />
              </div>
            </div>

            {/* Quick Task Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                '☀️ सोलर रूफटॉप के लिए एक अर्जेंट व्हाट्सएप फॉलो-अप लिखो',
                '🌾 KCC लोन के लिए आवश्यक डाक्यूमेंट्स की सुंदर चेकलिस्ट बनाओ',
                '🤝 नए पार्टनर्स के लिए 1-क्लिक शेयरिंग मैसेज तैयार करो',
                '📊 आज की दुकान की समरी रिपोर्ट तैयार करो',
              ].map((pill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTaskInput(pill)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 text-[11px] font-medium border border-slate-200 transition-all"
                >
                  {pill}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isTaskRunning}
              className="py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black shadow-lg tap-bounce flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isTaskRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>एजेंट काम पूरा कर रहा है...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>एजेंट से काम करवाएं (Execute Task)</span>
                </>
              )}
            </button>
          </form>

          {/* Task Output Box */}
          {taskResult && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>कार्य सफलतापूर्वक पूरा हुआ ({taskResult.agentName})</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  समय: {taskResult.completedAt} • {taskResult.durationMs}ms
                </span>
              </div>

              <div className="text-xs whitespace-pre-wrap leading-relaxed text-slate-200 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {taskResult.output}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleCopy(taskResult.output)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'कॉपी हो गया' : 'टेक्स्ट कॉपी करें'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. SUBTAB: SIMULATOR (Sandbox) */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>रेडीमेड कस्टमर टेस्ट सवाल:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SCENARIOS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomerName(preset.name);
                      setTestMessage(preset.text);
                    }}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 hover:text-orange-700 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition-all text-left"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleRunSimulation} className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  टेस्ट मोड (एजेंट का चयन)
                </label>
                <select
                  value={simAgentId}
                  onChange={(e) => setSimAgentId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold"
                >
                  <option value="auto">🎯 ऑटो-राउटिंग (दिशा AI पहले इंटेंट क्लासिफाई करेगी)</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.avatar} {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ग्राहक का नाम (Customer Name)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="उदा. राजेश पाटीदार"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ग्राहक का संदेश (WhatsApp Message) *
                </label>
                <textarea
                  rows={4}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="यहाँ ग्राहक का सवाल लिखें..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium resize-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSimulating}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black shadow-lg tap-bounce flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>एजेंट्स निर्णय ले रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>रिस्पॉन्स जनरेट करें (Run Simulation)</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {simResult ? (
              <div className="space-y-3 animate-in fade-in">
                {/* Reasoning Pipeline */}
                <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl border border-slate-800 shadow-md space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold flex items-center gap-1.5 text-orange-400">
                      <Activity className="w-4 h-4 text-orange-400" />
                      <span>कोऑर्डिनेशन विश्लेषण:</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {simResult.meta.durationMs}ms
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">पहचाना गया इंटेंट</span>
                      <span className="font-bold text-orange-300 truncate block">
                        {simResult.triage.intent}
                      </span>
                    </div>

                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">लीड स्कोर (0-100)</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {simResult.triage.leadScore} / 100
                      </span>
                    </div>

                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">सक्रिय एजेंट</span>
                      <span className="font-bold text-cyan-300 truncate block">
                        {simResult.assignedAgent.name}
                      </span>
                    </div>

                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">मॉडल इंजन</span>
                      <span className="font-mono text-[10px] text-slate-300 truncate block">
                        {simResult.meta.modelUsed}
                      </span>
                    </div>
                  </div>

                  {/* 📚 Dify RAG Retriever References */}
                  {simResult.meta?.retrieverResources && simResult.meta.retrieverResources.length > 0 && (
                    <div className="bg-indigo-950/80 border border-indigo-500/40 p-2.5 rounded-xl text-[11px] text-indigo-200 space-y-1">
                      <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Dify RAG द्वारा उपयोग किए गए दस्तावेज़ (Knowledge References):</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[10px] text-indigo-300/90 font-mono">
                        {simResult.meta.retrieverResources.map((res, i) => (
                          <li key={i} className="truncate">
                            {res.document_name || `संदर्भ दस्तावेज़ #${i + 1}`} (प्रासंगिकता: {Math.round((res.score || 0.85) * 100)}%)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>

                {/* WhatsApp Chat Preview */}
                <div className="bg-[#0b141a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                  <div className="bg-[#202c33] p-3 text-white flex items-center justify-between border-b border-slate-700/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                        AK
                      </div>
                      <div>
                        <span className="font-bold text-xs block">अनु कृपा ऑनलाइन</span>
                        <span className="text-[10px] text-emerald-400">
                          {simResult.assignedAgent.name} लाइव
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 min-h-[200px] bg-[#0b141a]">
                    <div className="flex justify-end">
                      <div className="bg-[#005c4b] text-[#e9edef] p-3 rounded-2xl rounded-tr-xs max-w-[85%] text-xs shadow-md">
                        <div className="text-[10px] font-bold text-emerald-300 mb-1">{customerName}</div>
                        <p className="whitespace-pre-wrap">{testMessage}</p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-[#202c33] text-[#e9edef] p-3.5 rounded-2xl rounded-tl-xs max-w-[90%] text-xs shadow-md space-y-2 border border-slate-700/40">
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {simResult.response}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#202c33] p-3 flex items-center justify-between gap-2 border-t border-slate-700/50">
                    <button
                      onClick={() => handleCopy(simResult.response)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const phone = settings.whatsappPhone || '916263879076';
                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(simResult.response)}`, '_blank');
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md tap-bounce"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp पर भेजें</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">सिमुलेटर अभी तैयार है</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    बाईं तरफ सवाल चुनें या नया लिखें और <strong>'रिस्पॉन्स जनरेट करें'</strong> दबाएं।
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 6. SUBTAB: MULTI-MODEL PROVIDERS CONFIGURATION */}
      {activeSubTab === 'providers' && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-orange-500" />
                <span>मल्टी-मॉडल प्रोवाइडर सेटिंग्स (Multi-Provider Configuration)</span>
              </h3>
              <p className="text-xs text-slate-500">
                हर AI मॉडल की अपनी अलग की यहाँ सुरक्षित रखें। आप अलग-अलग एजेंट को अलग-अलग मॉडल दे सकते हैं।
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              100% Free Tiers
            </span>
          </div>

          <form onSubmit={handleSaveProviders} className="space-y-3 pt-2">
            
            {/* 🧠 DIFY.AI HEADLESS BRAIN (World's #1 Open-Source Multi-Agent Platform) */}
            <div className="p-4 rounded-2xl border-2 border-indigo-500/50 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white space-y-3 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center font-black text-indigo-300 text-lg shadow-inner">
                    D
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-white">
                        Dify.ai हेडलेस AI ब्रेन (Headless Multi-Agent Brain)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                        160K Stars • रेडीमेड
                      </span>
                    </div>
                    <span className="text-xs text-indigo-200">
                      Dify क्लाउड (cloud.dify.ai) का पूरा मल्टी-एजेंट दिमाग, PDF डाक्यूमेंट्स और RAG सीधे कनेक्ट करें।
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-indigo-300 cursor-pointer shrink-0 bg-indigo-900/60 px-3 py-1.5 rounded-xl border border-indigo-400/30">
                  <input
                    type="checkbox"
                    checked={providers.useExternalBrain || false}
                    onChange={(e) => setProviders({ ...providers, useExternalBrain: e.target.checked })}
                    className="rounded text-indigo-500"
                  />
                  <span>सक्रिय (ON)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-indigo-200 block mb-1">
                    Dify App API Key (app-...)
                  </label>
                  <input
                    type="password"
                    value={providers.difyApiKey || ''}
                    onChange={(e) => setProviders({ ...providers, difyApiKey: e.target.value })}
                    placeholder="app-xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full p-2.5 text-xs rounded-xl border border-indigo-400/40 bg-indigo-950/70 font-mono text-white placeholder-indigo-400/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-indigo-200 block mb-1">
                    Dify API Base URL
                  </label>
                  <input
                    type="text"
                    value={providers.difyBaseUrl || 'https://api.dify.ai/v1'}
                    onChange={(e) => setProviders({ ...providers, difyBaseUrl: e.target.value })}
                    placeholder="https://api.dify.ai/v1"
                    className="w-full p-2.5 text-xs rounded-xl border border-indigo-400/40 bg-indigo-950/70 font-mono text-white placeholder-indigo-400/50"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-indigo-300 pt-2 border-t border-indigo-900/60 gap-1">
                <span>💡 मुफ़्त Dify अकाउंट बनाएं: <a href="https://cloud.dify.ai" target="_blank" rel="noreferrer" className="text-orange-400 font-bold underline">cloud.dify.ai</a> (2 मिनट में रेडी)</span>
                <span className="text-emerald-400 font-semibold">एजेंट्स + PDF RAG तुरंत काम करेगा</span>
              </div>
            </div>

            {/* Groq Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="font-extrabold text-xs text-slate-900">Groq Cloud (Llama-3.3-70B & 8B)</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  सुपरफास्ट (&lt;200ms) • 100% मुफ़्त
                </span>
              </div>
              <input
                type="password"
                value={providers.groqApiKey || ''}
                onChange={(e) => setProviders({ ...providers, groqApiKey: e.target.value })}
                placeholder="gsk_..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-mono text-slate-900"
              />
            </div>

            {/* Google Gemini Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span className="font-extrabold text-xs text-slate-900">Google Gemini 2.0 Flash (AI Studio)</span>
                </div>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Google AI Studio Free Tier
                </span>
              </div>
              <input
                type="password"
                value={providers.geminiApiKey || ''}
                onChange={(e) => setProviders({ ...providers, geminiApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-mono text-slate-900"
              />
            </div>

            {/* OpenAI Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-slate-700" />
                  <span className="font-extrabold text-xs text-slate-900">OpenAI (gpt-4o-mini)</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                  Optional
                </span>
              </div>
              <input
                type="password"
                value={providers.openaiApiKey || ''}
                onChange={(e) => setProviders({ ...providers, openaiApiKey: e.target.value })}
                placeholder="sk-proj-..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-mono text-slate-900"
              />
            </div>

            {/* Local LiteLLM Gateway */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span className="font-extrabold text-xs text-slate-900">Local Zero-Limit Gateway (LiteLLM Proxy)</span>
                </div>
                <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Port 4000
                </span>
              </div>
              <input
                type="text"
                value={providers.gatewayUrl || 'http://localhost:4000/v1'}
                onChange={(e) => setProviders({ ...providers, gatewayUrl: e.target.value })}
                placeholder="http://localhost:4000/v1"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-mono text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                नोट: कुंजियाँ आपके ब्राउज़र के लोकल स्टोरेज में पूरी तरह सुरक्षित रहेंगी।
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md tap-bounce flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{savedProviderNotice ? 'सेव हो गया!' : 'सभी कुंजियाँ सेव करें'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 7. SUBTAB: WACRM INTEGRATION */}
      {activeSubTab === 'integration' && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              WACRM व Meta WhatsApp Cloud API Webhook Integration
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            आपके Vercel पर मौजूद <strong>WACRM</strong> के साथ इस मल्टी-एजेंट स्टूडियो को जोड़ने के लिए नीचे दिए गए Webhook URL और Verify Token का उपयोग करें:
          </p>

          <div className="space-y-2">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">
                1. Live Vercel Webhook URL:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://anu-krupa-online.vercel.app/api/agent-webhook"
                  className="flex-1 p-2.5 text-xs font-mono bg-slate-100 rounded-xl border border-slate-200 text-slate-800"
                />
                <button
                  onClick={() => handleCopy('https://anu-krupa-online.vercel.app/api/agent-webhook')}
                  className="px-3.5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>कॉपी</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">
                2. Webhook Secret Verify Token:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="anu_krupa_secret_2026"
                  className="flex-1 p-2.5 text-xs font-mono bg-slate-100 rounded-xl border border-slate-200 text-slate-800"
                />
                <button
                  onClick={() => handleCopy('anu_krupa_secret_2026')}
                  className="px-3.5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>कॉपी</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. CREATE CUSTOM AGENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-orange-400" />
                <h3 className="font-extrabold text-sm sm:text-base">नया AI एजेंट बनाएं (+ Create Agent)</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">एजेंट का नाम *</label>
                  <input
                    type="text"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    placeholder="उदा. ऋण गुरु (Loan Specialist)"
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">अवतार</label>
                  <input
                    type="text"
                    value={newAgentAvatar}
                    onChange={(e) => setNewAgentAvatar(e.target.value)}
                    className="w-full p-2 text-xs text-center rounded-xl border border-slate-200 bg-slate-50 text-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">पद / भूमिका (Role)</label>
                <input
                  type="text"
                  value={newAgentRole}
                  onChange={(e) => setNewAgentRole(e.target.value)}
                  placeholder="उदा. सभी प्रकार के ऋण व सब्सिडी सलाहकार"
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">मॉडल प्रोवाइडर</label>
                  <select
                    value={newAgentProvider}
                    onChange={(e) => setNewAgentProvider(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  >
                    <option value="groq">Groq (Llama-3.3 70B)</option>
                    <option value="gemini">Google Gemini 2.0</option>
                    <option value="openai">OpenAI (gpt-4o)</option>
                    <option value="gateway">Local LiteLLM</option>
                    <option value="deterministic">Deterministic Engine (0 Error)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">मॉडल नाम</label>
                  <input
                    type="text"
                    value={newAgentModel}
                    onChange={(e) => setNewAgentModel(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  सिस्टम निर्देश व उद्देश्य (System Prompt)
                </label>
                <textarea
                  rows={3}
                  value={newAgentPrompt}
                  onChange={(e) => setNewAgentPrompt(e.target.value)}
                  placeholder="इस एजेंट को क्या बनना है? कैसे बात करनी है? क्या लक्ष्य है?"
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50 resize-none font-medium"
                  required
                />
              </div>

              {/* Quick Permissions Checkboxes */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">शुरुआती अनुमतियां (Permissions):</span>
                
                <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAgentCanDiscount}
                    onChange={(e) => setNewAgentCanDiscount(e.target.checked)}
                    className="rounded text-orange-500"
                  />
                  <span>छूट (Discounts) देने की अनुमति</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAgentCanPayment}
                    onChange={(e) => setNewAgentCanPayment(e.target.checked)}
                    className="rounded text-orange-500"
                  />
                  <span>पेमेंट लिंक जनरेट करने की अनुमति</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAgentCanAutoReply}
                    onChange={(e) => setNewAgentCanAutoReply(e.target.checked)}
                    className="rounded text-orange-500"
                  />
                  <span>स्वचालित WhatsApp रिप्लाई करने की अनुमति</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md tap-bounce"
                >
                  एजेंट सक्रिय करें
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
