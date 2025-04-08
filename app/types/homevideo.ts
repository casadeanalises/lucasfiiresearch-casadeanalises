export interface HomeVideo {
  _id: string;
  title: string;
  description: string;
  url: string;
  videoId: string;
  thumbnail: string;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
