import { FC, useState } from 'react';

type ColorScheme = {
    bg: string;
    text: string;
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
        "gold-red": { bg: "rgb(255, 193, 7)", text: "rgb(255, 75, 75)" },
        "teal-indigo": { bg: "rgb(20, 184, 166)", text: "rgb(79, 70, 229)" },
        "blue-indigo": { bg: "rgb(59, 130, 246)", text: "rgb(79, 70, 229)" }
    };

    const getThemeFont = (theme: string): string => {
        switch (theme) {
            case 'funky':
                return 'Helvetica, Arial, sans-serif';
            case 'bold':
                return '"Times New Roman", Times, serif';
            case 'shadow':
                return '"Courier New", Courier, monospace';
            default:
                return 'Helvetica, Arial, sans-serif';
        }
    };

    const getPosition = (pos: string): { container: string, text: string } => {
        switch (pos) {
            case 'center':
                return {
                    container: 'flex items-center justify-center',
                    text: 'text-center'
                };
            case 'bottom-right':
                return {
                    container: 'flex items-end justify-end pb-12 pr-12',
                    text: 'text-right'
                };
            case 'bottom-left':
                return {
                    container: 'flex items-start justify-start pb-12 pl-12',
                    text: 'text-left'
                };
            default:
                return {
                    container: 'flex items-center justify-center',
                    text: 'text-center'
                };
        }
    };

    const handleDownload = (): void => {
        const preview = document.querySelector('.preview-container');
        if (!preview) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        const width = 1200;
        const height = 900; // 4:3 aspect ratio
        canvas.width = width;
        canvas.height = height;

        // Draw background
        ctx.fillStyle = colorSchemes[selectedColor].bg;
        ctx.fillRect(0, 0, width, height);

        // Draw text
        ctx.fillStyle = colorSchemes[selectedColor].text;
        ctx.font = `bold ${width/15}px ${getThemeFont(selectedTheme)}`;
        
        // Set text alignment based on position
        if (position === 'bottom-right') {
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
        } else if (position === 'bottom-left') {
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
        } else {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
        }

        // Position text according to selection
        let textX = width/2;
        let textY = height/2;
        
        if (position === 'bottom-left') {
            textX = width * 0.1;
            textY = height * 0.9;
        } else if (position === 'bottom-right') {
            textX = width * 0.9;
            textY = height * 0.9;
        }
        
        ctx.fillText(selectedPhrase, textX, textY);

        // Draw logo if enabled
        if (showLogo) {
            ctx.fillStyle = '#000000';
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.fillText('bitwarden.com', width - 20, 40);
        }

        // Convert to blob and download
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `wallpaper.${downloadFormat}`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        }, `image/${downloadFormat}`);
    };

    const positions = getPosition(position);

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
                                <option value="funky">Funky (Helvetica)</option>
                                <option value="bold">Bold (Times New Roman)</option>
                                <option value="shadow">Shadow (Courier)</option>
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
                                <option value="gold-red">Yellow background with red text</option>
                                <option value="teal-indigo">Teal background with indigo text</option>
                                <option value="blue-indigo">Blue background with indigo text</option>
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
                            <span className="text-sm text-gray-700">Display full Company logo</span>
                            <div className="relative inline-block w-11 h-6 transition duration-200 ease-in-out">
                                <input
                                    type="checkbox"
                                    id="toggle"
                                    className="hidden"
                                    checked={showLogo}
                                    onChange={() => setShowLogo(!showLogo)}
                                />
                                <label
                                    htmlFor="toggle"
                                    className={`absolute block w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                                        showLogo ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                                >
                                    <span
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                                            showLogo ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Preview */}
                    <div>
                        <div 
                            className="aspect-[4/3] rounded-lg relative overflow-hidden preview-container"
                            style={{ backgroundColor: colorSchemes[selectedColor].bg }}
                        >
                            {/* Top corners */}
                            {showLogo && (
                                <>
                                    <div className="absolute top-4 left-4">
                                        <img src="/logo.svg" alt="Logo" className="h-6" />
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="text-sm text-gray-700">website.com</span>
                                    </div>
                                </>
                            )}

                            {/* Main content */}
                            <div className={`absolute inset-0 ${positions.container}`}>
                                <h2
                                    className={`text-4xl font-bold ${positions.text}`}
                                    style={{
                                        color: colorSchemes[selectedColor].text,
                                        fontFamily: getThemeFont(selectedTheme)
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