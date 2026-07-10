// Maldives diving guide content.
// Parsed from the "Diving Spot" spreadsheet (dive sites, shipwrecks, attractions).
// Self-contained so the /guide/diving-spots page renders regardless of Supabase.

export type DiveSite = {
  name: string;
  location?: string;
  description: string;
  /** Dive-type tags, e.g. ["Drift", "Reef", "Wall"]. */
  types?: string[];
  /** How you get in: "Boat", "Shore", or "Boat & Shore". */
  entry?: string;
};

export type Wreck = {
  name: string;
  location?: string;
  description: string;
};

export type Attraction = {
  name: string;
  since: string;
  description: string;
};

export type Stat = { value: string; label: string };

export const DIVE_HERO = {
  eyebrow: "Explore · Diving",
  title: "Diving in the Maldives",
  image: "/import/banner/banner_image_005.jpg",
  intro:
    "Explore the top dive sites around the Maldives and experience crystal-clear water, colourful marine life and unforgettable underwater moments. From shark-filled channels and coral thilas to historic shipwrecks and UNESCO biosphere reserves, here is where to dive across the atolls.",
};

// Headline numbers (source: dive-site directory), shown as a small stat strip.
export const DIVE_STATS: Stat[] = [
  { value: "117", label: "Dive sites" },
  { value: "94", label: "Reef dives" },
  { value: "57", label: "Ocean dives" },
  { value: "47", label: "Drift dives" },
];

