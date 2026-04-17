import React, { useState } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const VoiceAssistant = ({ onAnalyze }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'hi-IN, en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      toast.success('Listening... Speak your farm details');
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      toast.success(`You said: ${text}`);
      parseVoiceCommand(text);
    };

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
      toast.error('Failed to recognize. Please try again.');
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const parseVoiceCommand = (text) => {
    // Simple NLP to extract farm details
    const lowerText = text.toLowerCase();
    
    let soil = 'loamy';
    let crop = 'rice';
    let rainfall = 'medium';
    let ph = 6.5;

    if (lowerText.includes('sandy')) soil = 'sandy';
    if (lowerText.includes('clay')) soil = 'clay';
    
    if (lowerText.includes('wheat')) crop = 'wheat';
    if (lowerText.includes('corn') || lowerText.includes('maize')) crop = 'corn';
    if (lowerText.includes('cotton')) crop = 'cotton';
    
    if (lowerText.includes('low rain')) rainfall = 'low';
    if (lowerText.includes('high rain')) rainfall = 'high';
    
    // Extract pH if mentioned
    const phMatch = lowerText.match(/ph (\d+\.?\d*)/);
    if (phMatch) ph = parseFloat(phMatch[1]);

    onAnalyze({ soil, ph, rainfall, crop });
  };

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-green-800">🎤 Voice Assistant</h4>
          <p className="text-xs text-gray-600">Speak in Hindi or English</p>
        </div>
        <button
          onClick={startListening}
          disabled={listening}
          className={`p-3 rounded-full transition-all ${
            listening 
              ? 'bg-red-500 animate-pulse' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {listening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>
      {transcript && (
        <div className="mt-2 p-2 bg-white rounded text-sm">
          <span className="text-gray-500">You said:</span> {transcript}
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant; 