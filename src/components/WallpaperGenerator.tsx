import { FC, useState } from 'react';
import '../index.css'
import '../fonts.css'

type ColorScheme = {
    bg: string;
    text: string;
}

interface ColorSchemes {
    [key: string]: ColorScheme;
}

interface ColorValues {
    [key: string]: string;
}

interface AspectRatio {
    ratio: string;
    width: number;
    height: number;
}

interface AspectRatios {
    [key: string]: AspectRatio;
}

const WallpaperGenerator: FC = () => {
    const [selectedPhrase, setSelectedPhrase] = useState<string>("Encrypt your way to a safer day");
    const [selectedTheme, setSelectedTheme] = useState<string>("funky");
    const [selectedColor, setSelectedColor] = useState<string>("gold-red");
    const [position, setPosition] = useState<string>("center");
    const [showLogo, setShowLogo] = useState<boolean>(true);
    const [downloadFormat, setDownloadFormat] = useState<string>("jpeg");
    const [aspectRatio, setAspectRatio] = useState<keyof AspectRatios>("tablet");

    const phrases: string[] = [
        "Encrypt your way to a safer day",
        "Your security matters",
        "Encrypt, Defend, Repeat.",
        "Lock it up, lock them out",
        "Strong coffee, stronger passwords!",
        "Be cyber smart, not cyber sorry.",
        "Two-factor it, or you'll regret it."
    ];

    const colorSchemes: ColorSchemes = {
        "gold-red": { bg: "bg-amber-400", text: "text-red-500" },
        "teal-indigo": { bg: "bg-cyan-400", text: "text-indigo-900" },
        "purple-indigo": { bg: "bg-purple-400", text: "text-indigo-900" },
        "blue2-indigo": { bg: "bg-blue-700", text: "text-indigo-900" },
        "blue-indigo": { bg: "bg-blue-600", text: "text-indigo-900" } 
    };

    // Mapping Tailwind classes to RGB values for canvas
    const colorValues: ColorValues = {
        "bg-amber-400": "rgb(251, 191, 36)",
        "bg-cyan-400": "rgb(34, 211, 238)",
        "bg-purple-400": "rgb(167, 139, 250)",
        "bg-blue-700": "rgb(29, 78, 216)",
        "bg-blue-600": "rgb(37, 99, 235)",
        "text-red-500": "rgb(239, 68, 68)",
        "text-indigo-900": "rgb(49, 46, 129)"
    };

    const getThemeFont = (theme: string): string => {
        switch (theme) {
            case 'funky':
                return 'bermia-black-webfont, sans-serif';
            case 'bold':
                return 'bitcrusher-variable, sans-serif';
            case 'shadow':
                return 'druk-super-italic-web, sans-serif';
            default:
                return 'DM Sans, sans-serif';
        }
    };

    const getPosition = (pos: string): { container: string, text: string } => {
        switch (pos) {
            case 'center':
                return {
                    container: 'flex items-center justify-center',
                    text: 'text-center w-[85%]'
                };
            case 'bottom-right':
                return {
                    container: 'flex items-end justify-end pb-12 pr-12',
                    text: 'text-right w-[40%] leading-none'  // limit width to 40%
                };
            case 'bottom-left':
                return {
                    container: 'flex items-end justify-start pb-12 pl-12',
                    text: 'text-left w-[40%] leading-none'   // limit width to 40%
                };
            default:
                return {
                    container: 'flex items-center justify-center',
                    text: 'text-center w-full leading-none'
                };
        }
    };

    const wrapText = (
        ctx: CanvasRenderingContext2D, 
        text: string, 
        x: number, 
        y: number, 
        maxWidth: number, 
        lineHeight: number,
        currentPosition: string  // Add position as parameter
    ) => {
        const words = text.split(' ');
        let line = '';
        const lines = [];
    
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
    
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);
    
        // Center the text block for non-centered positions
        if (currentPosition !== 'center') {
            const textBlockHeight = lines.length * lineHeight;
            y -= textBlockHeight / 2;
        }
    
        lines.forEach((line, i) => {
            ctx.fillText(line.trim(), x, y + (i * lineHeight));
        });
    };

    const getFontSize = (phrase: string, pos: string, baseWidth: number): number => {
        // Base font size
        let fontSize = baseWidth/15;  // Current default
    
        // Reduce size based on text length
        if (phrase.length > 30) {
            fontSize *= 0.9;  // 30% smaller for long phrases
        } else if (phrase.length > 20) {
            fontSize *= 1;  // 20% smaller for medium phrases
        }
    
        // Further reduce if not centered
        if (pos !== 'center') {
            fontSize *= 0.9;  // 25% smaller for corner positions
        }
    
        return fontSize;
    };

    const aspectRatios: AspectRatios = {
        "desktop": { ratio: "16:10", width: 1200, height: 750 },
        "iphone": { ratio: "19.5:9", width: 1200, height: 554 },
        "android": { ratio: "20:9", width: 1200, height: 540 },
        "tablet": { ratio: "4:3", width: 1200, height: 900 }
    };

    // DOWNLOAD FUNCTION
    const handleDownload = (): void => {
        const preview = document.querySelector('.preview-container');
        if (!preview) return;
    
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', {
            alpha: false,
            desynchronized: false,
            willReadFrequently: false
        });
        if (!ctx) return;
    
        // Use higher base dimensions
        const aspectRatios: AspectRatios = {
            "desktop": { ratio: "16:10", width: 3840, height: 2400 }, // 4K resolution
            "iphone": { ratio: "19.5:9", width: 2778, height: 1284 }, // iPhone resolution
            "android": { ratio: "20:9", width: 3200, height: 1440 }, // QHD+ resolution
            "tablet": { ratio: "4:3", width: 2732, height: 2048 }  // iPad Pro resolution
        };
    
        const { width, height } = aspectRatios[aspectRatio];
        canvas.width = width;
        canvas.height = height;
    
        // Enable image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.textRendering = 'geometricPrecision';
        ctx.letterSpacing = '0px';
        ctx.fontKerning = 'normal';
    
        // Draw background using RGB values
        const bgColor = colorValues[colorSchemes[selectedColor].bg];
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
    
        // Draw text using RGB values
        const textColor = colorValues[colorSchemes[selectedColor].text];
        ctx.fillStyle = textColor;
        const fontSize = getFontSize(selectedPhrase, position, width);
        ctx.font = `bold ${fontSize}px ${getThemeFont(selectedTheme)}`;
        
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
    
        // Apply text effects (shadow and uppercase if shadow theme)
        const textToRender = selectedTheme === 'shadow' 
            ? selectedPhrase.toUpperCase() 
            : selectedPhrase;
    
        if (selectedTheme === 'shadow') {
            if (position !== 'center') {
                const maxWidth = width * 0.4;
                const lineHeight = fontSize * 1.2;
                for (let i = 0; i <= 191; i++) {
                    ctx.shadowColor = '#175ddc';
                    ctx.shadowOffsetX = -i * (scaleFactor / 2); // Adjust shadow for scale
                    ctx.shadowOffsetY = i * (scaleFactor / 2);  // Adjust shadow for scale
                    ctx.shadowBlur = 0;
                    wrapText(ctx, textToRender, textX, textY, maxWidth, lineHeight, position);
                }
            } else {
                ctx.globalCompositeOperation = 'source-over';
                for (let i = 0; i <= 191; i++) {
                    ctx.shadowColor = '#175ddc';
                    ctx.shadowOffsetX = -i * (scaleFactor / 2);
                    ctx.shadowOffsetY = i * (scaleFactor / 2);
                    ctx.shadowBlur = 0;
                    ctx.fillText(textToRender, textX, textY);
                }
            }
        } else {
            // Reset shadow properties
            ctx.shadowColor = 'transparent';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            if (position !== 'center') {
                const maxWidth = width * 0.4;
                const lineHeight = fontSize * 1.2;
                wrapText(ctx, textToRender, textX, textY, maxWidth, lineHeight, position);
            } else {
                ctx.fillText(textToRender, textX, textY);
            }
        }
    
        // Draw logo if enabled - scaled appropriately
        if (showLogo) {
            ctx.fillStyle = '#000000';
            ctx.font = `${24 * scaleFactor}px sans-serif`; // Scale the font size
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.fillText('bitwarden.com', width - (20 * scaleFactor), 40 * scaleFactor);
        }
    
        // Convert to blob and download with quality settings
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `wallpaper.${downloadFormat}`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        }, `image/${downloadFormat}`, 1.0); // Maximum quality
    };

    const positions = getPosition(position);

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-blue-900 mb-8">Bitwarden Wallpaper Machine</h1>

                <div className="grid grid-cols-1 md:grid-cols-[36%_64%] gap-12 w-full">
                    {/* Left Column - Options */}
                    <div className="space-y-8 w-full">
                        {/* Aspect Ratio Selector */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Device Format</label>
                            <select
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                                className="w-full bg-gray-50 border-0 py-3 px-4 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
                            >
                                <option value="desktop">Desktop (16:10)</option>
                                <option value="iphone">iPhone (19.5:9)</option>
                                <option value="android">Android (20:9)</option>
                                <option value="tablet">Tablet (4:3)</option>
                            </select>
                            <p className="mt-2 text-sm text-gray-500">Choose the device format.</p>
                        </div>

                        {/* Phrase Selector */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Phrase</label>
                            <select
                                value={selectedPhrase}
                                onChange={(e) => setSelectedPhrase(e.target.value)}
                                className="w-full bg-gray-50 border-0 py-3 px-4 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
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
                                className="w-full bg-gray-50 border-0 py-3 px-4 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
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
                                className="w-full bg-gray-50 border-0 py-3 px-4 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
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
                                className="w-full bg-gray-50 border-0 py-3 px-4 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
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
                        className={`relative overflow-hidden preview-container ${colorSchemes[selectedColor].bg}`}
                        style={{
                            aspectRatio: aspectRatios[aspectRatio].width / aspectRatios[aspectRatio].height
                        }}
                    >
                            {/* Top corners */}
                            {showLogo && (
                                <>
                                    <div className="absolute top-4 left-4">
                                        <img src="/bitwarden-logo.svg" alt="Logo" className="h-6" />
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="text-sm text-blue-500">bitwarden.com</span>
                                    </div>
                                </>
                            )}

                            {/* Main content */}
                            <div className={`absolute inset-0 ${positions.container}`}>
                                <h2
                                    className={`
                                        font-bold 
                                        ${positions.text} 
                                        ${colorSchemes[selectedColor].text}
                                        ${selectedTheme === 'shadow' ? 'shadow-primary uppercase' : ''}
                                    `}
                                    style={{
                                        fontFamily: getThemeFont(selectedTheme),
                                        fontSize: `${getFontSize(selectedPhrase, position, 1200)/16}rem`,
                                        lineHeight: '0.9'
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