export const DIVE_SITES: DiveSite[] = [
  {
    name: "Rasdhoo Beyru",
    location: "North Ari Atoll",
    description:
      "Rasdhoo South Wall is a stunning dive site featuring three pinnacles surrounded by vibrant marine life. With regular sightings of Napoleon wrasse, white-tip and grey reef sharks, stingrays, and occasional eagle rays or manta rays, it offers an unforgettable experience for both wide-angle and macro enthusiasts.",
    types: ["Drift", "Pinnacle", "Reef", "Sandy bottom", "Wall", "Ocean"],
    entry: "Boat",
  },
  {
    name: "Kandooma Thila",
    location: "South Malé Atoll",
    description:
      "One of South Malé Atoll's most thrilling dive sites — a legendary teardrop-shaped pinnacle (also known as Cocoa Thila) famous for dramatic underwater scenery and big-fish action. Strong currents attract schools of bluefin trevally, eagle rays, dogtooth tuna and large groups of grey reef sharks, making it a true adventure dive for experienced divers.",
    types: ["Drift", "Pinnacle", "Reef", "Wall", "Channel", "Ocean"],
    entry: "Boat",
  },
  {
    name: "Tiger Port",
    location: "North Malé Atoll",
    description:
      "Tiger Port is a thrilling shark encounter site just 10 minutes from Malé, offering sightings of tiger sharks, bull sharks, hammerheads and spinner sharks. With experienced guides and proper safety procedures, it delivers an unforgettable big-shark diving adventure.",
    types: ["Reef", "Sandy bottom", "Channel", "Ocean"],
    entry: "Boat",
  },
  {
    name: "Miyaru Kandu",
    location: "Vaavu Atoll",
    description:
      "Miyaru Kandu is a protected channel dive known for dramatic caves, coral-covered rocks and rich marine life. Famous for grey reef shark encounters, vibrant soft corals and excellent underwater photography, it offers an unforgettable drift diving experience.",
    types: ["Drift"],
    entry: "Boat",
  },
  {
    name: "Maaya Thila",
    location: "North Ari Atoll",
    description:
      "Maaya Thila is a world-famous Marine Reserve, celebrated for its abundant marine life and breathtaking underwater scenery. With circling white-tip and grey reef sharks, colourful corals, caves, turtles and vibrant reef fish, it is a paradise for divers and underwater photographers.",
  },
  {
    name: "Rasdhoo Channel",
    location: "North Ari Atoll",
    description:
      "Rasdhoo Channel is an exhilarating advanced dive site featuring coral-covered pinnacles, strong currents and incredible marine encounters. Divers can spot stingrays, white-tip and grey reef sharks, eagle rays, manta rays and even hammerheads in the deep blue.",
    types: ["Drift", "Pinnacle", "Reef", "Sandy bottom", "Wall", "Channel", "Ocean"],
    entry: "Boat",
  },
  {
    name: "Veligandu East",
    location: "North Ari Atoll",
    description:
      "Just 20 minutes from Rasdhoo, this stunning reef slopes down to 30 metres, with massive coral blocks teeming with glassfish. Swim alongside friendly turtles and watch for eagle rays, mobulas, reef sharks and fascinating macro life like nudibranchs and scorpionfish. The shallows are filled with colourful anemones and playful clownfish — a must-dive for every ocean lover.",
    types: ["Drift", "Wall"],
    entry: "Boat",
  },
  {
    name: "Villingili Coral Garden",
    location: "Addu Atoll",
    description:
      "One of the Maldives' finest hard-coral reefs, this easy and relaxing dive site starts at 12 metres and gently slopes beyond 30 metres. With vibrant coral formations, calm conditions and a stunning underwater landscape, it's perfect for divers of all levels.",
    types: ["Ocean"],
    entry: "Boat",
  },
  {
    name: "Kottey Corner",
    location: "Addu Atoll",
    description:
      "Kottey Corner is a thrilling series of underwater plateaus with dramatic drop-offs and deep blue views. Famous for its exciting currents, it offers encounters with stingrays, white-tip reef sharks and breathtaking reef formations from shallow plateaus to the deep.",
    types: ["Drift", "Reef"],
    entry: "Boat",
  },
  {
    name: "Bathala Thila",
    location: "North Ari Atoll",
    description:
      "Bathala Thila is a beautiful reef just off Bathala Island, starting at 10 metres and bursting with colourful corals and marine life. Discover vibrant anemones, nudibranchs, schooling fish, resting nurse sharks, white-tip reef sharks and majestic Napoleon wrasse.",
    types: ["Drift", "Reef"],
    entry: "Boat",
  },
  {
    name: "Malé Caves",
    location: "South Malé Atoll",
    description:
      "A spectacular dive site on Malé's house reef, featuring vibrant soft corals, rich marine life and exciting encounters with passing pelagics brought in by the Vaadhoo Channel — a perfect blend of colourful reefs and big-fish action.",
    types: ["Cave", "Beach", "Reef", "Wall", "Ocean"],
    entry: "Shore",
  },
  {
    name: "Tiger Shark Dive Site",
    location: "Fuvahmulah (Gnaviyani)",
    description:
      "A thrilling 8-metre shallow dive where you settle on the sandy bottom and enjoy an unforgettable shark show up close — a unique and exciting underwater encounter.",
    types: ["Reef"],
    entry: "Boat",
  },
  {
    name: "Blue Hole",
    location: "Baa Atoll",
    description:
      "A stunning underwater chimney on the house reef of Amilla Maldives, offering breathtaking scenery and encounters with sharks, turtles and abundant tropical fish — a must-visit dive for unforgettable marine life.",
    types: ["Reef"],
    entry: "Boat",
  },
  {
    name: "Felidhoo House Reef",
    location: "Vaavu Atoll",
    description:
      "A breathtaking wall reef covered in vibrant hard and soft corals, offering a spectacular underwater landscape filled with colour, beauty and marine life.",
    types: ["Beach", "Reef", "Sandy bottom", "Wall", "Channel"],
    entry: "Boat & Shore",
  },
  {
    name: "Banana Reef",
    location: "North Malé Atoll",
    description:
      "Banana Reef, the Maldives' first protected dive site, is a legendary underwater wonder. With dramatic cliffs, vibrant corals and depths up to 30 metres, it offers encounters with snappers, Napoleon wrasse and reef sharks.",
  },
  {
    name: "Fotteyo Kandu",
    location: "Vaavu Atoll",
    description:
      "Fotteyo Kandu is a world-famous channel dive, featuring dramatic caves, vibrant yellow coral walls and thrilling encounters with hammerhead sharks, grey reef sharks and eagle rays — a spectacular advanced dive for true ocean explorers.",
    types: ["Channel", "Cave"],
    entry: "Boat",
  },
];

export const WRECKS_INTRO =
  "Discover the hidden side of the Maldives — where sunken ships become vibrant underwater habitats filled with life and colour.";

