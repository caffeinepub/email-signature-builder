export interface SignatureData {
  name: string;
  jobTitle: string;
  company: string;
  phone: string;
  website: string;
  email: string;
  tagline: string;
  description: string;
  logoBase64: string | null;
  socials: {
    linkedin: string;
    x: string;
    instagram: string;
    facebook: string;
    youtube: string;
    tiktok: string;
    substack: string;
  };
}

export interface StyleOptions {
  font: string;
  primaryColor: string;
  secondaryColor: string;
  useGradient: boolean;
  gradientStart: string;
  gradientEnd: string;
}

export interface TemplateEntry {
  name: string;
  fn: (data: SignatureData, opts: StyleOptions) => string;
}
