'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, LogOut, Zap, Sparkles, User, Bot, Moon, Sun } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from '@clerk/nextjs';

const BeautifulChatApp = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();
const [isPro, setIsPro] = useState(false);

useEffect(() => {
  const checkStatus = async () => {
    const res = await fetch('/api/user/status');
    const data = await res.json();
    setIsPro(data.isPro);
  };
  checkStatus();
}, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/humanize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();
      const aiMessage = { role: 'assistant', content: data.humanized };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content:  'Something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleSubmit(e);
  };

  const handleRefresh = () => {
    alert('✅ Prompt count refreshed!');
  };

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('❌ Failed to get checkout URL');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('❌ Failed to start upgrade process');
    }
  };

  function setIsSignedIn(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div>
      <SignedOut>
        <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
          darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900'
        }`}>
          <div className="text-center space-y-8 p-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
                <div className="flex items-center justify-center mb-6">
                  <Sparkles className="w-16 h-16 text-purple-600 animate-bounce" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  GPT Humanizer Chat
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  Experience the future of AI conversation
                </p>
                <SignInButton mode="modal">
                  <button
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="relative z-10">Sign In to Continue</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
      
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900'
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-xl border-b transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-gray-800/80 border-gray-700'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
              <div className="absolute inset-0 bg-purple-600 rounded-full blur-md opacity-30"></div>
            </div>
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-200'
            }`}>
              GPT Humanizer
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
           
            
           {!isPro&&( <button
              onClick={handleUpgrade}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Zap className="w-4 h-4" />
              <span>Upgrade</span>
            </button>)}
            
         <SignOutButton>
  <button
    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
  >
    <LogOut className="w-4 h-4" />
    <span>Sign Out</span>
  </button>
</SignOutButton>

          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-4 animate-fade-in ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              
              <div className={`group relative max-w-md lg:max-w-lg xl:max-w-xl ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`relative p-4 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl ${
                  message.role === 'user'
                    ? darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : darkMode
                      ? 'bg-gray-800 text-gray-100 border border-gray-700'
                      : 'bg-gray-700 text-gray-100 border border-gray-600'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className="relative z-10 leading-relaxed">{message.content}</p>
                  {message.role === 'user' && (
                    <div className="absolute -inset-px bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex items-start space-x-4 animate-fade-in">
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className={`relative p-4 rounded-2xl shadow-lg ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-700 border border-gray-600'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-300'}`}>
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-6">
          <div className="relative">
            <div className={`relative flex items-center rounded-2xl shadow-lg transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-gray-700 border border-gray-600'
            }`}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleInputKeyPress}
                className="flex-1 bg-transparent outline-none px-4 py-3 text-lg"
                placeholder="Type your message..."
                disabled={loading}
              />
              <button
                onClick={handleButtonClick}
                disabled={loading || !input.trim()}
                className="m-2 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
      </SignedIn>
    </div>
  );
};

export default BeautifulChatApp;
