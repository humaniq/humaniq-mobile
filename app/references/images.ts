export type PictureSourceDescriptor = {
  src: string;
  variant?: string;
};

export type PictureDescriptor = {
  src: string;
  sources?: Array<PictureSourceDescriptor>;
  webpSources?: Array<PictureSourceDescriptor>;
};
