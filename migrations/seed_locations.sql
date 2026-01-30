-- Seed file for bulk importing waterfowl hunting locations
-- Run with: pnpm wrangler d1 execute caducks-db --remote --file=migrations/seed_locations.sql

-- Public Lands: Sacramento Valley

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'LiCZ-UwaeaBzUT1099yp3',
  'Sacramento National Wildlife Refuge',
  'sacramento-nwr',
  'Federal refuge south of Willows featuring large open water ponds and dense tule patches. Type A area with reservation and lottery system.',
  '## Operational Profile

- **Acreage:** 10,819 total acres; approximately 4,000 acres open to hunting
- **Hunt Days:** Saturdays, Sundays, and Wednesdays during the balance of state season
- **Hunter Capacity:** Variable quota based on water availability; typically accommodates ~100-120 hunting parties

## Access & Selection Logistics

- **Reservation System:** Type A Area. Reservations issued via CDFW online drawing (applications due 17 days in advance)
- **Lottery (Sweat Line):** Non-reservation hunters must register in person the evening prior (6:00 PM – 8:00 PM) to receive a lottery number
- **Process:** Reservations are called first starting 2 hours before shoot time. Lottery numbers follow. Remaining vacancies are filled by a first-come, first-served list
- **Passes Required:** Federal Duck Stamp, CA Duck Validation, HIP Validation, Type A Daily or Season Pass

## Hunting Infrastructure

- **Blinds:** Designated spaced blind areas and assigned ponds
- **Free Roam:** Large designated free roam areas north of the check station. Tule density is high; cart or sled recommended
- **Accessibility:** Designated ADA blinds available. Mobility-impaired hunters with state placard have priority. Access to these blinds often permits ATV use (check current regs)

## Hunter Intelligence

- **Birds Taken:** Mallard, Pintail, Green-winged Teal, Snow Goose (late season)
- **Trailer/Camping:** Overnight camping permitted in the check station parking lot (self-contained vehicles only). No hookups
- **Lodging:** Nearest hotels in Willows (6 miles north)',
  39.4087,
  -122.1760,
  1,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'FO_91IH71P6fGe3ZIPeV7',
  'Delevan National Wildlife Refuge',
  'delevan-nwr',
  'Premier public shooting ground with flat topography and sheet water style ponds. Often rivals private clubs in bird-per-hunter averages.',
  '## Operational Profile

- **Acreage:** 5,797 total acres
- **Hunt Days:** Saturdays, Sundays, and Wednesdays
- **Hunter Capacity:** Strict quota; density is kept lower than Sacramento to ensure hunt quality

## Access & Selection Logistics

- **Reservation System:** Type A Area. Extremely high demand
- **Lottery:** In-person lottery held the evening prior
- **Entry:** Reservations called 2.5 hours before shoot time

## Hunting Infrastructure

- **Blinds:** Features in-ground concrete pit blinds and assigned ponds. Pit blinds require bailing after rains
- **Free Roam:** Limited free roam area separate from the spaced blind units
- **Accessibility:** Specific ADA blinds available; often located near parking lots for easier access

## Hunter Intelligence

- **Birds Taken:** High success rates for Mallard and Specklebelly (White-fronted) Geese
- **Trailer/Camping:** Overnight parking permitted. No fires
- **Logistics:** Check station located on Maxwell Road. Nearest services in Maxwell or Williams',
  39.3039,
  -122.1098,
  1,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  '1JkugZloRvptpaEfmXt0q',
  'Colusa National Wildlife Refuge',
  'colusa-nwr',
  'Smaller, intimate refuge famous for "The Pond" which consistently produces high harvest numbers. Also serves as critical sanctuary for endangered tule elk.',
  '## Operational Profile

- **Acreage:** 4,686 total acres; ~1,921 acres open to hunting
- **Hunt Days:** Saturdays, Sundays, and Wednesdays
- **Hunter Capacity:** Moderate quota; sweat line odds are generally better than Delevan

## Access & Selection Logistics

