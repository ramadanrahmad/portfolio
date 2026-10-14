// ==============================================================================
// DEFINISI TIPE TYPESCRIPT - PORTOFOLIO RAHMAD RAMADAN
// ==============================================================================

export type ProjectCategory = 'game' | 'website' | 'mobile' | 'other';
export type ProjectStatus = 'draft' | 'published';

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  short_description: string;
  description_md: string;
  thumbnail_url: string | null;
  gallery: string[];
  tech_tags: string[];
  role: string | null;
  team_size: string | null;
  start_date: string | null;
  end_date: string | null;
  status: ProjectStatus;
  is_featured: boolean;
  sort_order: number;
  demo_url: string | null;
  repo_url: string | null;
  download_url: string | null;
  video_url: string | null;
  store_url: string | null;
  embed_url: string | null;
  extra: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProjectNote {
  project_id: string;
  notes: string;
  updated_at: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  instagram?: string;
  itch_io?: string;
  email?: string;
  [key: string]: string | undefined;
}

export interface Profile {
  id: string;
  name: string;
  headline: string;
  tagline: string;
  bio: string;
  photo_url: string | null;
  cv_url: string | null;
  email: string;
  location: string;
  open_to_work: boolean;
  social_links: SocialLinks;
  updated_at: string;
}

export type SkillGroup = 'Languages' | 'Frontend' | 'Backend' | 'Game Engine' | 'Tools';

export interface Skill {
  id: string;
  name: string;
  group_name: SkillGroup;
  icon: string;
  sort_order: number;
}

export type ExperienceType = 'education' | 'work' | 'organization' | 'competition';

export interface Experience {
  id: string;
  type: ExperienceType;
  title: string;
  institution: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  sort_order: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  photo_url: string | null;
  sort_order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminUser {
  user_id: string;
  email: string;
  created_at: string;
}
