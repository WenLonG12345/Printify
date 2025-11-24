import type React from "react";

export const Logo: React.FC = () => {
	return (
		<div className="flex items-center justify-center gap-3 select-none">
			{/* Icon */}
			<div className="relative size-10 md:size-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center transform -rotate-6 ring-2 ring-white/50">
				<svg
					className="w-7 h-7 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>Icon</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
					/>
				</svg>
				{/* Sparkle Decoration */}
				<div className="absolute -top-2 -right-2 text-yellow-300 drop-shadow-sm">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="animate-pulse"
					>
						<title>Sparkle</title>
						<path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
					</svg>
				</div>
			</div>
			{/* Text */}
			<h1 className="text-2xl md:text-5xl font-bold text-slate-800 font-hand tracking-tight drop-shadow-sm">
				Printify
			</h1>
		</div>
	);
};
