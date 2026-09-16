export type Shot = {
  id: number;
  src: string;
  width: number;
  height: number;
  /** +1 arcs above center, -1 below */
  orbit: 1 | -1;
};

/** Desktop orbit strip — sizes from original Figma collage */
export const SHOTS: Shot[] = [
  { id: 1, src: "/landing/prefooter/footer-placeholder-1.jpg", width: 140, height: 153, orbit: 1 },
  { id: 2, src: "/landing/prefooter/footer-placeholder-2.jpg", width: 140, height: 153, orbit: -1 },
  { id: 3, src: "/landing/prefooter/footer-placeholder-3.jpg", width: 140, height: 153, orbit: 1 },
  { id: 4, src: "/landing/prefooter/footer-placeholder-4.jpg", width: 140, height: 91, orbit: -1 },
  { id: 5, src: "/landing/prefooter/footer-placeholder-5.jpg", width: 140, height: 91, orbit: 1 },
  { id: 6, src: "/landing/prefooter/footer-placeholder-6.jpg", width: 140, height: 91, orbit: -1 },
  { id: 7, src: "/landing/prefooter/footer-placeholder-7.jpg", width: 140, height: 91, orbit: 1 },
  { id: 8, src: "/landing/prefooter/footer-placeholder-8.jpg", width: 140, height: 119, orbit: -1 },
  { id: 9, src: "/landing/prefooter/footer-placeholder-9.jpg", width: 140, height: 119, orbit: 1 },
  { id: 10, src: "/landing/prefooter/footer-placeholder-10.jpg", width: 140, height: 184, orbit: -1 },
  { id: 11, src: "/landing/prefooter/footer-placeholder-11.jpg", width: 112, height: 122, orbit: 1 },
  { id: 12, src: "/landing/prefooter/footer-placeholder-12.jpg", width: 93, height: 122, orbit: -1 },
  { id: 13, src: "/landing/prefooter/footer-placeholder-13.jpg", width: 113, height: 127, orbit: 1 },
  { id: 14, src: "/landing/prefooter/footer-placeholder-14.jpg", width: 68, height: 76, orbit: -1 },
  { id: 15, src: "/landing/prefooter/footer-placeholder-15.jpg", width: 68, height: 76, orbit: 1 },
  { id: 16, src: "/landing/prefooter/footer-placeholder-16.png", width: 106, height: 76, orbit: -1 },
  { id: 17, src: "/landing/prefooter/footer-placeholder-17.jpg", width: 68, height: 76, orbit: 1 },
  { id: 18, src: "/landing/prefooter/footer-placeholder-18.jpg", width: 102, height: 76, orbit: -1 },
];

/** Ids used in the mobile static collage */
export const MOBILE_SHOT_IDS = [15, 5, 4, 9, 18, 10, 14, 8] as const;
