import { Send, Sparkles } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { generateAINote } from "../services/geminiService";
import type { NoteData } from "../types";
import { playPrintSound, playTypeSound } from "../utils/sound";

interface PrinterProps {
	onPrint: (text: string, color: NoteData["color"]) => void;
}

export const Printer: React.FC<PrinterProps> = ({ onPrint }) => {
	const [text, setText] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [selectedColor, setSelectedColor] =
		useState<NoteData["color"]>("yellow");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Session Limit Configuration
	const MAX_GENERATIONS = 3;
	const [generationCount, setGenerationCount] = useState(() => {
		try {
			const saved = sessionStorage.getItem("printify_gen_count");
			return saved ? parseInt(saved, 10) : 0;
		} catch {
			return 0;
		}
	});

	const handlePrint = () => {
		if (!text.trim()) return;

		playPrintSound();
		onPrint(text, selectedColor);
		setText("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handlePrint();
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newText = e.target.value;
		// Only play sound if adding characters (simple heuristic)
		if (newText.length > text.length) {
			playTypeSound();
		}
		setText(newText);
	};

	const handleGenerate = async () => {
		if (generationCount >= MAX_GENERATIONS) return;

		setIsGenerating(true);
		const generated = await generateAINote(text);
		setText(generated);
		setIsGenerating(false);

		const newCount = generationCount + 1;
		setGenerationCount(newCount);
		try {
			sessionStorage.setItem("printify_gen_count", newCount.toString());
		} catch (e) {
			console.error("Failed to save generation count", e);
		}
	};

	const colors: { id: NoteData["color"]; class: string }[] = [
		{ id: "white", class: "bg-white border-gray-200" },
		{ id: "pink", class: "bg-pink-200 border-pink-300" },
		{ id: "yellow", class: "bg-yellow-200 border-yellow-300" },
		{ id: "blue", class: "bg-blue-200 border-blue-300" },
		{ id: "green", class: "bg-green-200 border-green-300" },
		{ id: "purple", class: "bg-purple-200 border-purple-300" },
		{ id: "orange", class: "bg-orange-200 border-orange-300" },
	];

	const isLimitReached = generationCount >= MAX_GENERATIONS;

	return (
		<div className="relative w-full sm:w-[420px] md:w-[450px] lg:w-[520px]">
			{/* Modern Glassmorphism Card */}
			<div
				className="
        relative w-full 
        bg-white/90 backdrop-blur-2xl 
        rounded-3xl p-4 sm:p-6 
        shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)] 
        flex flex-col gap-4 sm:gap-5
        transition-transform duration-300 ease-out
        hover:scale-[1.01]
      "
			>
				{/* Input Area */}
				<div className="relative group">
					<div className="absolute -inset-0.5 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-2xl opacity-30 group-focus-within:opacity-100 transition duration-500 blur"></div>
					<div className="relative bg-white rounded-xl p-1">
						<textarea
							ref={textareaRef}
							value={text}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							placeholder="Type your note..."
							className="w-full h-20 sm:h-24 bg-transparent border-none focus:ring-0 text-slate-700 text-base sm:text-lg placeholder-slate-400 resize-none leading-relaxed p-3 outline-none font-medium rounded-lg"
							maxLength={120}
						/>
						<div className="absolute bottom-2 right-3 text-[10px] font-semibold text-slate-300 uppercase tracking-wider pointer-events-none">
							{text.length} / 120
						</div>
					</div>
				</div>

				{/* Controls */}
				<div className="flex items-center justify-between flex-row gap-3">
					<div className="hidden md:flex items-center gap-2 bg-slate-100/80 p-2 rounded-full">
						{colors.map((c) => (
							<button
								key={c.id}
								type="button"
								onClick={() => setSelectedColor(c.id)}
								aria-label={`Select ${c.id} color`}
								className={`w-5 h-5 rounded-full transition-all duration-300 border ${
									c.class
								} ${
									selectedColor === c.id
										? "scale-110 shadow-md ring-2 ring-offset-1 ring-slate-200"
										: "opacity-60 hover:opacity-100 hover:scale-105"
								}`}
							/>
						))}
					</div>

					<div className="flex md:hidden items-center gap-2">
						<label htmlFor="color-picker-mobile" className="sr-only">
							Choose color
						</label>
						<select
							id="color-picker-mobile"
							value={selectedColor}
							onChange={(e) =>
								setSelectedColor(e.target.value as NoteData["color"])
							}
							className="appearance-none bg-white/90 border border-slate-200 px-3 py-2 rounded-lg text-sm text-slate-700"
						>
							{colors.map((c) => (
								<option key={c.id} value={c.id}>
									{c.id.charAt(0).toUpperCase() + c.id.slice(1)}
								</option>
							))}
						</select>
						{/* Preview circle */}
						<div
							aria-hidden
							className={`w-6 h-6 rounded-full border ${
								colors.find((x) => x.id === selectedColor)?.class ?? "bg-white"
							}`}
						/>
					</div>

					{/* Buttons */}
					<div className="flex items-center gap-3">
						{/* Auto Button */}
						<button
							onClick={handleGenerate}
							disabled={isGenerating || isLimitReached}
							type="button"
							title={
								isLimitReached
									? "Session limit reached"
									: "Generate a note with AI"
							}
							className={`
                        px-4 py-2 rounded-full 
                        bg-white border border-slate-200
                        text-slate-600 text-sm font-semibold
                        transition-all duration-200
                        flex items-center gap-1.5
                        shadow-sm
                        ${
													isGenerating || isLimitReached
														? "opacity-60 cursor-not-allowed"
														: "hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 active:scale-95"
												}
                    `}
						>
							<Sparkles
								size={14}
								className={`text-purple-500 ${
									isGenerating ? "animate-spin" : ""
								} ${isLimitReached ? "grayscale" : ""}`}
							/>
							<span>{isLimitReached ? "Limit" : "Auto"}</span>
							{!isLimitReached && (
								<span className="bg-purple-100 text-purple-600 text-[10px] px-1.5 py-0.5 rounded-full ml-0.5">
									{MAX_GENERATIONS - generationCount}
								</span>
							)}
						</button>

						{/* Send Button */}
						<button
							onClick={handlePrint}
							disabled={!text.trim()}
							type="button"
							className={`
                        w-10 h-10 rounded-full 
                        flex items-center justify-center
                        bg-slate-900 text-white
                        shadow-lg shadow-slate-200
                        active:scale-90 active:shadow-none
                        transition-all duration-200
                        ${
													!text.trim()
														? "opacity-50 cursor-not-allowed"
														: "hover:bg-black hover:scale-105"
												}
                    `}
						>
							<Send
								size={16}
								className={text.trim() ? "translate-x-0.5 translate-y-px" : ""}
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
