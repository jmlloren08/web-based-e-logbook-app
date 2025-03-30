import React, { useState, useEffect } from 'react';

export default function InstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            setInstallPrompt(e);
            setIsInstallable(true);
        });
        
        window.addEventListener('appinstalled', () => {
            // Hide the app-provided install promotion
            setIsInstallable(false);
            console.log('PWA was installed');
        });
    }, []);
    
    const handleInstallClick = () => {
        if (!installPrompt) return;
        
        // Show the install prompt
        installPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        installPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            setInstallPrompt(null);
            setIsInstallable(false);
        });
    };
    
    if (!isInstallable) return null;
    
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button 
                onClick={handleInstallClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
                Install App
            </button>
        </div>
    );
}