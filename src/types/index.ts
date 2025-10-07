export interface User {
  _id: string;
  name: string;
  bio: string | null;
  builder_score: {
    last_calculated_at: string;
    points: number;
    slug: string;
  };
  calculating_score: boolean;
  created_at: string;
  display_name: string;
  human_checkmark: boolean;
  image_url: string;
  location: [number, number];
  scores: {
    last_calculated_at: string;
    points: number;
    slug: string;
  }[];
  tags: string[];
  verified_nationality: boolean;
}

export interface ApiResponse {
  _id: string;
  builder: string;
  connections: User[];
}