- **Reservation System:** Type A Area
- **Lottery:** Standard SNWRC lottery system

## Hunting Infrastructure

- **Blinds:** No pit blinds. Hunting is via Assigned Ponds or Free Roam
- **Free Roam:** East side of the refuge offers heavy cover and free roam access
- **Accessibility:** Designated ADA assigned ponds available

## Hunter Intelligence

- **Special Events:** Hosts an annual "Disabled Veteran Hunt" (usually early January) where the entire refuge is reserved for veterans
- **Birds Taken:** Wood Ducks frequent the riparian areas; Mallard and Teal in the ponds
- **Trailer/Camping:** Permitted in check station lot',
  39.1771,
  -122.0461,
  1,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'Lfxsd1ltVFBqu9dKJ4wBO',
  'Sutter National Wildlife Refuge',
  'sutter-nwr',
  'Located within the Sutter Bypass, offering exceptional mallard hunting in flooded riparian timber—a habitat type rare in California public lands.',
  '## Operational Profile

- **Acreage:** 2,591 acres
- **Hunt Days:** Saturdays, Sundays, and Wednesdays
- **Status Warning:** High Flood Risk. Refuge frequently closes when bypass water levels rise. Always verify status before travel.

## Access & Selection Logistics

- **Reservation System:** Type A Area
- **Lottery:** Standard lottery

## Hunting Infrastructure

- **Blinds:** Primarily free roam with limited assigned areas
- **Habitat:** Flooded riparian timber and dense tule sloughs

## Hunter Intelligence

- **Birds Taken:** Renowned for Mallards and Wood Ducks
- **Trailer/Camping:** Often restricted due to flood risk; verify with check station',
  39.0667,
  -121.7500,
  1,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'xXCS3J7b4sBpuvh9f3Nqr',
  'Gray Lodge Wildlife Area',
  'gray-lodge-wa',
  'Iconic 9,200-acre tract near the Sutter Buttes. One of the most heavily used wildlife areas in the state with high hunter capacity.',
  '## Operational Profile

- **Acreage:** ~9,200 acres
- **Hunt Days:** Saturdays, Sundays, and Wednesdays during waterfowl season
- **Hunter Capacity:** High capacity (300+ hunters); sweat line almost always gets everyone in eventually

## Access & Selection Logistics

- **Reservation System:** Type A Wildlife Area
- **Lottery:** Previous night lottery for non-reservation holders
- **Sweat Line:** Extensive sweat line; entry chances are generally good for afternoon hunts

## Hunting Infrastructure

- **Blinds:** Mostly Free Roam. Limited number of deer/turkey blinds used for waterfowl
- **Accessibility:** Seven (7) accessible hunting blinds available for mobility-impaired hunters
- **Habitat:** Extensive seasonal wetlands, deep ponds, and riparian woodlands

## Hunter Intelligence

- **Birds Taken:** Mixed bag; Mallard, Widgeon, Shoveler, Snow Goose
- **Trailer/Camping:** Allowed in the entrance check station parking lot on nights preceding waterfowl hunt days
- **Amenities:** Interpretive center, hiking trails (closed during hunt season). Nearest lodging in Gridley or Yuba City',
  39.3174,
  -121.8080,
  1,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'SlunGav28X7KW3wxStjO2',
  'Upper Butte Basin Wildlife Area (Little Dry Creek)',
  'upper-butte-basin-wa',
  'The crown jewel of the state system. Managed for quality over quantity with consistently highest bird-per-hunter averages.',
  '## Operational Profile

- **Unit:** Little Dry Creek (LDC)
- **Acreage:** Part of the ~9,300-acre Upper Butte Basin complex
- **Hunt Days:** Saturday, Sunday, Wednesday
- **Quality Rating:** Premier. Consistently highest bird-per-hunter averages in the state system

## Access & Selection Logistics

- **Reservation System:** Type A. Extremely low draw odds
- **Lottery:** Strict lottery system; very low sweat line capability (often 0-5 parties get on)

