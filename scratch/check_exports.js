const lucide = require('lucide-react');
console.log('Lucide exports containing Git:', Object.keys(lucide).filter(k => k.toLowerCase().includes('git')));
console.log('Lucide exports containing Twit:', Object.keys(lucide).filter(k => k.toLowerCase().includes('twit')));
