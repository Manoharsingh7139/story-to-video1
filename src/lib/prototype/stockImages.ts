// Curated Unsplash photos used as placeholder imagery in the prototype.
export const STOCK_IMAGES: { url: string; label: string }[] = [
  { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1280&q=80", label: "Team meeting" },
  { url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1280&q=80", label: "Laptop on desk" },
  { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1280&q=80", label: "Code on screen" },
  { url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1280&q=80", label: "Person working" },
  { url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1280&q=80", label: "Remote coworking" },
  { url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1280&q=80", label: "Whiteboard session" },
  { url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1280&q=80", label: "Strategy notes" },
  { url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1280&q=80", label: "Charts and graphs" },
  { url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1280&q=80", label: "Coffee meeting" },
  { url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1280&q=80", label: "Office collaboration" },
  { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=80", label: "Open workspace" },
  { url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1280&q=80", label: "Quiet focus" },
];

export const pickRandomImage = (exclude?: string) => {
  const pool = STOCK_IMAGES.filter((i) => i.url !== exclude);
  return pool[Math.floor(Math.random() * pool.length)].url;
};