export const WRECKS: Wreck[] = [
  {
    name: "Hembadhoo Wreck",
    location: "North Malé Atoll",
    description:
      "A purpose-sunk 16-metre cargo ship resting at 15–25 metres, now a vibrant artificial reef draped in soft and black corals. Home to moray eels, lionfish, stingrays, Napoleon wrasse, reef sharks and colourful reef fish, with pink anemones on the surrounding reef — and an exceptional night dive.",
  },
  {
    name: "Kudhima Wreck",
    location: "South Ari Atoll",
    description:
      "A purpose-sunk 50-metre cargo ship transformed into a vibrant artificial reef since 1998. Resting between 12 and 30 metres, it offers exciting wreck exploration, colourful corals, sponges and abundant reef life — with occasional strong currents, making it a favourite for adventurous intermediate divers.",
  },
  {
    name: "Maldives Victory Wreck",
    location: "Hulhulé Reef",
    description:
      "An 83-metre cargo ship and National Heritage site resting upright at 35 metres. A legendary dive destination, it offers advanced divers a thrilling wreck experience surrounded by rich marine life.",
  },
  {
    name: "British Loyalty",
    location: "Addu Atoll",
    description:
      "The Maldives' largest shipwreck — a 140-metre oil tanker resting at 33 metres in Addu Atoll. Once a World War II survivor, it now serves as a protected marine sanctuary teeming with fascinating history and marine life.",
  },
  {
    name: "Machchafushi Wreck",
    location: "South Ari Atoll",
    description:
      "A 52-metre Japanese cargo ship transformed into a vibrant artificial reef. Resting upright at 30 metres, it offers exciting wreck exploration, safe penetration and encounters with abundant marine life.",
  },
  {
    name: "Halaveli Wreck",
    location: "North Ari Atoll",
    description:
      "A 40-metre cargo ship resting at 28 metres, now thriving as a vibrant artificial reef. Famous for stingrays, moray eels, colourful corals and easy exploration, it's a favourite for divers and underwater photographers.",
  },
  {
    name: "Rannamaari Shipwreck",
    location: "North Malé Atoll",
    description:
      "A former sand dredger resting at 30 metres, transformed into a thriving marine sanctuary. With vibrant coral growth, sharks, giant moray eels and incredible photo opportunities, it's a must-visit wreck dive.",
  },
];

export const SHIPWRECK_HERO = {
  eyebrow: "Explore · Shipwrecks",
  title: "Historic shipwrecks",
  image: "/import/banner/banner_image_004.jpg",
  intro:
    "Discover the hidden side of the Maldives — where sunken ships become vibrant underwater habitats filled with life and colour. From purpose-sunk cargo ships to a Second World War oil tanker, these wrecks are now some of the atolls' richest artificial reefs.",
};

export const SHIPWRECK_OUTRO = {
  lead: "Ready to explore the wrecks?",
  body: "From beginner-friendly artificial reefs to advanced deep-water penetration dives, we'll match the wreck, season and liveaboard or resort to your experience level. Tell us what you want to explore and we'll build the trip around it.",
};

export const ATTRACTIONS_INTRO =
  "Three of the Maldives' atolls carry UNESCO Biosphere Reserve status — living laboratories of marine conservation and some of the richest waters you can dive.";

export const ATTRACTIONS: Attraction[] = [
  {
    name: "Baa Atoll",
    since: "UNESCO since 2011",
    description:
      "Internationally renowned for its rich marine ecosystems and iconic manta ray and sea turtle gatherings at Hanifaru Bay — a globally significant destination for marine conservation and sustainable ecotourism.",
  },
  {
    name: "Addu Atoll",
    since: "UNESCO since 2021",
    description:
      "A symbol of conservation in the southern Maldives. Its rich ecosystems, vibrant wetlands and strong community involvement make it a benchmark for sustainable ecotourism and environmental stewardship.",
  },
  {
    name: "Fuvahmulah",
    since: "UNESCO since 2021",
    description:
      "Recognised for its unique ecosystem and exceptional marine life. Renowned for its tiger shark encounters, the island is a premier destination for researchers, divers and ecotourists.",
  },
];

export const DIVE_OUTRO = {
  lead: "Ready to explore beneath the surface?",
  body: "From your first reef dive to advanced channels and historic wrecks, we'll match the sites, season and liveaboard or resort to your experience level. Tell us what you want to see — sharks, mantas, wrecks or coral gardens — and we'll build the trip around it.",
};
