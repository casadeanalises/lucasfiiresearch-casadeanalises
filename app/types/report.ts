export interface ReportItem {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  time: string;
  code: string;
  type: string;
  thumbnail: string;
  premium: boolean;
  tags: string[];
  month: string;
  year: string;
  videoId?: string;
  url?: string;
  pageCount?: number;
  dividendYield?: string;
  price?: string;
  relatedVideoId?: string | null;
  fileContent?: string;
}
