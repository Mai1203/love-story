export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface LetterData {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
}

export interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  icon?: string;
}

export interface MemoryCategory {
  id: string;
  name: string;
  slug: string;
}

export interface StarMessage {
  id: string;
  message: string;
  author: string;
  date: string;
}

export interface SecretReward {
  id: string;
  secret: string;
  reward: string;
  unlocked: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  folder: string;
  format: string;
}

export interface CountdownData {
  targetDate: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}