import { FC, useState } from 'react';

type ColorScheme = {
    bg: string;
    text: string;
    from?: string;
    to?: string;
}

interface ColorSchemes {
    [key: string]: ColorScheme;
}

const WallpaperGenerator: FC = () => {
    const [selectedPhrase, setSelectedPhrase] = useState<string>("Encrypt your way to a safer day");
    const [selectedTheme, setSelectedTheme] = useState<string>("funky");
    const [selectedColor, setSelectedColor] = useState<string>("gold-red");
    const [position, setPosition] = useState<string>("center");
    const [showLogo, setShowLogo] = useState<boolean>(true);
    const [downloadFormat, setDownloadFormat] = useState<string>("jpeg");

    const phrases: string[] = [
        "Encrypt your way to a safer day",
        "Your security matters"
    ];

    const colorSchemes: ColorSchemes = {
        "gold-red": { bg: "#FFC107", text: "#FF4B4B" },
        "teal-indigo": { bg: "#14B8A6", text: "#4F46E5" },
        "gold-blue": { bg: "#FFC107", text: "#2563EB" },
    };

    const handleDownload = (): void => {
        // Download functionality remains the same
        console.log('Downloading...');
    };

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-blue-900 mb-8">Magic Background Machine</h1>

                <div className="grid grid-cols-1 md:grid-cols-[36%_64%] gap-12 w-full">
                    {/* Left Column - Options */}
                    <div className="space-y-8 w-full">
                        {/* Phrase Selector */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Phrase</label>
                            <select
                                value={selectedPhrase}
                                onChange={(e) => setSelectedPhrase(e.target.value)}
                                className="w-full bg-gray-50 border-0 py-3 px-4 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                {phrases.map((phrase) => (
                                    <option key={phrase} value={phrase}>{phrase}</option>
                                ))}
                            </select>
                            <p className="mt-2 text-sm text-gray-500">Choose what your background says.</p>
                        </div>

                        {/* Theme Selector */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Theme</label>
                            <select
                                value={selectedTheme}
                                onChange={(e) => setSelectedTheme(e.target.value)}
                                className="w-full bg-gray-50 border-0 py-3 px-4 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="funky">Funky</option>
                                <option value="bold">Bold</option>
                                <option value="shadow">Shadow</option>
                            </select>
                            <p className="mt-2 text-sm text-gray-500">Choose the background's graphic theme.</p>
                        </div>

                        {/* Color Scheme */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Color Scheme</label>
                            <select
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="w-full bg-gray-50 border-0 py-3 px-4 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="gold-red">Yellow & Red</option>
                                <option value="teal-indigo">Teal & Indigo</option>
                                <option value="gold-blue">Yellow & Blue</option>
                            </select>
                            <p className="mt-2 text-sm text-gray-500">Choose the background's color scheme.</p>
                        </div>

                        {/* Position Selector */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Graphic Position</label>
                            <select
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="w-full bg-gray-50 border-0 py-3 px-4 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="center">Center</option>
                                <option value="bottom-left">Bottom left</option>
                                <option value="bottom-right">Bottom right</option>
                            </select>
                        </div>

                        {/* Logo Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Display full Bitwarden logo</span>
                            <button
                                onClick={() => setShowLogo(!showLogo)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showLogo ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showLogo ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Preview */}
                    <div>
                        <div className="aspect-[4/3] bg-yellow-400 rounded-lg relative overflow-hidden">
                            {/* Top corners - Now conditional based on showLogo */}
                            {showLogo && (
                                <>
                                    <div className="absolute top-4 left-4">
                                        <img src="/bitwarden-logo.svg" alt="Bitwarden" className="h-6" />
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="text-sm text-gray-700">bitwarden.com</span>
                                    </div>
                                </>
                            )}

                            {/* Main content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h2
                                    className="text-4xl font-bold text-red-500 max-w-[80%] text-center"
                                    style={{
                                        color: colorSchemes[selectedColor].text
                                    }}
                                >
                                    {selectedPhrase}
                                </h2>
                            </div>
                        </div>

                        {/* Download Options */}
                        <div className="mt-4 flex items-center gap-4">
                            <select
                                value={downloadFormat}
                                onChange={(e) => setDownloadFormat(e.target.value)}
                                className="bg-gray-50 border-0 py-2 px-4 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="jpeg">JPEG</option>
                                <option value="png">PNG</option>
                                <option value="webp">WEBP</option>
                            </select>
                            <button
                                onClick={handleDownload}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900"
                            >
                                Download
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md ml-auto">
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WallpaperGenerator;