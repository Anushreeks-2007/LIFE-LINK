import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speakResponse,
  parseEmergencyIntent
} from '../../services/voiceService';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export function VoiceAssistantWidget({ onIntentRecognized, standalone = false }) {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [typedText, setTypedText] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [speechError, setSpeechError] = useState(null);
  const [speakReplies, setSpeakReplies] = useState(true);
  const [recognizedResult, setRecognizedResult] = useState(null);
  const recognizerRef = React.useRef(null);

  useEffect(() => {
    setVoiceSupported(isSpeechRecognitionSupported());
  }, []);

  const handleStartListening = () => {
    setSpeechError(null);
    setRecognizedResult(null);
    setTranscript('');

    if (!isSpeechRecognitionSupported()) {
      setSpeechError('Web Speech Recognition is not supported on this browser. Please use the text input below.');
      return;
    }

    try {
      const recognizer = createSpeechRecognizer({
        language,
        onStart: () => setIsListening(true),
        onResult: ({ transcript: text, isFinal }) => {
          setTranscript(text);
          if (isFinal) {
            processVoiceQuery(text);
          }
        },
        onError: (err) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
          setSpeechError(`Voice error: ${err}. Please try again or type below.`);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });

      recognizerRef.current = recognizer;
      recognizer.start();
    } catch (e) {
      setIsListening(false);
      setSpeechError(e.message || 'Microphone access failed.');
    }
  };

  const handleStopListening = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceQuery = (queryText) => {
    if (!queryText.trim()) return;

    const intent = parseEmergencyIntent(queryText, language);
    setRecognizedResult(intent);

    if (speakReplies && intent.speechResponse) {
      speakResponse(intent.speechResponse, language);
    }

    if (onIntentRecognized) {
      onIntentRecognized(intent);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!typedText.trim()) return;
    setTranscript(typedText);
    processVoiceQuery(typedText);
    setTypedText('');
  };

  const handleSampleClick = (phrase) => {
    setTranscript(phrase);
    processVoiceQuery(phrase);
  };

  // Sample phrases based on current language
  const samplePhrases = {
    en: [
      "Find hospital with available ICU bed",
      "Nearby emergency hospital",
      "Hospital with anti-venom medicine"
    ],
    kn: [
      "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಯನ್ನು ಹುಡುಕಿ",
      "ಐಸಿಯು ಹಾಸಿಗೆ ಲಭ್ಯವಿರುವ ಆಸ್ಪತ್ರೆ",
      "ಹಾವು ಕಡಿತದ ಔಷಧ ಹೊಂದಿರುವ ಆಸ್ಪತ್ರೆ"
    ],
    hi: [
      "मेरे पास एक अस्पताल खोजें",
      "उपलब्ध आईसीयू बेड वाला अस्पताल",
      "एंटी-वेनम दवा वाला अस्पताल"
    ]
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm max-w-2xl mx-auto ${standalone ? 'my-8' : ''}`}>
      {/* Header & Controls */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {t('featVoiceTitle')}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              English • ಕನ್ನಡ • हिन्दी
            </p>
          </div>
        </div>

        {/* Audio response toggle */}
        <button
          type="button"
          onClick={() => setSpeakReplies(!speakReplies)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            speakReplies
              ? 'bg-teal-50 border-teal-200 text-teal-800'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
          title="Toggle Spoken Voice Responses"
        >
          {speakReplies ? <Volume2 className="w-4 h-4 text-teal-700" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{speakReplies ? 'Voice Readout On' : 'Muted'}</span>
        </button>
      </div>

      {/* Main Microphone Button */}
      <div className="text-center py-6">
        <button
          type="button"
          onClick={isListening ? handleStopListening : handleStartListening}
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto transition shadow-lg ${
            isListening
              ? 'bg-rose-600 text-white shadow-rose-500/50 scale-110 emergency-pulse'
              : 'bg-gradient-to-tr from-teal-700 to-teal-500 text-white shadow-teal-700/30 hover:scale-105 active:scale-95'
          }`}
          aria-label={isListening ? 'Stop Listening' : 'Start Voice Search'}
        >
          {isListening ? (
            <MicOff className="w-10 h-10 animate-bounce" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </button>

        <p className="mt-4 text-sm font-bold text-slate-800">
          {isListening ? 'Listening... Speak your healthcare request' : 'Tap to Speak'}
        </p>
        <p className="text-xs text-slate-500">
          Try saying: "{samplePhrases[language]?.[0] || 'Find nearby emergency hospital'}"
        </p>
      </div>

      {/* Live Transcript Box */}
      {transcript && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 animate-in fade-in">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Recognized Query
          </span>
          <p className="text-sm font-semibold text-slate-800 italic">
            "{transcript}"
          </p>
        </div>
      )}

      {/* Recognized Intent Result Box */}
      {recognizedResult && (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 mb-5 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2 mb-2 text-teal-900 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-700" />
            <span>Intent Understood</span>
          </div>
          <p className="text-xs text-teal-800 font-medium mb-3">
            {recognizedResult.speechResponse}
          </p>

          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams();
              if (recognizedResult.emergencyOnly) params.set('emergency', '1');
              if (recognizedResult.hasIcu) params.set('icu', '1');
              if (recognizedResult.hasOxygen) params.set('oxygen', '1');
              if (recognizedResult.hasBlood) params.set('blood', '1');
              if (recognizedResult.query) params.set('q', recognizedResult.query);
              navigate(`/hospitals?${params.toString()}`);
            }}
            className="inline-flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
          >
            Show Filtered Hospital Results <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Voice Error notice */}
      {speechError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-5 text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Quick Sample Prompts */}
      <div className="mb-6">
        <span className="text-xs font-bold text-slate-500 block mb-2">
          Quick Suggestions:
        </span>
        <div className="flex flex-wrap gap-2">
          {(samplePhrases[language] || samplePhrases.en).map((phrase, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleClick(phrase)}
              className="text-xs text-left bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 border border-slate-200 px-3 py-1.5 rounded-xl transition font-medium"
            >
              "{phrase}"
            </button>
          ))}
        </div>
      </div>

      {/* Text Input Fallback */}
      <form onSubmit={handleTextSubmit} className="pt-4 border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={typedText}
          onChange={(e) => setTypedText(e.target.value)}
          placeholder="Or type your emergency request here..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
        <button
          type="submit"
          className="bg-slate-900 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>
    </div>
  );
}
