export const sections = [
  { id: "home", label: "Home", tone: "dark" },
  { id: "shows", label: "Shows", tone: "light" },
  { id: "music", label: "Music", tone: "orange" },
  { id: "video", label: "Video", tone: "dark" },
  { id: "photos", label: "Photos", tone: "dark" },
  { id: "store", label: "Store", tone: "light" },
  { id: "about", label: "About", tone: "orange" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const sectionIndex = (id: SectionId) => sections.findIndex((s) => s.id === id);

export const socials = [
  { name: "Instagram", href: "https://www.instagram.com/morrisseyblvdband/" },
  { name: "Spotify", href: "https://open.spotify.com/artist/3XgYdADXyvGiZhHw96Rj3T" },
  { name: "YouTube", href: "https://www.youtube.com/channel/UCUgdQy1jXc_BVt58Cti2Z1Q" },
  { name: "TikTok", href: "https://www.tiktok.com/@morrisseyblvd" },
] as const;

// Fall 2026 tour, from the tour poster on Instagram plus the extra dates on
// the old site. Venue details are filled in where they are known.
export type Show = {
  date: string; // YYYY-MM-DD
  city: string;
  venue?: string;
  address?: string;
  with?: string;
  tickets?: string;
};

export const shows: Show[] = [
  { date: "2026-09-03", city: "South Kingstown, RI", with: "Old Mervs" },
  { date: "2026-09-04", city: "Amherst, MA", with: "Old Mervs" },
  { date: "2026-09-05", city: "Marshfield, MA", with: "Old Mervs" },
  { date: "2026-09-06", city: "Asbury Park, NJ", with: "Old Mervs" },
  { date: "2026-09-09", city: "Philadelphia, PA", with: "The 4411" },
  { date: "2026-09-10", city: "New York, NY", with: "The 4411" },
  {
    date: "2026-09-12",
    city: "Boston, MA",
    venue: "Soul Fly Boston",
    address: "Cisco Brewers Seaport",
    with: "Jammy Buffett",
  },
  {
    date: "2026-09-16",
    city: "Athens, GA",
    venue: "Georgia Theatre Rooftop",
    address: "215 N Lumpkin St",
  },
  {
    date: "2026-09-17",
    city: "Atlanta, GA",
    venue: "Beta Theta Pi, Georgia Tech",
    with: "Congress the Band",
  },
  {
    date: "2026-09-19",
    city: "Charleston, SC",
    venue: "LoFi Brewing",
    address: "2038 Meeting Street Rd",
    tickets:
      "https://www.eventbrite.com/e/morrissey-blvd-with-jack-fortune-presented-by-stus-house-tickets-1998444476225",
  },
  {
    date: "2026-09-21",
    city: "Folly Beach, SC",
    venue: "Chico Feos",
    address: "122 E Ashley Ave",
  },
  {
    date: "2026-10-04",
    city: "Washington, DC",
    venue: "Pie Shop",
    address: "1339 H St NE",
    with: "The Takes",
    tickets: "https://app.opendate.io/e/the-takes-october-04-2026-695822#tickets",
  },
  {
    date: "2026-10-05",
    city: "Carrboro, NC",
    venue: "Cat's Cradle Back Room",
    address: "300 E Main St",
    with: "The Takes",
    tickets: "https://www.etix.com/ticket/p/60183770/the-takes-carrboro-cats-cradle-back-room",
  },
  {
    date: "2026-10-06",
    city: "Decatur, GA",
    venue: "Eddie's Attic",
    address: "515 N McDonough St",
    with: "The Takes",
    tickets:
      "https://dice.fm/partner/tickets/event/eombrw-the-takes-w-morrissey-blvd-7th-oct-eddies-attic-decatur-tickets",
  },
  { date: "2026-10-10", city: "Marshfield, MA" },
  {
    date: "2026-10-17",
    city: "Mansfield, CT",
    venue: "Mojo Connecticut Music Festival",
    address: "Mansfield Drive-In",
    tickets: "https://mojobrand.us/mojoconnecticut",
  },
];

export const releases = [
  {
    title: "Cabaret",
    cover: "/img/cover-cabaret.webp",
    embed: "https://open.spotify.com/embed/track/6T5eBxZHGePVGGUVUDFSSH",
  },
  {
    title: "Black Tea",
    cover: "/img/cover-black-tea.webp",
    embed: "https://open.spotify.com/embed/album/6xDZWNCYUwVtyLPoqaanqR",
  },
  {
    title: "The Woo Hoo Song",
    cover: "/img/cover-woohoo.webp",
    embed: "https://open.spotify.com/embed/album/4NBQf1y625lxrLuGk7S929",
  },
];

export const videos: { id: string; title: string; sub?: string }[] = [
  { id: "d31YiCxoc68", title: "Hypocrite", sub: "official live video" },
  { id: "O7uTkhfkGUo", title: "Live at Mojofest 2025", sub: "full concert" },
  { id: "IzXJzI3fu1I", title: "Black Tea", sub: "live at the Woodshed" },
  { id: "VspYf6jQxh0", title: "Mojofest 2025" },
];

// Drop originals into public/photos and list them here.
export const photos: { src: string; caption?: string; alt: string }[] = [
  { src: "/photos/van.jpg", alt: "The band loading the van at a campground" },
  { src: "/photos/hug-crowd.jpg", alt: "The band hugging on stage in front of the crowd" },
  { src: "/photos/bw-tent.jpg", alt: "Black and white shot of a packed tent singing along" },
  { src: "/photos/blanket.jpg", alt: "The three brothers sitting on a blanket in the grass" },
  { src: "/photos/lost-it-kitchen.jpg", caption: "lost it", alt: "Playing banjo, fiddle and guitar in a kitchen" },
  { src: "/photos/blue-stage.jpg", alt: "The band on stage under blue lights" },
  { src: "/photos/poster-mojo.jpg", caption: "Mojo!", alt: "Mojo Connecticut Music Festival poster" },
  { src: "/photos/bw-crowd.jpg", alt: "Black and white shot of a crowded bar show" },
  { src: "/photos/field-trio.jpg", alt: "The three brothers standing in an open field" },
  { src: "/photos/beachcomber.jpg", alt: "Singing at the Beachcomber under pink lights" },
  { src: "/photos/trio-pose.jpg", alt: "The three brothers posing barefoot" },
  { src: "/photos/bw-nasha.jpg", alt: "Black and white shot playing to a festival crowd" },
];

export const tourPoster = "/photos/poster-fall-2026.jpg";
export const artwork = "/photos/watercolor.jpg";

export const bio = [
  "Morrissey Blvd is three brothers from New Bedford, Massachusetts: Zan on lead vocals and guitar, Henri on bass and vocals, and Wilson on drums.",
  "It started as jamming over a school break and turned into a SouthCoast staple. The sound is soulful funk and R&B with the raw energy of rock and a little folk, somewhere between Stevie Wonder and Jack Johnson by way of Mt. Joy and Marcus King.",
  "The songs are about heartbreak, growing up and learning to let go. Along the way they've played benefit shows for causes like suicide prevention and the SouthCoast Cancer Center.",
];

export const shopDomain = "0mnfkj-hi.myshopify.com";
