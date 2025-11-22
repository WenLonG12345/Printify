
export interface NoteData {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
  timestamp: string;
  zIndex: number;
  color: 'white' | 'pink' | 'yellow' | 'blue' | 'green' | 'purple' | 'orange';
  sticker: 'heart' | 'sparkles' | 'star' | 'smile' | 'sun' | 'moon' | 'cloud' | 'music' | 'zap' | 'ghost' | 'flower';
}

export interface PrinterProps {
  onPrint: (text: string, color: NoteData['color']) => void;
}

export interface NoteProps {
  data: NoteData;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onBringToFront: (id: string) => void;
  onDelete: (id: string) => void;
}
