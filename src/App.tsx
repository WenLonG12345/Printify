/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
import type React from "react";
import { useEffect, useState } from "react";
import { DraggableNote } from "./components/DraggableNote";
import { Logo } from "./components/Logo";
import { Printer } from "./components/Printer";
import type { NoteData } from "./types";

const App: React.FC = () => {
	const [notes, setNotes] = useState<NoteData[]>([]);
	const [nextZIndex, setNextZIndex] = useState(1);

	// Initialize with a welcome note
	useEffect(() => {
		if (notes.length === 0) {
			addNote(
				"Welcome to Printify!",
				"yellow",
				window.innerWidth / 2 - 120,
				window.innerHeight / 2 - 200,
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addNote = (
		text: string,
		color: NoteData["color"],
		startX?: number,
		startY?: number,
	) => {
		const id = Date.now().toString();
		const rotation = Math.random() * 8 - 4;

		const stickers: NoteData["sticker"][] = [
			"heart",
			"sparkles",
			"star",
			"smile",
			"sun",
			"moon",
			"cloud",
			"music",
			"zap",
			"ghost",
			"flower",
		];
		const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];

		// Spawn logic
		const spawnX =
			startX ?? window.innerWidth / 2 - 120 + (Math.random() * 40 - 20);
		const spawnY = startY ?? window.innerHeight - 350;

		const newNote: NoteData = {
			id,
			text,
			x: spawnX,
			y: spawnY,
			rotation,
			timestamp: id,
			zIndex: nextZIndex,
			color,
			sticker: randomSticker,
		};

		setNotes((prev) => [...prev, newNote]);
		setNextZIndex((prev) => prev + 1);
	};

	const updateNotePosition = (id: string, x: number, y: number) => {
		setNotes((prev) =>
			prev.map((note) => (note.id === id ? { ...note, x, y } : note)),
		);
	};

	const bringToFront = (id: string) => {
		setNotes((prev) =>
			prev.map((note) =>
				note.id === id ? { ...note, zIndex: nextZIndex } : note,
			),
		);
		setNextZIndex((prev) => prev + 1);
	};

	const deleteNote = (id: string) => {
		setNotes((prev) => prev.filter((n) => n.id !== id));
	};

	return (
		<div className="w-full h-screen bg-[#f0f2f5] overflow-hidden relative font-sans text-slate-800 flex flex-col">
			{/* Modern Gradient Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-80 z-0" />

			{/* Header */}
			<div className="absolute top-10 w-full text-center pointer-events-none z-0">
				<Logo />
			</div>

			{/* Drop Zone Area */}
			<div className="absolute inset-0 z-0 overflow-hidden">
				{notes.map((note) => (
					<DraggableNote
						key={note.id}
						data={note}
						onUpdatePosition={updateNotePosition}
						onBringToFront={bringToFront}
						onDelete={deleteNote}
					/>
				))}
			</div>

			{/* Footer / Input Device Container - responsive and safe-area aware */}
			<div
				className="mt-auto w-full z-40 pb-6 sm:pb-10 flex flex-col items-center justify-end pointer-events-none"
				// style={{ paddingBottom: "env(safe-area-inset-bottom, 1rem)" }}
			>
				<div className="pointer-events-auto w-full max-w-[680px] px-4 sm:px-6 flex justify-center">
					<Printer onPrint={(text, color) => addNote(text, color)} />
				</div>
			</div>
		</div>
	);
};

export default App;