## Hunting Infrastructure

- **Blinds:** Assigned blinds and assigned fields
- **Accessibility:** ADA blinds available
- **Habitat:** Premium flooded rice and natural marsh managed intensively for waterfowl

## Hunter Intelligence

- **Birds Taken:** Mallard, Pintail, Specklebelly Goose
- **Trailer/Camping:** Permitted at check station lots',
  39.4333,
  -121.8833,
  1,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

-- Public Lands: Suisun Marsh

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'OszwnpCasp6J5qQqo5j5d',
  'Grizzly Island Wildlife Area',
  'grizzly-island-wa',
  'Massive sprawling complex in the Suisun Marsh. Unique for its resident Tule Elk herd and brackish water habitat.',
  '## Operational Profile

- **Acreage:** ~8,600 acres (Grizzly Island Unit)
- **Hunt Days:** Saturdays, Sundays, and Wednesdays
- **Hunter Capacity:** Type A area with specific quotas per unit
- **Elk Warning:** Tule Elk present; special draw hunts in Aug/Sept (area closed to other users)

## Access & Selection Logistics

- **Reservation System:** Type A pass required
- **Joice Island Unit:** Accessible for hunting via special draw or specific season dates (pig/duck)
- **Island Slough:** Type B area (Season pass required, no daily check-in usually required - check current regs)

## Hunting Infrastructure

### Blinds
- **Goodyear Slough:** 10 assigned blinds
- **West Family Unit:** 6 Junior-only blinds
- **Crescent Unit:** Free roam
- **Accessibility:** Mobility-impaired blinds available at two units
- **Boat Access:** Grey Goose Unit is boat-access only

## Hunter Intelligence

- **Birds Taken:** Teal, Spoonbill, Wigeon, Pintail. Mallards are fewer here than in the valley
- **Logistics:** Check Station at 2548 Grizzly Island Road, Suisun, CA. No amenities on site',
  38.1500,
  -121.9667,
  1,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

-- Public Lands: Delta & Yolo Bypass

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  '2S7_WYNMgu9qrPj4JuA27',
  'Yolo Bypass Wildlife Area',
  'yolo-bypass-wa',
  'Massive flood control channel with agricultural and wetland mosaic. Most accessible wildlife area for urban hunters in Sacramento and Davis.',
  '## Operational Profile

- **Acreage:** ~16,600 acres (Hunting area ~7,900 acres)
- **Hunt Days:** Saturday, Sunday, Wednesday
- **Hunter Capacity:** Large; subject to closure during flooding events

## Access & Selection Logistics

- **Reservation System:** Type A area
- **Lottery:** Check station lottery for non-reservation holders

### Blinds
- **Northeast Unit:** 16 assigned double pit blinds
- **Free Roam:** Extensive areas
- **Accessibility:** 2 designated DA blinds (capacity 3); 1 DA free roam area

## Hunter Intelligence

- **Birds Taken:** Widgeon, Teal, Mallard, Pintail
- **Logistics:** Check Station at 45211 County Road 32B, Davis, CA
- **Warning:** Floods frequently in winter. Check status daily',
  38.5539,
  -121.6190,
  1,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

-- Public Lands: San Joaquin Valley

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'HrWQ9ydCiIPD_SeOusjbo',
  'San Luis National Wildlife Refuge',
  'san-luis-nwr',
  'Part of the San Luis NWR Complex in the Grasslands. Features multiple units including Blue Goose and West Bear Creek.',
  '## Operational Profile

- **Units:** San Luis, Blue Goose, West Bear Creek
- **Hunt Days:** Saturday, Sunday, Wednesday
- **Regulations:** 25-shell limit strictly enforced in field

## Access & Selection Logistics

- **Reservation System:** Type A

### Blinds
- **Blue Goose Unit:** Features pit blinds and assigned zones
- **Freitas Unit:** Boat access only (no motor restrictions usually, check regs)
- **Accessibility:** ADA blinds available

## Hunter Intelligence

