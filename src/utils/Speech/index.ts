export const speechRecognitionAPI = (window.SpeechSynthesis || (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window))) ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : undefined