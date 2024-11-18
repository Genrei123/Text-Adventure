const SageAI = require('./app');
SageAI.initialize().then(ia => {
    window.ia = ia;
    ia.sendEvent("ia-loaded");
});