- **Birds Taken:** Teal, Spoonbill, Wigeon
- **Logistics:** Check Station on Wolfsen Road. Parking lot camping allowed (no hookups)',
  37.1265,
  -120.8258,
  1,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'TW3jSI9UrWSdI5xCabCFf',
  'Mendota Wildlife Area',
  'mendota-wa',
  'Massive state area serving the southern San Joaquin Valley. Famous for high hunter numbers and high bird counts.',
  '## Operational Profile

- **Acreage:** 11,800 acres
- **Hunt Days:** Saturday, Sunday, Wednesday
- **Capacity:** High capacity; popular for Southern CA hunters traveling north

## Access & Selection Logistics

- **Reservation System:** Type A
- **Lottery:** Sweat line is very active
- **Blinds:** Mostly free roam; 7 designated accessible blinds for mobility-impaired

## Hunter Intelligence

- **Birds Taken:** Teal, Pintail, Wigeon
- **Logistics:** Check Station on Whitesbridge Ave (Hwy 180). Camping allowed in checking station lot',
  36.6933,
  -120.3739,
  1,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

-- Public Lands: Southern California

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'M161-1s76-IOBlpW-ClVp',
  'Imperial Wildlife Area (Wister Unit)',
  'wister-unit-iwa',
  'Desert oasis near the Salton Sea. Unique cultural experience with excellent Snow Goose hunting in late season.',
  '## Operational Profile

- **Location:** Niland, CA (Salton Sea)
- **Acreage:** ~5,000+ huntable acres
- **Hunt Days:** Saturday, Sunday, Wednesday
- **Climate:** Desert wetland; temperatures can exceed 90°F early season

## Access & Selection Logistics

- **Reservation System:** Type A
- **Lottery:** Famous "Sweat Line" at the check station (Davis Rd)

### Blinds
- **Union Tract:** Goose pit blinds (Green feed)
- **Hazard Unit:** Ocean-like ponds
- **Standard:** Designated blind sites with 100-yard hunt radius

## Hunter Intelligence

- **Birds Taken:** Snow Geese (late season), Pintail, Teal
- **Logistics:** Check Station at 8700 Davis Rd, Niland, CA. Crude camping permitted',
  33.3075,
  -115.6145,
  1,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'KpXmWKIZAt2AANBZO7Yyc',
  'San Jacinto Wildlife Area',
  'san-jacinto-wa',
  'Southern California wildlife area near Lakeview with approximately 900 acres of wetlands.',
  '## Operational Profile

- **Location:** Lakeview, CA
- **Acreage:** ~19,000 total; ~900 acres wetlands
- **Hunt Days:** Saturday, Sunday, Wednesday
- **Hours:** Check station opens 3:00 AM

## Access & Selection Logistics

- **Reservation System:** Type A
- **Lottery:** 1:00 PM cutoff for filling vacancies
- **Blinds:** Mostly assigned sites (Blind/Pond numbers)
- **Accessibility:** Two designated mobility-impaired blinds

## Hunter Intelligence

- **Logistics:** Check Station at 17050 Davis Road. No camping on site
- **Rules:** 25-shell limit',
  33.8569,
  -117.1558,
  1,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

-- Private Clubs: Butte Sink & District 10

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'g4tCfYffbi1bnWE4D3l2-',
  'Live Oak Gun Club',
  'live-oak-gun-club',
  'Apex of the Butte Sink experience. Equity club with 1/15th ownership of over 1,700 acres. Traditional mallard-focused hunting.',
  '## Club Overview

- **Location:** Heart of the Butte Sink (Live Oak, CA)
- **Acreage:** 1,729 +/- Total Acres
- **Membership Structure:** 15 Equity Members (Owners)
- **Cost:** Recent share listing (1/15th interest) listed at $850,000. Cash terms typically required
- **Status:** Private/Equity

## Operational Logistics

