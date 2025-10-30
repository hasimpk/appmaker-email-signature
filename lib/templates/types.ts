export interface EmailSignatureData {
  photoUrl: string;
  showPhoto?: boolean;
  name: string;
  role: string;
  phone?: string;
  bookingLink?: string;
  linkedinProfile?: string;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
}

export interface EmailSignatureTemplate {
  id: string;
  metadata: TemplateMetadata;
  render: (data: EmailSignatureData) => React.ReactElement;
  generateHTML: (data: EmailSignatureData) => string;
}
