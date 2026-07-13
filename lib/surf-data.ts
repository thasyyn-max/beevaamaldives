// Maldives surfing guide content.
// Parsed from the "Surffing" spreadsheet (surf spots, tips, season, maps).
// Self-contained so the /guide/surfing-spots page renders identically whether
// or not Supabase is configured. Images live in /public/surf.

export type SurfSpot = {
  name: string;
  /** Atoll / area label, when the source specifies one. */
  location?: string;
  description: string;
};

export type SurfRegion = {
  key: string;
  name: string;
  intro: string;
  /** Line-art map of the region's breaks, in /public/surf. */
  spotMap?: string;
  /** Boat/flight route map, in /public/surf. */
  routeMap?: string;
  /** Short travel-time summary shown beside the route map. */
  routeNote?: string;
  spots: SurfSpot[];
};

export type SeasonRow = { season: string; when: string; conditions: string };
export type SeasonDetail = { heading: string; body: string[] };
export type Fact = { label: string; value: string };
export type LegendItem = { label: string; description: string };

export const SURF_HERO = {
  eyebrow: "Explore · Surfing",
  title: "Surfing in the Maldives",
  image: "/import/banner/banner_image_003.jpg",
  intro:
    "Warm water, no wetsuits and short boat rides to uncrowded reef passes — the Maldives is a true surfing paradise. From world-class lefts and rights in the Malé Atolls to hidden gems in the far south and north, here is everything you need to plan the perfect surf trip: the breaks, the seasons and how to get there.",
};

export const SEASON_INTRO = {
  question: "When's the Maldives surf season?",
  answer:
    "The best surf season for the Malé Atolls runs from April to October, when consistent south swells and prevailing west to southwest winds create ideal conditions across the region. March and November are transition months, but they can deliver incredible waves with fewer crowds.",
};

export const SEASON_TABLE: SeasonRow[] = [
  {
    season: "Peak Season",
    when: "June – August",
    conditions: "Largest, most consistent swells. Perfect for advanced surfers.",
  },
  {
    season: "Shoulder Season",
    when: "March – April, Sept – Oct",
    conditions:
      "Playful, head-high waves. Lighter winds make for clean, glassy sessions.",
  },
  {
    season: "Off-Season",
    when: "Nov – February",
    conditions:
      "Smaller, mellow and more localized waves. Better for beginners or non-surfing partners.",
  },
];

export const SEASON_DETAILS: SeasonDetail[] = [
  {
    heading: "The Southwest Monsoon",
    body: [
      "The main Maldives surf season runs from April to October, when powerful storm systems in the southern Indian Ocean generate long-period southwest swells. These swells travel thousands of kilometres before reaching the outer reefs of the atolls, creating perfectly shaped walls and world-class waves across the reef passes.",
      "During this period, North Malé Atoll becomes a hub of surf activity as its famous reef breaks come alive with consistent swells. Early mornings often offer calm or lightly offshore conditions before afternoon sea breezes develop, and the Maldives' unique reef formations shape incoming swells into long, clean, user-friendly waves for surfers of all levels.",
    ],
  },
  {
    heading: "Peak Swell Months",
    body: [
      "While surf is possible throughout the April to October season, June, July and August typically deliver the most consistent swells. During this peak period, active Indian Ocean storm systems generate regular pulses of long-period swell, bringing the atolls to life with excellent surf conditions.",
      "This is when the Maldives showcases its most spectacular surf — long, clean lines sweeping into the reef passes, crystal-clear tropical waters and endless sessions as consistent swells continue to roll through.",
    ],
  },
  {
    heading: "Shoulder Seasons",
    body: [
      "March, April and November mark the transition periods between monsoon seasons. These months often bring lighter winds, fewer crowds and enjoyable conditions, although swell consistency can be more variable.",
      "When the right Indian Ocean swell arrives during these shoulder months, the Maldives can offer exceptional sessions with a relaxed atmosphere — an ideal window for those seeking the perfect balance of waves, adventure and island escape.",
    ],
  },
  {
    heading: "December to February",
    body: [
      "December through February typically brings smaller swells across the Maldives. While it is outside the main surf season, exposed reef passes can still receive quality waves, with the Southern Atolls offering the best chance of consistent surf during this period.",
      "For travellers combining surfing with an island getaway, this season offers calm seas, bright sunshine and crystal-clear waters — ideal for snorkeling, diving and exploring the Maldives' stunning lagoons between surf sessions.",
    ],
  },
];

