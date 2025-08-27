export interface IconInterface {
  className?: string;
  stroke?: string;
  fill?: string;
  isHovered?: boolean;
}
export interface ImagesInterface {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  fetchpriority?: 'high' | 'low' | 'auto';
}