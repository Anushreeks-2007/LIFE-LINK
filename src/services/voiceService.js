// Voice Assistant Service using Web Speech API (Recognition + Synthesis) + Intent Matcher

export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

/**
 * Creates and configures a SpeechRecognition instance for the chosen language
 */
export function createSpeechRecognizer({
  language = 'en',
  onResult,
  onError,
  onEnd,
  onStart,
}) {
  if (!isSpeechRecognitionSupported()) {
    throw new Error('Web Speech Recognition API is not supported in this browser.');
  }

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRec();

  // Language mapping
  const langMap = {
    en: 'en-IN',
    kn: 'kn-IN',
    hi: 'hi-IN',
  };

  recognition.lang = langMap[language] || 'en-IN';
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    if (onStart) onStart();
  };

  recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    if (onResult) {
      onResult({
        transcript: finalTranscript || interimTranscript,
        isFinal: Boolean(finalTranscript),
      });
    }
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
}

/**
 * Spoken response using SpeechSynthesis
 */
export function speakResponse(text, language = 'en') {
  if (!isSpeechSynthesisSupported() || !text) return;

  window.speechSynthesis.cancel(); // Stop any pending speech

  const utterance = new SpeechSynthesisUtterance(text);
  const langMap = {
    en: 'en-IN',
    kn: 'kn-IN',
    hi: 'hi-IN',
  };
  utterance.lang = langMap[language] || 'en-IN';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Attempt to select an appropriate local voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.startsWith(language));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Interprets recognized voice or typed command into structured healthcare filters
 */
export function parseEmergencyIntent(transcript, language = 'en') {
  const text = (transcript || '').toLowerCase().trim();

  const result = {
    intent: 'FIND_HOSPITAL',
    query: '',
    emergencyOnly: false,
    hasIcu: false,
    hasOxygen: false,
    hasBlood: false,
    specialty: null,
    speechResponse: '',
  };

  // English Keywords
  const isEnEmergency = text.includes('emergency') || text.includes('trauma') || text.includes('urgent') || text.includes('casualty');
  const isEnICU = text.includes('icu') || text.includes('intensive') || text.includes('critical bed');
  const isEnOxygen = text.includes('oxygen');
  const isEnBlood = text.includes('blood') || text.includes('plasma');
  const isEnSnake = text.includes('snake') || text.includes('venom') || text.includes('bite');
  const isEnBurn = text.includes('burn');
  const isEnHeart = text.includes('heart') || text.includes('cardiac') || text.includes('chest pain');
  const isEnChild = text.includes('child') || text.includes('pediatric') || text.includes('baby') || text.includes('maternity');

  // Kannada Keywords
  const isKnEmergency = text.includes('ತುರ್ತು') || text.includes('ಆಪತ್ತು');
  const isKnICU = text.includes('ಐಸಿಯು') || text.includes('ತೀವ್ರ ನಿಗಾ');
  const isKnOxygen = text.includes('ಆಕ್ಸಿಜನ್') || text.includes('ಉಸಿರಾಟ');
  const isKnBlood = text.includes('ರಕ್ತ');
  const isKnSnake = text.includes('ಹಾವು') || text.includes('ವಿಷ');
  const isKnBurn = text.includes('ಸುಟ್ಟ') || text.includes('ಬೆಂಕಿ');
  const isKnHeart = text.includes('ಹೃದಯ') || text.includes('ಗುಂಡಿಗೆ');

  // Hindi Keywords
  const isHiEmergency = text.includes('इमरजेंसी') || text.includes('आपात') || text.includes('गंभीर');
  const isHiICU = text.includes('आईसीयू') || text.includes('गहन चिकित्सा');
  const isHiOxygen = text.includes('ऑक्सीजन');
  const isHiBlood = text.includes('खून') || text.includes('रक्त');
  const isHiSnake = text.includes('सांप') || text.includes('जहर') || text.includes('काटना');
  const isHiBurn = text.includes('जलना') || text.includes('जला');
  const isHiHeart = text.includes('दिल') || text.includes('हार्ट');

  if (isEnEmergency || isKnEmergency || isHiEmergency) {
    result.emergencyOnly = true;
  }
  if (isEnICU || isKnICU || isHiICU) {
    result.hasIcu = true;
  }
  if (isEnOxygen || isKnOxygen || isHiOxygen) {
    result.hasOxygen = true;
  }
  if (isEnBlood || isKnBlood || isHiBlood) {
    result.hasBlood = true;
  }

  if (isEnSnake || isKnSnake || isHiSnake) {
    result.specialty = 'Anti-venom';
    result.query = 'Anti-venom';
  } else if (isEnBurn || isKnBurn || isHiBurn) {
    result.specialty = 'Burn';
    result.query = 'Burn';
  } else if (isEnHeart || isKnHeart || isHiHeart) {
    result.specialty = 'Cardiac';
    result.query = 'Cardiac';
  } else if (isEnChild) {
    result.specialty = 'Pediatric';
    result.query = 'Pediatric';
  }

  // Generate localized spoken responses
  if (language === 'kn') {
    if (result.hasIcu) {
      result.speechResponse = 'ಐಸಿಯು ಹಾಸಿಗೆ ಲಭ್ಯವಿರುವ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ.';
    } else if (result.emergencyOnly) {
      result.speechResponse = '24/7 ತುರ್ತು ಸೇವೆ ಹೊಂದಿರುವ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ.';
    } else {
      result.speechResponse = 'ನಿಮ್ಮ ಹತ್ತಿರವಿರುವ ಸೂಕ್ತ ಆಸ್ಪತ್ರೆಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.';
    }
  } else if (language === 'hi') {
    if (result.hasIcu) {
      result.speechResponse = 'उपलब्ध आईसीयू बेड वाले नजदीकी अस्पतालों को खोजा जा रहा है।';
    } else if (result.emergencyOnly) {
      result.speechResponse = '24/7 आपातकालीन सुविधाओं वाले अस्पताल खोजे जा रहे हैं।';
    } else {
      result.speechResponse = 'आपके नजदीकी उपयुक्त अस्पतालों की सूची तैयार की जा रही है।';
    }
  } else {
    // English
    if (result.hasIcu) {
      result.speechResponse = 'Finding nearby emergency hospitals with available ICU beds.';
    } else if (result.emergencyOnly) {
      result.speechResponse = 'Finding nearby hospitals with 24/7 emergency services.';
    } else {
      result.speechResponse = 'Searching for suitable medical facilities near you.';
    }
  }

  return result;
}