export const SURF_REGIONS: SurfRegion[] = [
  {
    key: "male",
    name: "Malé Atolls",
    intro:
      "The Malé Atolls are the perfect destination for a surf adventure or family getaway. From luxury resorts with waves out front to surf charters with friends, the atolls offer unforgettable experiences for surfers and non-surfers alike. Home to iconic breaks like Chickens, Cokes, Lohis and Kandooma Right, the Malé Atolls are a true surfing paradise in the Maldives.",
    spotMap: "/surf/map-male-spots.png",
    routeMap: "/surf/route-male.jpg",
    routeNote:
      "Right off Velana (MLE) International Airport. Reef breaks are a 1.5–3.5 hour boat ride away, with quick transfers between North and South Malé.",
    spots: [
      {
        name: "Natives / Foxys",
        location: "South Malé",
        description:
          "This fast, hollow right-hander breaks over shallow coral, offering thrilling barrel sections for regular-foot surfers and skilled backhand riders. Best on a southeast swell with northwest winds, and conveniently located near Foxy's and Riptides, giving you access to multiple quality waves.",
      },
      {
        name: "Quarters",
        location: "South Malé",
        description:
          "Located at Gulhigaathuhuraa in South Malé Atoll, this fun right-hand wave features two sections — a mellow outside ideal for longboarders and beginners, and a faster inside offering clean barrel sections on the right swell. Best surfed with west to northwest winds.",
      },
      {
        name: "Kandooma Right",
        location: "South Malé",
        description:
          "Breaking just offshore from Kandooma Resort, this fast, powerful right-hander features two take-off zones and delivers long, hollow barrel sections, making it one of South Malé Atoll's premier surf breaks.",
      },
      {
        name: "Riptides",
        location: "South Malé",
        description:
          "A 150-metre right-hander breaking on a channel reef, Riptides offers long, carvable walls with occasional hollow sections. Suitable for longboarders, shortboarders and intermediates, it works best on south swells with southwest winds. Strong currents can occur, so conditions should always be checked before surfing.",
      },
      {
        name: "Tucky Joes / Boatyards",
        location: "South Malé",
        description:
          "A fickle yet powerful left-hander, this wave delivers a long, fast and intense ride with perfect sections for experienced surfers.",
      },
      {
        name: "Lohis",
        location: "North Malé",
        description:
          "A consistent, hollow left-hand break with two exciting sections, breaking directly in front of Hudhuranfushi Resort and offering fun, high-quality waves for experienced surfers.",
      },
      {
        name: "Honkys",
        location: "North Malé",
        description:
          "One of North Malé Atoll's most consistent and popular waves — a long, high-quality left-hander with workable walls and fast sections. Best surfed on solid south swells with west to north winds.",
      },
      {
        name: "Sultans",
        location: "North Malé",
        description:
          "Located off Thamburudhoo Island, Sultans is a long, consistent right-hand wave that performs best on bigger south swells. Known for its long walls and reliable shape, it rarely closes out and is best surfed at high tide with west to north winds.",
      },
      {
        name: "Jails",
        location: "North Malé",
        description:
          "Jails, located off Himmafushi Island, is a fun and forgiving right-hand reef break named after the island's former prison. With long, workable walls and fast sections for occasional barrels, it's one of the most popular waves in North Malé Atoll, often offering slightly smaller and more approachable surf than nearby Honkys.",
      },
      {
        name: "Ninjas",
        location: "North Malé",
        description:
          "Located in front of Club Med Resort in North Malé Atoll, Ninjas is a mellow right-hand wave ideal for beginners and longboarders. Best on moderate south swells with west to northwest winds, it can transform into a powerful and challenging break during larger southeast swells.",
      },
      {
        name: "Chickens",
        location: "North Malé",
        description:
          "Located on the eastern reef of North Malé Atoll, Chickens is a long, world-class left-hander with two exciting sections and a fast, peeling wall. Best surfed with northwest to north-northeast offshore winds, this iconic break is accessible only by boat and takes its name from the island's former poultry farm.",
      },
      {
        name: "Cokes",
        location: "North Malé",
        description:
          "Also located on the eastern reef of North Malé Atoll, Cokes is a short but powerful right-hand wave renowned for its steep take-off and hollow barrels. Its shallow inside section offers fast, exciting rides for experienced surfers.",
      },
    ],
  },
  {
    key: "central",
    name: "Central Atolls",
    intro:
      "The Central Atolls of the Maldives offer uncrowded waves, pristine barrels and a true island surf adventure. Located south of Malé, the Meemu, Thaa, Dhaalu and Laamu Atolls feature consistent reef breaks — including the world-class right-hander Ying Yang — with excellent surf charter and resort options to explore.",
    spotMap: "/surf/map-central-spots.jpg",
    routeMap: "/surf/route-central.jpg",
    routeNote:
      "Reached by a 40-minute domestic flight, or a roughly 10-hour boat cruise, from MLE Airport.",
    spots: [
      {
        name: "Ying Yang",
        location: "Laamu",
        description:
          "One of the area's most consistent waves, this break features a long inside section that produces incredibly hollow barrels and quality rides.",
      },
      {
        name: "Finnimas",
        location: "Thaa",
        description:
          "A fast, shallow left-hander that can fire in the right conditions, delivering powerful sections and impressive barrel opportunities.",
      },
      {
        name: "Veyvah",
        location: "Meemu",
        description:
          "A perfect left-hander with a long, open wall for turns and an easy take-off, making it ideal for low intermediates. Fun, forgiving and not too heavy, it can even offer barrel sections in the right conditions.",
      },
      {
        name: "Inside Mikados / Farms",
        location: "Thaa",
        description:
          "One of the Maldives' most playful waves, this quality break offers fun, consistent surf and protection from south and southwest winds. Hidden behind Kanimeedhoo Island, it provides a sheltered escape during less favourable conditions.",
      },
      {
        name: "Petrols",
        description:
          "One of the most picturesque breaks in the area, this short and punchy left-hand wedge offers exciting waves for intermediate and advanced surfers.",
      },
      {
        name: "Shoulders",
        description:
          "One of the few paddle-in, beginner-friendly waves in the Maldives, this perfect left-hander is an ideal spot to start your surfing journey.",
      },
      {
        name: "Sarongs",
        description:
          "A perfect hollow right-hander breaking directly in front of Maverick Resort, offering fast, clean barrels and quality waves for experienced surfers.",
      },
      {
        name: "You're Inside / F1",
        location: "Meemu",
        description:
          "A fast right-hander with long, hollow walls and barreling sections. Although it can get shallow, it offers an exciting ride with a safe channel finish.",
      },
      {
        name: "Mauroofs of Kasabu",
        location: "Dhaalu",
        description:
          "Located off Kudahuvadhoo Island, this right-hander performs best with light north to northwest winds and a solid southwest swell, offering quality waves in the right conditions.",
      },
      {
        name: "Machines",
        location: "Laamu",
        description:
          "One of the Maldives' most photogenic waves, this fast and winding hollow right-hander offers thrilling rides. Best surfed on an incoming tide, as lower tides can make it too shallow.",
      },
    ],
  },
  {
    key: "southern",
    name: "Southern Atolls",
    intro:
      "With a high concentration of world-class breaks, this region is best explored by boat charter. Beacons delivers powerful, Indonesian-style perfection, while waves like Five Islands, Blue Bowls and Love Charms offer more accessible surf. Hidden spots add to the adventure for surfers seeking new challenges.",
    spotMap: "/surf/map-southern-spots.png",
    routeMap: "/surf/route-southern.jpg",
    routeNote:
      "The far south, reached by a 60-minute domestic flight, or a roughly 25-hour boat cruise, from MLE Airport.",
    spots: [
      {
        name: "Beacons",
        description:
          "Known as one of the Maldives' most powerful waves, Beacons is a heavy right-hander with long, hollow barrels breaking over a shallow reef. With a straightforward take-off and a fast, intense inside section, it performs best on south to southwest swells with winds from the north.",
      },
      {
        name: "Five Islands",
        description:
          "Five Islands is a powerful right-hander with deep take-offs, fast walls and hollow inside sections over a shallow reef. It handles large swells well and delivers quality waves across all tides.",
      },
      {
        name: "Tiger Stripes",
        description:
          "Named after the striped reef grooves beneath it, Tigers is a powerful left-hander that comes alive on strong south swells. Featuring tricky take-offs, long fast walls and a hollow inside barrel section, it works best on all tides with south swells and northern winds.",
      },
      {
        name: "Antiques",
        description:
          "Located across the channel from Tigers, this fun right-hander offers softer, smaller waves in similar conditions. A small left can also form on the opposite side, peeling into the channel.",
      },
      {
        name: "Love Charms",
        description:
          "A series of reliable left-handers, Love Charms handles a wide range of swells and easterly winds. On a solid southwest groundswell, it transforms into a fast, powerful wave with barrel sections, earning comparisons to a Maldivian Cloudbreak.",
      },
      {
        name: "Blue Bowls",
        description:
          "Also known as Voodoos, Blue Bowls is a versatile, point-style right-hander tucked inside the pass between Castaways and Five Islands, offering protection from onshore winds. Reliable across all tides and best around 4–6 feet with westerly winds and southeast to southwest swells, it delivers long, playful sections — plus the chance to anchor nearby and experience local island life.",
      },
    ],
  },
  {
    key: "northern",
    name: "Northern Atolls",
    intro:
      "The Northern Atolls offer a true tropical paradise with pristine beaches, crystal-clear lagoons and vibrant coral reefs. Home to the UNESCO Biosphere Reserve of Baa Atoll, this region features quality lefts and rights, along with untouched and undiscovered waves best explored by boat charter.",
    routeMap: "/surf/route-northern.jpg",
    routeNote:
      "Reached by a 30-minute domestic flight, or a roughly 8-hour boat cruise, from MLE Airport.",
    spots: [
      {
        name: "Dharavandhoo Right",
        location: "Baa Atoll",
        description:
          "Located about 3 km south of Dharavandhoo, this is the closest surf break to the airport. A powerful right-hander, it works best on SSE swells with west to northeast or light variable winds. One of the heaviest regularly surfed waves in the atoll, it is suited for intermediate to advanced surfers only.",
      },
      {
        name: "Earthworm / Finolhu",
        location: "Baa Atoll",
        description:
          "A left-hander suited for intermediate to advanced surfers, featuring shifting peaks and a fast inside section. It requires a strong southwest swell with a period of 10 seconds or more to truly come alive.",
      },
      {
        name: "Kudathulhaadhoo",
        location: "Baa Atoll",
        description:
          "A well-hidden wave inside the atoll, this playful right-hander comes alive on large southwest swells with a period of 12 seconds or more.",
      },
      {
        name: "Kudadhdhoo",
        location: "Baa Atoll",
        description:
          "The standout wave of the region, this world-class left-hander performs best on SSE to SE swells with north to north-northeast winds.",
      },
    ],
  },
];

