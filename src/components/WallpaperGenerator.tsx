import React, { useState } from 'react';

interface Props { }

const WallpaperGenerator: React.FC<Props> = () => {
    const [selectedPhrase, setSelectedPhrase] = useState("Hello, good lookin!");
    const [selectedColor, setSelectedColor] = useState<keyof typeof colorSchemes>("gold-red");
    const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>("funky");
    const [position, setPosition] = useState<keyof typeof positions>("center");
    const [showLogo, setShowLogo] = useState(false);
    const [downloadFormat, setDownloadFormat] = useState("jpeg");
    const [aspectRatio, setAspectRatio] = useState("desktop");

    const phrases = [
        "Hello, good lookin!",
        "What you got cookin?"
    ];

    const colorSchemes: { [key: string]: { bg: string, text: string, from?: string, to?: string } } = {
        "gold-red": { bg: "#EAB308", text: "#DC2626" },
        "teal-indigo": { bg: "#14B8A6", text: "#4F46E5" },
        "gold-blue": { bg: "#EAB308", text: "#2563EB" },
        "gradient-black": { bg: "gradient", from: "#EF4444", to: "#F97316", text: "#000000" }
    };

    const themes = {
        funky: "Helvetica",
        bold: "Times New Roman",
        shadow: "Courier",
        energized: "Roboto"
    };

    const positions = {
        center: { x: 0.5, y: 0.5 },
        "bottom-left": { x: 0.1, y: 0.9 },
        "bottom-right": { x: 0.9, y: 0.9 }
    };

    const getDimensions = (ratio: string) => {
        const baseWidth = 1200;
        switch (ratio) {
            case 'desktop':
                return { width: baseWidth, height: baseWidth * (10 / 16) }; // 16:10
            case 'iphone':
                return { width: baseWidth, height: baseWidth * (19.5 / 9) }; // 19.5:9
            case 'android':
                return { width: baseWidth, height: baseWidth * (20 / 9) }; // 20:9
            case 'tablet':
                return { width: baseWidth, height: baseWidth * (4 / 3) }; // 4:3
            default:
                return { width: baseWidth, height: baseWidth * (10 / 16) };
        }
    };

    const handleDownload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const dimensions = getDimensions(aspectRatio);

        if (!ctx) return;

        // Set canvas size
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        // Draw background
        if (colorSchemes[selectedColor].bg === "gradient") {
            const gradient = ctx.createLinearGradient(0, 0, dimensions.width, 0);
            if ('from' in colorSchemes[selectedColor] && 'to' in colorSchemes[selectedColor]) {
                gradient.addColorStop(0, colorSchemes[selectedColor].from);
                gradient.addColorStop(1, colorSchemes[selectedColor].to);
            }
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = colorSchemes[selectedColor].bg;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text
        ctx.fillStyle = colorSchemes[selectedColor].text;
        ctx.font = `bold ${dimensions.width / 20}px ${themes[selectedTheme]}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Calculate text position
        const x = positions[position].x * dimensions.width;
        const y = positions[position].y * dimensions.height;

        ctx.fillText(selectedPhrase, x, y);

        // Draw logo if enabled
        if (showLogo) {
            ctx.fillStyle = '#FFFFFF';
            const logoSize = dimensions.width * 0.05;
            ctx.beginPath();
            ctx.arc(
                dimensions.width - logoSize * 1.5,
                dimensions.height - logoSize * 1.5,
                logoSize,
                0,
                2 * Math.PI
            );
            ctx.fill();
        }

        // Convert to blob and download
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `wallpaper.${downloadFormat}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, `image/${downloadFormat}`, 1.0);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Wallpaper Generator</h1>

                <div className="grid grid-cols-2 gap-8">
                    {/* Left Column - Options */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* Aspect Ratio Selector */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Device Format</label>
                                        <select
                                            value={aspectRatio}
                                            onChange={(e) => setAspectRatio(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                        >
                                            <option value="desktop">Desktop (16:10)</option>
                                            <option value="iphone">iPhone (19.5:9)</option>
                                            <option value="android">Android (20:9)</option>
                                            <option value="tablet">Tablet (4:3)</option>
                                        </select>
                                    </div>

                                    {/* Phrase Selector */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Choose your phrase</label>
                                        <select
                                            value={selectedPhrase}
                                            onChange={(e) => setSelectedPhrase(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                        >
                                            {phrases.map((phrase) => (
                                                <option key={phrase} value={phrase}>{phrase}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Color Selector */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Color scheme</label>
                                        <select
                                            value={selectedColor}
                                            onChange={(e) => setSelectedColor(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                        >
                                            <option value="gold-red">Gold background with red text</option>
                                            <option value="teal-indigo">Teal background with indigo text</option>
                                            <option value="gold-blue">Gold background with blue text</option>
                                            <option value="gradient-black">Red/orange gradient with black text</option>
                                        </select>
                                    </div>

                                    {/* Theme Selector */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Theme</label>
                                        <select
                                            value={selectedTheme}
                                            onChange={(e) => setSelectedTheme(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                        >
                                            <option value="funky">Funky (Helvetica)</option>
                                            <option value="bold">Bold (Times New Roman)</option>
                                            <option value="shadow">Shadow (Courier)</option>
                                            <option value="energized">Energized (Roboto)</option>
                                        </select>
                                    </div>

                                    {/* Position Selector */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Graphic Position</label>
                                        <select
                                            value={position}
                                            onChange={(e) => setPosition(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                        >
                                            <option value="center">Center</option>
                                            <option value="bottom-left">Bottom left</option>
                                            <option value="bottom-right">Bottom right</option>
                                        </select>
                                    </div>

                                    {/* Logo Toggle */}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={showLogo}
                                            onChange={(e) => setShowLogo(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Display Bitwarden logo</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Preview and Download */}
                    <div className="space-y-6">
                        {/* Preview Card */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6">
                                <div className="w-full max-w-sm mx-auto">
                                    <div className="relative" style={{
                                        paddingBottom: aspectRatio === 'desktop' ? '62.5%' :
                                            aspectRatio === 'iphone' ? '216.67%' :
                                                aspectRatio === 'android' ? '222.22%' :
                                                    '133.33%'
                                    }}>
                                        <div
                                            className={`absolute inset-0 rounded-lg flex p-6`}
                                            style={{
                                                background: selectedColor === 'gradient-black'
                                                    ? `linear-gradient(to right, ${colorSchemes[selectedColor].from}, ${colorSchemes[selectedColor].to})`
                                                    : colorSchemes[selectedColor].bg,
                                                justifyContent: position === 'center' ? 'center' : position === 'bottom-left' ? 'flex-start' : 'flex-end',
                                                alignItems: position === 'center' ? 'center' : 'flex-end'
                                            }}
                                        >
                                            <h2
                                                className="text-2xl md:text-3xl font-bold text-center"
                                                style={{
                                                    color: colorSchemes[selectedColor].text,
                                                    fontFamily: themes[selectedTheme]
                                                }}
                                            >
                                                {selectedPhrase}
                                            </h2>
                                            {showLogo && (
                                                <div className="absolute bottom-4 right-4 w-8 h-8 bg-white rounded-full" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Download Options Card */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6">
                                <div className="flex gap-4 items-center">
                                    <div className="flex-grow">
                                        <select
                                            value={downloadFormat}
                                            onChange={(e) => setDownloadFormat(e.target.value)}
                                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                        >
                                            <option value="jpeg">JPEG</option>
                                            <option value="png">PNG</option>
                                            <option value="webp">WEBP</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleDownload}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WallpaperGenerator;