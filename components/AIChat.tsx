import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';
import { VerificationStatus } from '../types';
import type { Message, Vehicle } from '../types';

interface AIChatProps {
  vehicles: Vehicle[];
  onClose?: () => void;
}

export default function AIChat({ vehicles, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Namaste! 🙏 I'm your Yatra Rentals AI assistant. I can help you find the perfect vehicle for your Nepal adventure. Where are you planning to go?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lowerMessage = userMessage.toLowerCase();

    // Vehicle recommendations based on keywords
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      const available = vehicles.filter(v => v.available && v.verificationStatus === VerificationStatus.VERIFIED);
      if (available.length === 0) {
        return "I apologize, but there are no vehicles available at the moment. Please check back later!";
      }
      const vehicle = available[0];
      return `I recommend the ${vehicle.name}! It's available in ${vehicle.location} for NPR ${vehicle.pricePerDay.toLocaleString()}/day. It features ${vehicle.features.slice(0, 3).join(', ')}. Would you like to know more about it?`;
    }

    // Location-specific recommendations
    const locations = ['kathmandu', 'pokhara', 'chitwan', 'mustang', 'lukla', 'annapurna'];
    const mentionedLocation = locations.find(loc => lowerMessage.includes(loc));
    if (mentionedLocation) {
      const locationVehicles = vehicles.filter(
        v => v.location.toLowerCase().includes(mentionedLocation) && v.available && v.verificationStatus === VerificationStatus.VERIFIED
      );
      if (locationVehicles.length > 0) {
        return `Great choice! ${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)} is beautiful. I found ${locationVehicles.length} available vehicle(s) there. The ${locationVehicles[0].name} is perfect for that area. Would you like to see more options?`;
      }
      return `${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)} is a wonderful destination! Let me check which vehicles are available for that area...`;
    }

    // Vehicle type queries
    if (lowerMessage.includes('suv') || lowerMessage.includes('offroad') || lowerMessage.includes('4x4')) {
      const suvs = vehicles.filter(v => (v.type === 'SUV' || v.type === '4x4 Offroad') && v.available);
      if (suvs.length > 0) {
        return `For rugged terrain, I recommend our ${suvs[0].type} options. The ${suvs[0].name} has excellent ground clearance and 4WD capability. Perfect for Nepal's mountain roads!`;
      }
      return "SUVs and 4x4 vehicles are great for Nepal's terrain! Let me find the best options for you.";
    }

    if (lowerMessage.includes('bike') || lowerMessage.includes('motorcycle') || lowerMessage.includes('motorbike')) {
      const bikes = vehicles.filter(v => v.type === 'Motorbike' && v.available);
      if (bikes.length > 0) {
        return `Motorcycles are perfect for exploring Nepal! The ${bikes[0].name} is very popular among travelers. It's nimble for city traffic and capable on mountain roads.`;
      }
      return "Motorcycles are a fantastic way to explore Nepal! They're perfect for the winding mountain roads.";
    }

    // Price queries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('cheap') || lowerMessage.includes('budget')) {
      const sorted = vehicles
        .filter(v => v.available && v.verificationStatus === VerificationStatus.VERIFIED)
        .sort((a, b) => a.pricePerDay - b.pricePerDay);
      if (sorted.length > 0) {
        return `Our most budget-friendly option is the ${sorted[0].name} at NPR ${sorted[0].pricePerDay.toLocaleString()}/day. Prices range from NPR ${sorted[0].pricePerDay.toLocaleString()} to NPR ${sorted[sorted.length - 1].pricePerDay.toLocaleString()} per day.`;
      }
    }

    // Insurance questions
    if (lowerMessage.includes('insurance')) {
      return "We offer comprehensive insurance at NPR 500/day, which covers damage and theft. It's highly recommended for peace of mind, especially on mountain roads!";
    }

    // Document requirements
    if (lowerMessage.includes('document') || lowerMessage.includes('license') || lowerMessage.includes('permit')) {
      return "You'll need a valid driver's license (international license for foreign visitors) and a government ID. For certain restricted areas like Mustang, you'll also need special permits.";
    }

    // Weather and seasons
    if (lowerMessage.includes('weather') || lowerMessage.includes('season') || lowerMessage.includes('time')) {
      return "Best time for road trips in Nepal: October-November (autumn) and March-May (spring). Monsoon season (June-August) can make roads challenging. Winter (December-February) is great but some high-altitude passes may be closed.";
    }

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
      return "Namaste! How can I help you find the perfect vehicle for your Nepal journey today?";
    }

    if (lowerMessage.includes('thank')) {
      return "You're welcome! Happy travels in Nepal! 🏔️ Feel free to ask if you need anything else.";
    }

    // Default response
    return "I'd be happy to help! I can assist you with vehicle recommendations, pricing, locations, and travel tips for Nepal. What would you like to know?";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateAIResponse(input.trim());

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all z-50 animate-bounce"
        aria-label="Open chat"
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 animate-slideInRight">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Yatra AI Assistant</h3>
            <p className="text-xs text-blue-100">Powered by Gemini AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="hover:bg-white hover:bg-opacity-20 p-1.5 rounded transition-colors"
            aria-label="Minimize chat"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="hover:bg-white hover:bg-opacity-20 p-1.5 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 shadow-sm border border-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-700" />
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setInput('Recommend a vehicle for Pokhara')}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors whitespace-nowrap"
          >
            Pokhara Trip
          </button>
          <button
            onClick={() => setInput('What are the insurance options?')}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors whitespace-nowrap"
          >
            Insurance
          </button>
          <button
            onClick={() => setInput('Budget friendly options?')}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors whitespace-nowrap"
          >
            Budget
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Floating Chat Button
export function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all z-40 hover:scale-110"
      aria-label="Open AI chat"
    >
      <Bot className="w-6 h-6" />
    </button>
  );
}