export const WAVE_CHART = {
  image: "/surf/wave-chart-legend.jpg",
  intro:
    "New to reading a surf forecast? Each row of a daily chart breaks the conditions down hour by hour. Here's what the numbers and arrows mean.",
  legend: [
    {
      label: "Wave Height",
      description: "The size of the surfable, breaking waves at the reef.",
    },
    {
      label: "Swell Height & Period",
      description:
        "Open-ocean swell size and the seconds between waves — longer periods (14s+) mean more powerful, cleaner surf.",
    },
    {
      label: "Direction",
      description: "Where the swell is travelling from, shown by the arrows.",
    },
    {
      label: "Tides",
      description:
        "The rise and fall of the water; many reef breaks favour a particular tide.",
    },
    {
      label: "Wind Strength & Direction",
      description:
        "Light or offshore winds keep waves clean; strong onshore winds mess them up.",
    },
  ] as LegendItem[],
};

export const TRAVEL_FACTS: Fact[] = [
  { label: "Time Zone", value: "UTC +5:00" },
  { label: "Currency", value: "USD widely accepted" },
  { label: "Calling Code", value: "+960" },
  { label: "Electricity", value: "230V" },
];

export const GOOD_TO_KNOW: { heading: string; body: string }[] = [
  {
    heading: "The Country",
    body: "The Maldives is a tropical nation of 1,192 coral islands grouped into atolls, stretching over 800 km across the Indian Ocean near the equator. Famous for palm-fringed islands, white sandy beaches, crystal-clear lagoons and vibrant coral reefs, it is the world's lowest-lying country, with an average elevation of just 1.5 metres above sea level.",
  },
  {
    heading: "Getting There",
    body: "Velana International Airport (MLE) in Malé is the main gateway, with excellent connections to hubs including London, Dubai, Bangkok, Hong Kong, Singapore and Kuala Lumpur. On arrival, our representative assists with your onward transfer — a domestic flight, surf charter boat or speedboat to your resort.",
  },
  {
    heading: "Attractions",
    body: "Beyond the surf, the Maldives offers world-class diving and snorkeling with manta rays, whale sharks, reef sharks and turtles, plus spa treatments, deep-sea fishing, yoga and dolphin cruises for the ultimate island escape.",
  },
];

export const SURF_OUTRO = {
  lead: "What makes the Maldives truly special is the perfect blend of world-class surf and tropical luxury.",
  body: "Warm waters mean no wetsuits are needed, while short boat rides provide easy access to uncrowded waves. As the southwest swells arrive across the Indian Ocean each year, the Maldives transforms into one of the world's most unforgettable surf destinations. Contact Beevaa Maldives to start planning your dream Maldives surf adventure.",
};
