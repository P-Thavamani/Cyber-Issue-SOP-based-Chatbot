import React, { useState, useRef, useEffect } from 'react';
import { Message, SopStepType } from '../types';
import { initGemini, getSopFromGemini, uploadFileToGemini } from '../services/geminiService';
import SopStep from '../components/SopStep';
import Flowchart from '../components/Flowchart';

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentSop, setCurrentSop] = useState<SopStepType[]>([]);
  const [hoveredStepId, setHoveredStepId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGemini();
  }, []); // Initialize Gemini only once on component mount

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    const loadingMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', isLoading: true };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setCurrentSop([]);

    try {
        const sopSteps = await getSopFromGemini(input);
        console.log("SOP Steps received from Gemini:", sopSteps);
        const aiMessage: Message = { 
            id: (Date.now() + 1).toString(), 
            sender: 'ai', 
            text: sopSteps.length > 0 ? `I have generated a Standard Operating Procedure (SOP) for handling a "${input}". Please review the steps and flowchart below.` : `I couldn't generate an SOP for "${input}". Please try a different query.`,
            sop: sopSteps 
        };
        setCurrentSop(sopSteps);
        setMessages(prev => [...prev.slice(0, -1), aiMessage]);
    } catch (error) {
        console.error("Error fetching SOP:", error);
        const errorMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
        setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: `Uploading evidence: ${file.name}...`,
        isLoading: true,
      };
      setMessages(prev => [...prev, uploadMessage]);

      try {
        const filePart = await uploadFileToGemini(file);
        if (filePart) {
          // For now, we are just uploading the file. In a more advanced scenario,
          // this filePart would be sent along with the prompt to Gemini.
          // The current prompt is designed for text input, so we'll just confirm upload.
          const successMessage: Message = {
            id: Date.now().toString(),
            sender: 'ai',
            text: `Successfully uploaded ${file.name}. This file can now be used for context in future queries. (Note: Current model integration primarily uses text prompts, but file upload functionality is enabled for future enhancements.)`,
            isLoading: false,
          };
          setMessages(prev => [...prev.slice(0, -1), successMessage]);
        } else {
          const errorMessage: Message = {
            id: Date.now().toString(),
            sender: 'ai',
            text: `Failed to upload ${file.name}. Please try again.`,
            isLoading: false,
          };
          setMessages(prev => [...prev.slice(0, -1), errorMessage]);
        }
      } catch (error) {
        console.error("Error handling file upload:", error);
        const errorMessage: Message = {
          id: Date.now().toString(),
          sender: 'ai',
          text: `An error occurred during file upload for ${file.name}. Please try again.`,
          isLoading: false,
        };
        setMessages(prev => [...prev.slice(0, -1), errorMessage]);
      }
    }
  };

  const handleExportSop = () => {
    if (currentSop.length === 0) return;
    const sopText = currentSop.map((step, index) => {
        return `${index + 1}. ${step.title}\n${step.description}\n\n`;
    }).join('');

    const blob = new Blob([sopText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sop_export.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Main panel for chat, SOP, and flowchart */}
      <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
        <div className="flex-grow p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>
                  {msg.isLoading ? (
                     <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-150"></div>
                     </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {currentSop.length > 0 && (
            <>
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Generated SOP Steps:</h3>
                    <button 
                        onClick={handleExportSop}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                        Export SOP
                    </button>
                  </div>
                  {currentSop.map((step, index) => (
                      <SopStep key={step.id} step={step} stepNumber={index + 1} isHovered={hoveredStepId === step.id} />
                  ))}
              </div>
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                 <Flowchart steps={currentSop} onStepHover={setHoveredStepId} />
              </div>
            </>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe a cyber issue, e.g., 'Phishing attack detected'..."
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="cursor-pointer p-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                📎
                <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;