- **Hunt Days:** Wednesdays, Saturdays, and Sundays (Marsh)
- **Afternoon Hunts:** Tuesdays and Fridays allowed in Rice Fields (~135 acres)
- **Harvest:** Renowned for having one of the highest mallard harvest totals in the Butte Sink
- **Habitat:** Natural marsh maintained year-round; 20-acre bass pond

## Amenities & Culture

- **Clubhouse:** Community clubhouse with chef-prepared meals during season
- **Lodging:** Membership includes leasehold interest for a private cabin lot within the compound
- **Facilities:** Rifle range, trap/five-stand range, helicopter pad
- **Guest Policy:** Typically restricted; verify bylaws',
  39.2757,
  -121.6591,
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'Ztpg-DdWPvRVqFqwMc9ha',
  'Wild Goose Club',
  'wild-goose-club',
  'Titan of the Butte Sink operating on fractional equity model. Premier duck, goose, and turkey hunting.',
  '## Club Overview

- **Location:** North Butte Road, Sutter County
- **Acreage:** ~1,455 acres
- **Membership:** Fractional ownership (e.g., 1/25th share)
- **Cost:** Recent listings around $900,000 - $1,000,000 for a share
- **Status:** Private/Equity

## Operational Logistics

- **Game:** Premier Duck, Goose, and Turkey hunting
- **Habitat:** Classic Butte Sink tupelo and marsh
- **Access:** Private gated entry on North Butte Road

## Amenities & Culture

