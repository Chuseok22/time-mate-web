import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://meet.chuseok22.com';
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/create-meeting`, lastModified: now, priority: 0.8 },
    { url: `${base}/join-meeting`, lastModified: now, priority: 0.8 },
    { url: `${base}/privacy`, lastModified: now, priority: 0.4 },
  ];
}