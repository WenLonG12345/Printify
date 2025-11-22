/** biome-ignore-all lint/a11y/noStaticElementInteractions: reason */
import * as htmlToImage from "html-to-image";
import {
	Cloud,
	Download,
	Flower,
	Ghost,
	Heart,
	Moon,
	Music,
	Smile,
	Sparkles,
	Star,
	Sun,
	X,
	Zap,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import type { NoteData } from "../types";

interface DraggableNoteProps {
	data: NoteData;
	onUpdatePosition: (id: string, x: number, y: number) => void;
	onBringToFront: (id: string) => void;
	onDelete: (id: string) => void;
}

const COLORS = {
	white: "bg-white text-gray-800",
	pink: "bg-[#f8bbd0] text-pink-900",
	yellow: "bg-[#fff9c4] text-yellow-900",
	blue: "bg-[#bbdefb] text-blue-900",
	green: "bg-[#c8e6c9] text-green-900",
	purple: "bg-[#e1bee7] text-purple-900",
	orange: "bg-[#ffe0b2] text-orange-900",
};

// Wrapper to create the white sticker border effect using drop-shadows
const StickerWrapper = ({
	children,
	colorClass,
}: React.PropsWithChildren<{ colorClass: string }>) => (
	<div className="filter drop-shadow-[0_0_0_2px_rgba(255,255,255,1)] drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)]">
		<div className={`${colorClass}`}>{children}</div>
	</div>
);

const StickerIcon = ({ type }: { type: NoteData["sticker"] }) => {
	const commonClass = "size-[60px] fill-current";

	switch (type) {
		// Solid Shapes (Stroke 0)
		case "heart":
			return (
				<StickerWrapper colorClass="text-red-500">
					<Heart className={commonClass} strokeWidth={0} />
				</StickerWrapper>
			);
		case "sparkles":
			return (
				<StickerWrapper colorClass="text-yellow-400">
					<Sparkles className={commonClass} strokeWidth={0} />
				</StickerWrapper>
			);
		case "star":
			return (
				<StickerWrapper colorClass="text-orange-400">
					<Star className={commonClass} strokeWidth={0} />
				</StickerWrapper>
			);
		case "moon":
			return (
				<StickerWrapper colorClass="text-indigo-400">
					<Moon className={commonClass} strokeWidth={0} />
				</StickerWrapper>
			);
		case "cloud":
			return (
				<StickerWrapper colorClass="text-sky-400">
					<Cloud className={commonClass} strokeWidth={0} />
				</StickerWrapper>
			);
		case "music":
			return (
				<StickerWrapper colorClass="text-violet-500">
					<Music className={commonClass} strokeWidth={0} />
				</StickerWrapper>
			);
		case "zap":
			return (
				<StickerWrapper colorClass="text-yellow-500">
					<Zap className={commonClass} strokeWidth={0} />
				</StickerWrapper>
			);

		// Line Art / Detailed Shapes (Stroke 2.5)
		case "smile":
			return (
				<StickerWrapper colorClass="text-blue-500">
					<Smile className={commonClass} strokeWidth={2.5} />
				</StickerWrapper>
			);
		case "sun":
			return (
				<StickerWrapper colorClass="text-orange-500">
					<Sun className={commonClass} strokeWidth={2.5} />
				</StickerWrapper>
			);
		case "ghost":
			return (
				<StickerWrapper colorClass="text-slate-400">
					<Ghost className={commonClass} strokeWidth={2.5} />
				</StickerWrapper>
			);
		case "flower":
			return (
				<StickerWrapper colorClass="text-pink-500">
					<Flower className={commonClass} strokeWidth={2.5} />
				</StickerWrapper>
			);

		default:
			return (
				<StickerWrapper colorClass="text-red-500">
					<Heart className={commonClass} strokeWidth={0} />
				</StickerWrapper>
			);
	}
};

export const DraggableNote: React.FC<DraggableNoteProps> = ({
	data,
	onUpdatePosition,
	onBringToFront,
	onDelete,
}) => {
	const noteRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [isHovered, setIsHovered] = useState(false);

	// Handle Drag Start
	const handlePointerDown = (e: React.PointerEvent) => {
		if ((e.target as HTMLElement).closest("button")) return;

		e.preventDefault();
		e.stopPropagation();
		onBringToFront(data.id);

		if (noteRef.current) {
			const rect = noteRef.current.getBoundingClientRect();
			setDragOffset({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
			setIsDragging(true);
			(e.target as Element).setPointerCapture(e.pointerId);
		}
	};

	const handlePointerMove = (e: React.PointerEvent) => {
		if (isDragging) {
			e.preventDefault();
			const newX = e.clientX - dragOffset.x;
			const newY = e.clientY - dragOffset.y;
			onUpdatePosition(data.id, newX, newY);
		}
	};

	const handlePointerUp = (e: React.PointerEvent) => {
		if (isDragging) {
			setIsDragging(false);
			(e.target as Element).releasePointerCapture(e.pointerId);
		}
	};

	const handleShare = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!cardRef.current) return;

		try {
			const dataUrl = await htmlToImage.toPng(cardRef.current, {
				quality: 1.0,
				pixelRatio: 3,
				cacheBust: true,
				// Use filter to exclude controls from the image instead of hiding them in DOM
				filter: (node) => {
					if (node instanceof Element) {
						return !node.classList.contains("controls");
					}
					return true;
				},
			});

			const link = document.createElement("a");
			link.download = `printify-note-${data.timestamp}.png`;
			link.href = dataUrl;
			link.click();
		} catch (err) {
			console.error("Failed to generate image", err);
		}
	};

	const style: React.CSSProperties = {
		position: "absolute",
		left: data.x,
		top: data.y,
		transform: `rotate(${data.rotation}deg)`,
		zIndex: data.zIndex,
		cursor: isDragging ? "grabbing" : "grab",
		touchAction: "none",
	};

	return (
		<div
			ref={noteRef}
			style={style}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={`
        absolute
        ${isDragging ? "scale-105 z-[9999]" : ""}
        transition-transform duration-100
      `}
		>
			{/* Animation Container */}
			<div className="animate-print">
				{/* Visual Card Container (Target for Screenshot) */}
				<div
					ref={cardRef}
					className={`
            w-60 min-h-[220px]
            flex flex-col
            shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)]
            hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)]
            transition-shadow duration-200 
            rounded-sm
            ${COLORS[data.color]}
            ${isDragging ? "shadow-2xl" : ""}
            border-[6px] border-white
          `}
				>
					{/* Washi Tape visual */}
					<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/30 backdrop-blur-[1px] rotate-1 shadow-sm z-10"></div>

					<div className="relative p-6 pt-10 flex-1 flex flex-col items-center">
						{/* Sticker */}
						<div className="absolute -top-5 -right-5 transform rotate-12 z-20 pointer-events-none">
							<div className="w-16 h-16 flex items-center justify-center">
								<StickerIcon type={data.sticker} />
							</div>
						</div>

						{/* Controls - Class 'controls' used by filter to exclude from screenshot */}
						<div
							className={`
              controls absolute top-0 left-0 flex gap-1 
              transition-all duration-200 p-1
              ${isHovered || isDragging ? "opacity-100" : "opacity-0"}
            `}
						>
							<button
								type="button"
								onClick={handleShare}
								className="p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-gray-700 transition-colors"
								title="Save PNG"
							>
								<Download size={12} />
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onDelete(data.id);
								}}
								className="p-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-colors"
								title="Delete"
							>
								<X size={12} />
							</button>
						</div>

						{/* Content */}
						<div
							className="font-hand text-2xl leading-relaxed text-center w-full mb-6 break-words text-gray-800/90"
							style={{ textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}
						>
							{data.text}
						</div>

						{/* Footer Info */}
						<div className="mt-auto w-full flex justify-center">
							<span className="text-[9px] font-bold text-black/20 uppercase tracking-[0.2em]">
								Printify •{" "}
								{new Date(parseInt(data.timestamp, 10)).toLocaleDateString()}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