- **Lodging:** Shared cabins (e.g., Cabin #5), large clubhouse
- **Staff:** Full-service staff for meals and bird processing',
  39.3000,
  -121.7000,
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'Zh3ZHagwxYIUkJKlRfwme',
  'Richmond Hunting Club',
  'richmond-hunting-club',
  'Non-profit membership club established in 1954. Commercial membership model making private land hunting accessible to middle-class hunters.',
  '## Club Overview

- **Location:** Maxwell, CA (Clubhouse). Leases properties from Able Road to Butte City
- **Type:** Non-profit membership club (Est. 1954)

### Cost Structure (2025-26)
- **Initiation:** $250 (one-time)
- **Annual Dues:** ~$1,100
- **Exclusive Blind Seat:** ~$1,300 per seat
- **Guest Pass:** ~$550 annual / $50 daily
- **Trailer Parking:** $550-$1,000/season

## Operational Logistics

- **Hunt Days:** 7 days a week (No reservations required for general members)

### Access Methodology
- **Exclusive Blinds:** Assigned for the season; member "owns" the seat
- **Dry Fields:** For pheasant/goose; assigned via drawing or first-come when owner absent
- **Game:** Ducks, Geese, Pheasant, Dove

## Amenities & Culture

- **Clubhouse:** Main clubhouse at Maxwell Rd
- **Camping:** Trailer parking with power/water hookups available
- **Vibe:** Family-oriented, working-man''s club, volunteer-managed',
  39.2720,
  -122.0910,
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'TCGBAU9HFhREz1tBNq_Ng',
  'Club Cazadero',
  'club-cazadero',
  'Small exclusive club in District 10 with 5 members and 238 acres. Mixed rice and natural marsh habitat.',
  '## Club Overview

- **Location:** Loma Rica Road, Yuba County (District 10)
- **Acreage:** ~238 Acres
- **Membership:** 5 Members total
- **Cost:** Shares (20% interest) listed around $175,000 - $195,000
- **Dues:** Annual assessments approx. $10k - $12k

## Operational Logistics

- **Hunt Days:** Wednesday, Saturday, Sunday, and Holidays
- **Wind Days:** Hunting allowed if wind exceeds 20mph
- **Guest Policy:** 1 guest per shoot day
- **Habitat:** Mixed rice and natural marsh; borders Saddleback Ranch

## Amenities

- **Clubhouse:** Shared facility with kitchen, dining, family room
- **Equipment:** Membership often includes share of ATVs (e.g., Kawasaki Mule)
- **Lodging:** RV/Trailer hookups available on site',
  39.2500,
  -121.4500,
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

-- Private Clubs: Suisun Marsh

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'Rz6sWb5x_fnP9vJ69PmKR',
  'The Teal Club',
  'teal-club',
  'Oldest Duck Club in California (Est. 1890s). Historic clubhouse originally built in SF shipyard in 1882.',
  '## Club Overview

- **History:** "Oldest Duck Club in California" (Est. 1890s)
- **Location:** 2925 Chadbourne Road, Suisun City, CA
- **Acreage:** ~510 Acres
- **Membership:** Equity membership
- **Cost:** Listing for club sale at $2.6M (Total); individual share prices vary

## Operational Logistics

- **Access:** Gated entry at end of Chadbourne Road
- **Habitat:** Natural brackish marsh
- **Game:** Pintail, Teal, Wigeon

## Amenities

- **Clubhouse:** Historic clubhouse (1882); originally built in SF shipyard
- **Facilities:** Picking sheds, decoy storage',
  38.1733,
  -122.0400,
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'hUFZA93VfV626gGDReIh0',
  'Volanti Duck Club',
  'volanti-duck-club',
  'Premium Suisun Marsh club with 21 double blinds and 11 private bungalows. Claims a 4+ bird average.',
  '## Club Overview

- **Location:** Grizzly Island Rd, Suisun Marsh
- **Acreage:** ~511 Acres
- **Ownership:** 100% Interest listed for $2,600,000
- **Performance:** Claims a 4+ bird average

## Operational Logistics

- **Blinds:** 21 double blinds, 1 platform blind
- **Access:** Boat access to blinds via extensive ditch system
- **Game:** Mallards, Sprig, Teal, Widgeon. Also offers Pig and Deer hunting

## Amenities

- **Clubhouse:** 2,100 sq ft furnished lodge with game room and bar
- **Lodging:** 11 private bungalows (some with private boat docks)
- **Caretaker:** On-site caretaker home (mobile)
- **Infrastructure:** Desalinization plant, tool garage, picking shack',
  38.1550,
  -122.0300,
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'zMdneqDfaFbSpAxvwIo_F',
  'Morrow Island Land Company (MILCO)',
  'morrow-island-land-co',
  'Established Suisun Marsh club with 16 equity members. Full-service clubhouse with caretakers providing meals on shoot days.',
  '## Club Overview

- **Location:** Suisun Marsh (Goodyear Slough area)
- **Acreage:** ~700 Acres managed marsh; 200-acre closed sanctuary
- **Membership:** 16 Equity Members
- **Cost:** Shares historically ~$80,000; Annual dues ~$8,000
- **Waitlist:** Active waitlist managed by club secretary

## Operational Logistics

- **Hunt Days:** Weekends and Wednesdays
- **Selection:** Blind draw before dawn on shoot days
- **Access:** Boat access to blinds

## Amenities

- **Clubhouse:** Full service with dining room, bar, card room
- **Services:** Caretakers provide dinner, breakfast, and lunch on shoot days
- **Lodging:** 10 bedrooms for members/guests
- **Recreation:** Trap range, fishing piers (Striped Bass/Sturgeon)',
  38.1200,
  -122.0800,
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'iHxzS7P-N2DeGBOvFHkog',
  'River Dog Duck Club',
  'river-dog-duck-club',
  'Annual lease model club on Van Sickle Island. ATV access to blinds (rare for marsh). Partners with CWA Veteran Hunt Program.',
  '## Club Overview

- **Location:** 1275 Grizzly Island Road, Suisun City (Van Sickle Island)
- **Acreage:** ~388 Acres
- **Membership:** Annual Lease model
- **Cost:** Leases start at $8,000 annually (No large buy-in)

## Operational Logistics

- **Blinds:** 15 two-man pit blinds; 11 shot per rotation
- **Access:** ATV access to blinds (rare for marsh)
- **Habitat:** Flooded from Roaring River; adjacent to Honker Bay

## Amenities

- **Clubhouse:** 3,800+ sq ft remodeled lodge with 7 private bedrooms
- **Facilities:** Dog kennels, wader room
- **Programs:** Partners with CWA Veteran Hunt Program',
  38.0950,
  -121.9500,
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

-- Private Clubs: Delta Islands

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  '4d3qZe6IrtQlMFGshOvXt',
  'McDonald Island Ranch',
  'mcdonald-island-ranch',
  'Delta property with 944 acres including wetlands and Cabernet vines. Duck hunting in flooded corn and timber.',
  '## Club Overview

- **Location:** 5555 Zuckerman Road, Stockton
- **Acreage:** 944 acres (480 cultivated, 112 wetland)
- **Value:** Property sold for ~$3.9M
- **Features:** 155 acres of Cabernet vines; Duck hunting in flooded corn/wetlands

## Operational Logistics

- **Location:** Adjacent to Mandeville and Medford Islands (Delta heartland)
- **Game:** Ducks (Mallards/Wood Ducks) in flooded timber/corn
- **Infrastructure:** Airstrip nearby, private access via Zuckerman Road

## Amenities

- **Clubhouse:** 4,450 sq ft, 8 bedrooms, 4 baths
- **Dock:** 150 ft dock on San Joaquin Channel',
  38.0144,
  -121.4500,
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  '-_Kb161UPZUk4XG1GQETF',
  'Venice Island Duck Club',
  'venice-island-duck-club',
  'Ultra-exclusive Delta property accessible only by ferry or helicopter. 12 permanent custom blinds with luxury 6,000 sq ft clubhouse.',
  '## Club Overview

- **Location:** 17500 West Eight Mile Road, Stockton
- **Acreage:** ~1,600 acres (1,200 farming, remainder habitat)
- **Cost:** Listed for $18,000,000 (Corporate retreat level)
- **Access:** Ferry boat or helicopter only

## Operational Logistics

- **Blinds:** 12 permanent custom duck blinds
- **Habitat:** Flooded corn and natural delta vegetation

## Amenities

- **Clubhouse:** 6,000 sq ft luxury facility; sauna, jacuzzi, commercial kitchen
- **Lodging:** 12 suites for members; separate guest house
- **Exclusivity:** Ultra-high. Corporate entertainment focus',
  38.0500,
  -121.5000,
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

-- Private Clubs: Grasslands

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'YzKKbCj19wKy3zY8SbCAM',
  'Sprig Haven Farms',
  'sprig-haven-farms',
  'South Grasslands club on Britto Road with 902 acres. Bordered by Stillbow Ranch and Pato Loco.',
  '## Club Overview

- **Location:** Britto Road, Los Banos (South Grasslands)
- **GWD ID:** S-30
- **Acreage:** 902 acres
- **Neighbors:** Bordered by Stillbow Ranch and Pato Loco

## Operational Logistics

- **Habitat:** Managed wetlands, swamp timothy, smartweed
- **Game:** Pintail (Sprig), Green-winged Teal

## Amenities

- Member compound, storage facilities',
  37.0500,
  -120.7500,
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);

INSERT INTO location (id, name, slug, description, content, latitude, longitude, is_public_land, verified_count, user_id, created_at, updated_at)
VALUES (
  'NQOiZk9RFQyqnPQld5-L0',
  'Los Banos Duck Club',
  'los-banos-duck-club',
  'Grasslands club with 201 acres and 14 double blinds. Claims 4.5-5 bird average with membership interests around $99,000.',
  '## Club Overview

- **Location:** Near Los Banos Refuge
- **GWD ID:** S-03
- **Acreage:** ~201 acres
- **Cost:** Membership interest listed around $99,000
- **Dues:** Annual assessment ~$3,000

## Operational Logistics

- **Blinds:** 14 double blinds (some stand-up)
- **Rotation:** Blind rotation system
- **Bird Avg:** Claims 4.5 - 5 birds

## Amenities

- Small cabins (400 sq ft) often included with share
- Electric/water on site',
  37.0600,
  -120.7600,
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
);
