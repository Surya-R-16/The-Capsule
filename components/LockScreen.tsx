import React, { useState, useEffect } from 'react';

interface LockScreenProps {
    onUnlock: (pin: string) => void;
    isSetupMode?: boolean;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'unlock' | 'setup' | 'confirm'>('unlock');

    useEffect(() => {
        const savedPin = localStorage.getItem('capsule_pin');
        if (!savedPin) {
            setMode('setup');
        }
    }, []);

    const handleNumberClick = (num: number) => {
        if (pin.length < 4) {
            setPin(prev => prev + num);
            setError('');
        }
    };

    const handleBackspace = () => {
        setPin(prev => prev.slice(0, -1));
        setError('');
    };

    const handleSubmit = () => {
        if (pin.length !== 4) return;

        if (mode === 'setup') {
            setConfirmPin(pin);
            setPin('');
            setMode('confirm');
        } else if (mode === 'confirm') {
            if (pin === confirmPin) {
                // In a real app, hash this! keeping simple for now as requested
                localStorage.setItem('capsule_pin', pin);
                onUnlock(pin);
            } else {
                setError("PINs don't match");
                setPin('');
                setConfirmPin('');
                setMode('setup');
            }
        } else {
            // Unlock mode
            // Let parent handle verification against encrypted data
            onUnlock(pin);
        }
    };

    // Auto-submit when 4 digits entered
    useEffect(() => {
        if (pin.length === 4) {
            // Small delay for UX
            const timer = setTimeout(handleSubmit, 200);
            return () => clearTimeout(timer);
        }
    }, [pin]);

    return (
        <div className="fixed inset-0 z-[200] bg-stone-900 flex flex-col items-center justify-center p-4 text-white">
            <div className="mb-8 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mb-6 shadow-2xl border border-stone-700">
                    <i className="fas fa-lock text-emerald-500 text-xl"></i>
                </div>
                <h2 className="serif text-2xl font-bold tracking-wide">
                    {mode === 'setup' ? 'Set Access PIN' : mode === 'confirm' ? 'Confirm PIN' : 'The Capsule'}
                </h2>
                <p className="text-stone-500 text-xs mt-2 uppercase tracking-widest font-bold">
                    {mode === 'unlock' ? 'Identity Verification' : 'Secure your archive'}
                </p>
            </div>

            <div className="mb-8 flex gap-4">
                {[0, 1, 2, 3].map(i => (
                    <div
                        key={i}
                        className={`w-4 h-4 rounded-full transition-all duration-300 ${i < pin.length ? 'bg-emerald-500 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-stone-800'}`}
                    ></div>
                ))}
            </div>

            {error && (
                <p className="text-rose-500 text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-3 gap-6 max-w-xs w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        onClick={() => handleNumberClick(num)}
                        className="w-16 h-16 rounded-full bg-stone-800 hover:bg-stone-700 active:bg-emerald-900 border border-stone-700 flex items-center justify-center text-xl font-bold transition-all"
                    >
                        {num}
                    </button>
                ))}
                <div className="w-16 h-16"></div>
                <button
                    onClick={() => handleNumberClick(0)}
                    className="w-16 h-16 rounded-full bg-stone-800 hover:bg-stone-700 active:bg-emerald-900 border border-stone-700 flex items-center justify-center text-xl font-bold transition-all"
                >
                    0
                </button>
                <button
                    onClick={handleBackspace}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-stone-500 hover:text-white transition-all"
                >
                    <i className="fas fa-backspace"></i>
                </button>
            </div>
        </div>
    );
};

export default LockScreen;
