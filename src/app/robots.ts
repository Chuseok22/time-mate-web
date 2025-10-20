import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['api/*'] }
    ],
    sitemap: 'https://meet.chuseok22.com/stiemap.xml',
    host: 'https://meet.chuseok22.com',
  };
};