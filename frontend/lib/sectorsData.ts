export interface SectorCapability {
  title: string;
  description: string;
  deliverables: string[];
  icon: string;
}

export interface SectorProject {
  title: string;
  location: string;
  year: string;
  status: string;
  description: string;
  imageUrl: string;
}

export interface SectorGalleryImage {
  url: string;
  caption: string;
  tag: string;
}

export interface SectorDetail {
  slug: string;
  title: string;
  badge: string;
  tagline: string;
  heroImage: string;
  keyStats: { value: string; label: string }[];
  overview: string;
  executiveQuote: {
    quote: string;
    author: string;
    role: string;
  };
  capabilities: SectorCapability[];
  gallery: SectorGalleryImage[];
  projects: SectorProject[];
  certifications: string[];
  inquiries: {
    primaryEmail: string;
    secondaryEmail: string;
    phone: string;
    headquarters: string;
  };
}

export const SECTORS_DATA: Record<string, SectorDetail> = {
  investments: {
    slug: 'investments',
    title: 'Investments & Capital',
    badge: 'Private Equity & Asset Management',
    tagline: 'Strategic Capital Allocation, Venture Growth, and High-Yield Institutional Asset Stewardship',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=75&auto=format&fit=crop',
    keyStats: [
      { value: '$350M+', label: 'Capital Under Advisory' },
      { value: '22+', label: 'Global Portfolio Assets' },
      { value: '18.4%', label: 'Net Internal Rate of Return' },
      { value: '6', label: 'International Markets' },
    ],
    overview:
      'Abyss Investments is the premier capital deployment and private equity arm of Abyss Holdings. We identify, structure, and scale high-conviction opportunities across infrastructure, renewable transition, emerging enterprise technology, and real asset portfolios. Backed by disciplined underwriting and extensive cross-industry operational expertise, we consistently deliver resilient, risk-adjusted returns to our global investment partners.',
    executiveQuote: {
      quote: 'Capital is most impactful when paired with visionary operational stewardship and unwavering corporate governance.',
      author: 'Executive Investment Committee',
      role: 'Abyss Holdings Group',
    },
    capabilities: [
      {
        title: 'Private Equity & Direct Growth Capital',
        description:
          'Taking strategic equity positions in high-performing mid-market enterprises poised for domestic leadership and international expansion.',
        deliverables: ['Majority buyout financing', 'Growth minority equity', 'Operational board representation', 'Global market scale-up'],
        icon: '💼',
      },
      {
        title: 'Structured Infrastructure & Debt Financing',
        description:
          'Designing tailored mezzanine, bridge, and senior debt facilities that unlock capital-intensive logistics, industrial plants, and utility developments.',
        deliverables: ['Custom mezzanine debt', 'Syndicated credit facilities', 'Asset-backed securitization', 'Refinancing advisory'],
        icon: '🏛️',
      },
      {
        title: 'Cross-Border M&A & Corporate Structuring',
        description:
          'Guiding complex mergers, acquisitions, and joint ventures across India, the GCC, and European markets with end-to-end transaction advisory.',
        deliverables: ['Buy-side / sell-side mandates', 'Cross-border valuation', 'Regulatory compliance', 'Post-merger integration'],
        icon: '🌐',
      },
      {
        title: 'ESG & Clean Transition Funds',
        description:
          'Dedicated capital allocations accelerating renewable energy microgrids, circular industrial processes, and carbon-reduction initiatives.',
        deliverables: ['Clean-tech venture seed', 'Green bond structuring', 'ESG impact reporting', 'Sustainable supply chains'],
        icon: '🌱',
      },
    ],
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=80',
        caption: 'Corporate financial towers housing international trading and investment desks',
        tag: 'Infrastructure',
      },
      {
        url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&q=80',
        caption: 'Strategic board review and capital allocation deliberation',
        tag: 'Governance',
      },
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=80',
        caption: 'Proprietary financial modeling and real-time portfolio performance tracking',
        tag: 'Analytics',
      },
      {
        url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80',
        caption: 'Executive meeting with institutional institutional co-investors',
        tag: 'Partnership',
      },
    ],
    projects: [
      {
        title: 'GreenHorizon Renewable Energy Fund',
        location: 'Mumbai & Gujarat, India',
        year: '2024 - Active',
        status: 'Strategic Portfolio',
        description:
          'A $65M direct capital deployment into utility-scale solar-wind hybrid projects powering industrial corridors with 100% green energy.',
        imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80',
      },
      {
        title: 'Apex Logistics & Cold Chain Facility',
        location: 'Bengaluru, India',
        year: '2023 - 2024',
        status: 'Completed',
        description:
          'Structured asset financing and equity partnership for a 450,000 sq.ft automated pharma-compliant cold storage terminal.',
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
      },
    ],
    certifications: ['SEBI Registered Investment Entity Framework', 'ISO 9001:2015 Quality Management', 'UN Principles for Responsible Investment (PRI) Standards'],
    inquiries: {
      primaryEmail: 'Admin@abyssholding.com',
      secondaryEmail: 'HR@abyssholding.com',
      phone: '+91 22 1234 5678',
      headquarters: 'Bandra Kurla Complex (BKC), Mumbai, India',
    },
  },

  construction: {
    slug: 'construction',
    title: 'Construction & Engineering',
    badge: 'Civil Engineering & Mega EPC Delivery',
    tagline: 'Engineering Landmark Mega-Structures, Urban Infrastructure, and Sustainable Civil Works',
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=1400&q=75&auto=format&fit=crop',
    keyStats: [
      { value: '12M+', label: 'Sq.Ft. Built & Commissioned' },
      { value: '45+', label: 'Flagship Mega Projects' },
      { value: 'Zero', label: 'Harm Safety Record (ISO 45001)' },
      { value: '99.2%', label: 'On-Schedule Milestone Delivery' },
    ],
    overview:
      'Abyss Construction is a tier-one engineering, procurement, and construction (EPC) powerhouse delivering transformative public infrastructure, commercial mega-complexes, industrial campuses, and specialized civil works. Combining state-of-the-art 5D BIM modeling, modular prefabrication, and rigorous environmental standards, we build durable foundations for modern civilization.',
    executiveQuote: {
      quote: 'We do not merely construct buildings; we engineer architectural landmarks that endure for generations with uncompromising structural integrity.',
      author: 'Chief Engineering Officer',
      role: 'Abyss Construction Division',
    },
    capabilities: [
      {
        title: 'Full Turnkey EPC Project Execution',
        description:
          'End-to-end engineering from architectural schematics, geotechnical soil validation, structural modeling, to complete handover.',
        deliverables: ['Detailed engineering designs', 'Global procurement sourcing', 'On-site general contracting', 'Turnkey commissioning'],
        icon: '🏗️',
      },
      {
        title: 'Commercial & High-Rise Structures',
        description:
          'Precision execution of high-density skyscraper towers, modern steel-frame headquarters, and complex mixed-use retail developments.',
        deliverables: ['High-tensile steel framing', 'Post-tensioned concrete slabs', 'Energy-efficient curtain facades', 'Intelligent building systems'],
        icon: '🏢',
      },
      {
        title: '5D BIM & Digital Twin Modeling',
        description:
          'Applying millimetric Building Information Modeling to run clash-detection, optimize material utilization, and predict maintenance schedules.',
        deliverables: ['Clash-free MEP design', 'Real-time cost & schedule tracking', 'Automated material supply chain', 'Lifecycle digital twin'],
        icon: '📐',
      },
      {
        title: 'LEED & Net-Zero Civil Engineering',
        description:
          'Pioneering sustainable construction utilizing green concrete formulations, solar integrated roofs, and greywater recycling networks.',
        deliverables: ['Platinum LEED compliance', 'Low-carbon concrete casting', 'Zero construction waste protocols', 'Solar-ready infrastructure'],
        icon: '🌿',
      },
    ],
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=1000&q=80',
        caption: 'Tower crane operations across large-scale commercial civil development',
        tag: 'Civil Works',
      },
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80',
        caption: 'Lead structural engineers conducting on-site digital blueprint audit',
        tag: 'Engineering',
      },
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&q=80',
        caption: 'Precision structural steel framework engineered for heavy seismic resilience',
        tag: 'Fabrication',
      },
      {
        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1000&q=80',
        caption: 'Acoustic and thermal performance glass facade on flagship commercial hub',
        tag: 'Facade Tech',
      },
    ],
    projects: [
      {
        title: 'Metropolis Corporate Center',
        location: 'Mumbai, Maharashtra',
        year: '2023 - 2024',
        status: 'Delivered',
        description:
          'A 1.4M sq.ft twin-tower commercial complex built with LEED Gold certification, smart elevators, and integrated seismic dampening.',
        imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
      },
      {
        title: 'Industrial Manufacturing Hub Alpha',
        location: 'Gujarat, India',
        year: '2024 - Active',
        status: 'Phase II in Progress',
        description:
          'Heavy industrial manufacturing park featuring 60-ton overhead crane runways, reinforced heavy slabs, and dedicated effluent treatment.',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
      },
    ],
    certifications: ['ISO 45001:2018 Occupational Health & Safety', 'ISO 14001 Environmental Management', 'Indian Green Building Council (IGBC) Platinum'],
    inquiries: {
      primaryEmail: 'Admin@abyssholding.com',
      secondaryEmail: 'HR@abyssholding.com',
      phone: '+91 22 1234 5678',
      headquarters: 'Mumbai Central Engineering Division, India',
    },
  },

  realities: {
    slug: 'realities',
    title: 'Realities & Urban Spaces',
    badge: 'Master Planning & Prime Real Estate',
    tagline: 'Designing Premier Residential Towers, Integrated Townships, and Iconic Commercial Destinations',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=75&auto=format&fit=crop',
    keyStats: [
      { value: '3,800+', label: 'Luxury Units Delivered' },
      { value: '8', label: 'Master Townships' },
      { value: '$1.4B+', label: 'Gross Development Value' },
      { value: '98.5%', label: 'Resident Satisfaction Rate' },
    ],
    overview:
      'Abyss Realities reshapes urban living through architecturally inspired residential communities, Grade-A corporate parks, and lifestyle retail districts. Every development embodies biophilic elegance, smart home connectivity, world-class recreational amenities, and sustainable landscaping, establishing benchmark addresses of lasting distinction.',
    executiveQuote: {
      quote: 'Great architecture elevates the human spirit. We curate spaces where comfort, community, and design harmony thrive in equal measure.',
      author: 'Head of Development',
      role: 'Abyss Realities Division',
    },
    capabilities: [
      {
        title: 'Luxury High-Rise Residences',
        description:
          'Ultra-exclusive high-rise residences with panoramic skylines, bespoke Italian finishes, expansive private verandas, and smart climate controls.',
        deliverables: ['Custom floor plans', 'Private infinity pools', 'Concierge & valet services', 'Acoustically isolated suites'],
        icon: '🏙️',
      },
      {
        title: 'Master-Planned Integrated Townships',
        description:
          'Self-contained gated ecosystems integrating educational institutions, healthcare clinics, retail high streets, and 40%+ open green spaces.',
        deliverables: ['Central landscape spine', 'Underground utility ducting', '24/7 smart security perimeters', 'Clubhouses & sporting zones'],
        icon: '🏡',
      },
      {
        title: 'Grade-A Commercial Workspaces',
        description:
          'Next-generation collaborative workspaces with high floor-to-ceiling heights, biophilic central atriums, and touchless smart building access.',
        deliverables: ['Large floor plates', 'Dual-redundant power backup', 'Wellness & fitness hubs', 'High-speed fiber backbones'],
        icon: '🏬',
      },
      {
        title: 'Asset Care & Facility Management',
        description:
          'Institutional-grade property management, predictive HVAC maintenance, and digital tenant service portals protecting lifetime asset appreciation.',
        deliverables: ['Automated rent & maintenance billing', 'IoT water & energy telemetry', 'White-glove housekeeping', '24/7 technical dispatch'],
        icon: '🛡️',
      },
    ],
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        caption: 'Luxury residential villa architecture featuring contemporary glass walls and lighting',
        tag: 'Residential',
      },
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80',
        caption: 'Landscaped private estate with infinity pool and outdoor entertainment verandas',
        tag: 'Estates',
      },
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80',
        caption: 'Signature corporate lobby with natural stone flooring and biophilic vertical gardens',
        tag: 'Commercial',
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80',
        caption: 'Interior living lounge showcasing bespoke architectural detailing and materials',
        tag: 'Interiors',
      },
    ],
    projects: [
      {
        title: 'The Azure Crest Residences',
        location: 'Bengaluru, India',
        year: '2023 - 2024',
        status: 'Handover Completed',
        description:
          'A 42-story luxury residential tower featuring 240 bespoke sky-villas, private club facilities, and an Olympic-length rooftop sky pool.',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      },
      {
        title: 'Abyss CyberPark Tech Hub',
        location: 'Hyderabad, India',
        year: '2024 - Active',
        status: 'Phase I Delivered',
        description:
          'A premier 1.8M sq.ft IT park hosting multinational tech leaders with IGBC Platinum rating and zero-discharge water recycling.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      },
    ],
    certifications: ['RERA Compliant Projects', 'ISO 9001:2015 Quality Real Estate Development', 'GRIHA 5-Star Green Rating'],
    inquiries: {
      primaryEmail: 'Admin@abyssholding.com',
      secondaryEmail: 'HR@abyssholding.com',
      phone: '+91 22 1234 5678',
      headquarters: 'Abyss Realities Corporate Tower, Mumbai, India',
    },
  },

  technologies: {
    slug: 'technologies',
    title: 'Technologies & Digital Systems',
    badge: 'Enterprise AI & Cloud Infrastructure',
    tagline: 'Enterprise Digital Transformation, Scalable Cloud Systems, Artificial Intelligence, and Zero-Trust Cybersecurity',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=75&auto=format&fit=crop',
    keyStats: [
      { value: '140+', label: 'Enterprise Deployments' },
      { value: '99.99%', label: 'Mission-Critical SLA Uptime' },
      { value: 'Tier IV', label: 'Certified Cloud Security' },
      { value: '24/7/365', label: 'Active SOC & NOC Defense' },
    ],
    overview:
      'Abyss Technologies builds and orchestrates mission-critical software architectures, generative AI platforms, hyperscale cloud systems, and cybersecurity solutions for global enterprises. We partner with leaders in finance, healthcare, manufacturing, and supply chain to turn raw data into strategic operational dominance.',
    executiveQuote: {
      quote: 'Modern competitiveness is measured by the speed and intelligence of an enterprise software backbone. We build systems that never fail.',
      author: 'Chief Technology Architect',
      role: 'Abyss Technologies Division',
    },
    capabilities: [
      {
        title: 'Enterprise AI & Cognitive Automation',
        description:
          'Custom LLM models, automated document processing, computer vision quality control, and predictive operations intelligence.',
        deliverables: ['Private on-premise AI clusters', 'Automated decision engines', 'Predictive maintenance algorithms', 'Voice & conversational AI'],
        icon: '🤖',
      },
      {
        title: 'Cloud Architecture & Multi-Cloud Scale',
        description:
          'Migrating, architecting, and optimizing microservices, Kubernetes clusters, and low-latency databases across hybrid cloud landscapes.',
        deliverables: ['AWS / Azure / GCP hybrid design', 'Zero-downtime database migration', 'Serverless microservice clusters', 'Cost governance automation'],
        icon: '☁️',
      },
      {
        title: 'Zero-Trust Cybersecurity & Defense',
        description:
          'Military-grade enterprise security, managed threat detection, continuous automated penetration testing, and sovereign compliance.',
        deliverables: ['Managed Security Operations Center', 'Identity & Access Management', 'DDoS mitigation pipelines', 'Data residency compliance'],
        icon: '🔒',
      },
      {
        title: 'Industrial IoT & Smart Connected Assets',
        description:
          'Connecting industrial fleets, manufacturing telemetry sensors, and building management systems into real-time operational cockpits.',
        deliverables: ['Edge gateway firmware', 'Low-latency telemetry streaming', 'Automated anomaly triggers', 'Equipment digital twins'],
        icon: '⚡',
      },
    ],
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&q=80',
        caption: 'High-density Tier IV server infrastructure with redundant fiber uplinks',
        tag: 'Datacenter',
      },
      {
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80',
        caption: 'Software engineering teams collaborating on real-time enterprise AI platforms',
        tag: 'Engineering',
      },
      {
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&q=80',
        caption: 'Continuous cybersecurity monitoring and automated packet inspection routines',
        tag: 'Cyber Defense',
      },
      {
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&q=80',
        caption: 'Operational telemetry dashboard review in client command center',
        tag: 'Analytics',
      },
    ],
    projects: [
      {
        title: 'FinEdge Core Banking Cloud Migration',
        location: 'Mumbai & Hyderabad, India',
        year: '2023 - 2024',
        status: 'Live & Operational',
        description:
          'Migrated 14 million active retail banking accounts onto a multi-region zero-downtime cloud architecture processing 4,000 TPS.',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
      },
      {
        title: 'Industrial IoT Telemetry Hub for Fleet Operations',
        location: 'Pan-India',
        year: '2024 - Active',
        status: 'Enterprise Scale',
        description:
          'Real-time edge sensor processing platform monitoring fuel efficiency, engine temperatures, and operator safety across 3,000 vehicles.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      },
    ],
    certifications: ['SOC 2 Type II Certified', 'ISO 27001 Information Security Management', 'HIPAA & GDPR Data Compliance Frameworks'],
    inquiries: {
      primaryEmail: 'Admin@abyssholding.com',
      secondaryEmail: 'HR@abyssholding.com',
      phone: '+91 22 1234 5678',
      headquarters: 'Abyss Technology Labs, Bengaluru & Hyderabad, India',
    },
  },

  automobiles: {
    slug: 'automobiles',
    title: 'Automobiles & Mobility',
    badge: 'Fleet Intelligence & Clean Mobility',
    tagline: 'Next-Generation Commercial Fleet Logistics, Electric Mobility Solutions, and Precision Vehicle Systems',
    heroImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1400&q=75&auto=format&fit=crop',
    keyStats: [
      { value: '4,500+', label: 'Active Commercial Fleets' },
      { value: '68%', label: 'Electric & Hybrid Composition' },
      { value: '18', label: 'Regional Service Centers' },
      { value: '99.8%', label: 'Fleet Reliability Rate' },
    ],
    overview:
      'Abyss Automobiles spearheads sustainable corporate mobility, commercial vehicle distribution, and state-of-the-art telemetry fleet solutions. From heavy-duty commercial transport and temperature-controlled logistics to zero-emission electric passenger fleets, we provide turnkey mobility ecosystems that lower operational expenditure and carbon footprint.',
    executiveQuote: {
      quote: 'The future of transportation is clean, connected, and deeply integrated with real-time operational telemetry.',
      author: 'Managing Director',
      role: 'Abyss Mobility Division',
    },
    capabilities: [
      {
        title: 'Turnkey Corporate & Commercial Fleet Leasing',
        description:
          'Comprehensive fleet provisioning for logistics companies, corporate conglomerates, and governmental agencies with complete maintenance.',
        deliverables: ['Custom vehicle configuration', 'Scheduled OEM servicing', 'Depreciation & tax optimization', 'Rapid replacement guarantees'],
        icon: '🚗',
      },
      {
        title: 'Electric Vehicle (EV) Transition & Charging Grids',
        description:
          'Guiding fleet owners from traditional internal combustion engines to fully electrified vehicles with fast-charging depot installations.',
        deliverables: ['DC fast charger infrastructure', 'Battery health management', 'Clean solar power integration', 'Total Cost of Ownership modeling'],
        icon: '⚡',
      },
      {
        title: 'Telemetry & Real-Time Fleet Intelligence',
        description:
          'Satellite GPS tracking, driver behavioral analytics, route efficiency algorithms, and predictive mechanical diagnostics.',
        deliverables: ['Automated fuel monitoring', 'Geofencing alerts', 'Driver safety scorecards', 'Real-time cargo temperature tracking'],
        icon: '📡',
      },
      {
        title: 'Authorized Overhaul & Specialized Body Building',
        description:
          'Certified fabrication of refrigerated pharma containers, armored executive protection vehicles, and specialized utility platforms.',
        deliverables: ['Pharma cold-chain certification', 'Ballistic armor engineering', 'Hydraulic tail-lift fabrication', 'Factory OEM parts backup'],
        icon: '🔧',
      },
    ],
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1000&q=80',
        caption: 'Modern luxury electric passenger vehicle on presentation display',
        tag: 'Clean Mobility',
      },
      {
        url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1000&q=80',
        caption: 'Precision automotive assembly line with robotic welding and component calibration',
        tag: 'Manufacturing',
      },
      {
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&q=80',
        caption: 'High-performance grand tourer engineered for highway aerodynamics and comfort',
        tag: 'Performance',
      },
      {
        url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1000&q=80',
        caption: 'State-of-the-art diagnostic service bay with computerized diagnostic rigs',
        tag: 'Maintenance',
      },
    ],
    projects: [
      {
        title: 'GreenTransit Commercial EV Fleet Delivery',
        location: 'Mumbai & Pune Corridor',
        year: '2023 - 2024',
        status: 'Operational',
        description:
          'Supplied and deployed 350 zero-emission electric delivery vans supported by 24 fast-charging hubs across western commercial routes.',
        imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
      },
      {
        title: 'Pan-India Corporate Executive Mobility',
        location: 'Bengaluru, Hyderabad & Mumbai',
        year: '2024 - Active',
        status: 'Long-Term Contract',
        description:
          'Managed 600+ executive hybrid sedans and luxury SUVs for multinational consulting and financial firms with 24/7 dedicated chauffeurs.',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      },
    ],
    certifications: ['ARAI Safety Compliant', 'ISO 9001:2015 Fleet Management Standards', 'Green Fleet Certification by Bureau of Energy Efficiency'],
    inquiries: {
      primaryEmail: 'Admin@abyssholding.com',
      secondaryEmail: 'HR@abyssholding.com',
      phone: '+91 22 1234 5678',
      headquarters: 'Automotive & Logistics Hub, Gujarat & Maharashtra, India',
    },
  },

  'earth-movers': {
    slug: 'earth-movers',
    title: 'Earth Movers & Heavy Machinery',
    badge: 'Heavy Earthwork & Quarrying Equipment',
    tagline: 'High-Tonnage Hydraulic Excavators, Mining Equipment, Terrain Grading, and Deep Infrastructure Fleets',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1400&q=75&auto=format&fit=crop',
    keyStats: [
      { value: '380+', label: 'Heavy Machinery Fleet Units' },
      { value: '28M+', label: 'Metric Tons Excavated' },
      { value: '24/7', label: 'Rapid Field Maintenance Service' },
      { value: '99.4%', label: 'Heavy Equipment Uptime Rate' },
    ],
    overview:
      'Abyss Earth Movers supplies the high-capacity muscle required for nation-building infrastructure. Our fleet includes heavy hydraulic excavators (up to 120 metric tons), articulated dumpers, vibratory soil compactors, high-reach demolition rigs, and GPS-guided motor graders. We support deep foundation digging, mining overburden clearance, expressway construction, and river canal works.',
    executiveQuote: {
      quote: 'When geological conditions present maximum resistance, our heavy machinery and veteran operators deliver relentless operational momentum.',
      author: 'Operations Director',
      role: 'Abyss Heavy Equipment Division',
    },
    capabilities: [
      {
        title: 'Heavy Equipment Dry & Wet Rental',
        description:
          'Flexible rental terms with certified master operators, fuel telemetry monitoring, and on-site containerized maintenance workshops.',
        deliverables: ['Custom project-tenure leasing', 'Zero-downtime replacement rigs', 'Operator safety training', 'Fuel consumption analytics'],
        icon: '🚜',
      },
      {
        title: 'High-Volume Quarrying & Mining Overburden',
        description:
          'Executing large-scale rock excavation, aggregate production, mineral loading, and continuous haulage across demanding topographies.',
        deliverables: ['Controlled blast rock handling', 'Heavy haulage logistics', 'Slope stabilization earthworks', 'Crushing plant feeding'],
        icon: '⛏️',
      },
      {
        title: 'GPS-Guided Grading & Terrain Levelling',
        description:
          'Laser and satellite 3D grade control systems installed directly on crawler dozers for millimeter-perfect highway and runway base layers.',
        deliverables: ['Sub-centimeter grading accuracy', 'Automated elevation sensors', 'Digital terrain cut-and-fill mapping', 'Compaction density verification'],
        icon: '🛰️',
      },
      {
        title: 'Specialized River Dredging & Coastal Protection',
        description:
          'Long-reach amphibious excavators engineered for waterway desilting, port breakwater boulder laying, and flood barrier reinforcement.',
        deliverables: ['Up to 24-meter arm reaches', 'Pontoons & barge mounting', 'Coastal revetment placement', 'Environmental silt barrier protocols'],
        icon: '🌊',
      },
    ],
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1000&q=80',
        caption: 'Heavy 75-ton hydraulic excavator breaking through granite strata in quarry project',
        tag: 'Excavation',
      },
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&q=80',
        caption: 'Industrial hydraulic cylinder calibration and maintenance in staging yard',
        tag: 'Hydraulics',
      },
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=1000&q=80',
        caption: 'Heavy machinery team orchestrating deep foundation work for high-speed expressway',
        tag: 'Expressway',
      },
      {
        url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1000&q=80',
        caption: 'On-site technical engineers performing mechanical diagnostic testing on crawler dozer',
        tag: 'Technical Care',
      },
    ],
    projects: [
      {
        title: 'Trans-Regional Expressway Earthworks Phase 3',
        location: 'Madhya Pradesh, India',
        year: '2023 - 2024',
        status: 'Delivered Ahead of Schedule',
        description:
          'Moved 4.2 million cubic meters of earth and rock base across an 82-kilometer greenfield expressway alignment using 45 heavy excavators.',
        imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&q=80',
      },
      {
        title: 'Riverfront Reclamation & Coastal Embankment',
        location: 'Gujarat Coastline, India',
        year: '2024 - Active',
        status: 'In Progress',
        description:
          'Deploying amphibious excavators and heavy rock dumpers to fortify 14 kilometers of industrial coastal revetment against tidal surges.',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80',
      },
    ],
    certifications: ['ISO 9001:2015 Heavy Machinery Operations', 'Directorate General of Mines Safety (DGMS) Certified', 'Rigorous Annual Mechanical Fitness Passports'],
    inquiries: {
      primaryEmail: 'Admin@abyssholding.com',
      secondaryEmail: 'HR@abyssholding.com',
      phone: '+91 22 1234 5678',
      headquarters: 'Central Heavy Equipment Yard, Madhya Pradesh & Gujarat, India',
    },
  },

  apparels: {
    slug: 'apparels',
    title: 'Apparels & Textile Manufacturing',
    badge: 'Textile Innovation & Global Export',
    tagline: 'Sustainable Garment Engineering, Precision Textile Innovation, and High-Volume Global Brand Supply',
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=75&auto=format&fit=crop',
    keyStats: [
      { value: '18M+', label: 'Garments Exported Annually' },
      { value: '100%', label: 'OEKO-TEX & GOTS Certified' },
      { value: '5', label: 'Modern Manufacturing Hubs' },
      { value: '14', label: 'Global Luxury & Retail Brands' },
    ],
    overview:
      'Abyss Apparels is a high-precision textile design, manufacturing, and export conglomerate. Partnering with top-tier international lifestyle and activewear brands, we weave ethical sustainability with cutting-edge textile technologies. Our zero-discharge facilities specialize in organic cottons, recycled performance polymers, and bespoke corporate attire.',
    executiveQuote: {
      quote: 'Garment manufacturing must harmonize aesthetic perfection with social responsibility and regenerative environmental practices.',
      author: 'Vice President of Textiles',
      role: 'Abyss Apparels Division',
    },
    capabilities: [
      {
        title: 'Sustainable Garment Manufacturing & Cut-and-Sew',
        description:
          'Fully automated computer-controlled cutting, laser seam sealing, and precision sewing lines delivering high-volume output with zero defect tolerances.',
        deliverables: ['Automated CAD marker cutting', 'Flatlock & bonded seam technology', 'Zero-waste fabric utilization', 'End-to-end carton packaging'],
        icon: '🧵',
      },
      {
        title: 'Technical & High-Performance Smart Fabrics',
        description:
          'Engineering specialized textiles with moisture-wicking capabilities, 4-way mechanical stretch, antimicrobial finishes, and UV defense.',
        deliverables: ['Athletic compression textiles', 'Thermal-regulating fabrics', 'Abrasion-resistant ripstop blends', 'Breathable waterproof membranes'],
        icon: '🎽',
      },
      {
        title: 'Eco-Friendly Dyeing & Zero Liquid Discharge',
        description:
          'Closed-loop water recycling plants that purify 98% of process water for reuse, powered by non-toxic organic dyes and natural botanical extracts.',
        deliverables: ['GOTS certified organic dyes', 'Zero Liquid Discharge (ZLD) plants', 'Low-temperature washing chemistry', 'Salt & chemical recovery loops'],
        icon: '💧',
      },
      {
        title: 'Bespoke Institutional & Corporate Uniform Programs',
        description:
          'Custom tailored collections for global airlines, luxury hotel chains, healthcare networks, and industrial workforce protection uniforms.',
        deliverables: ['Corporate brand styling', 'Flame-retardant industrial workwear', 'Personalized employee sizing portals', 'Global continuous restocking'],
        icon: '👔',
      },
    ],
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80',
        caption: 'Flagship modern apparel showroom displaying seasonal collection lines',
        tag: 'Showroom',
      },
      {
        url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&q=80',
        caption: 'Master textile designers developing fabric patterns and sustainable samples',
        tag: 'Design Atelier',
      },
      {
        url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1000&q=80',
        caption: 'Minimalist sustainable cotton collection manufactured for global export',
        tag: 'Eco Line',
      },
      {
        url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&q=80',
        caption: 'Precision woven textiles undergoing tensile strength and colorfastness validation',
        tag: 'Quality Control',
      },
    ],
    projects: [
      {
        title: 'EcoActive Global Sportswear Line',
        location: 'Trivandrum & Gujarat Facilities',
        year: '2023 - 2024',
        status: 'Exporting Worldwide',
        description:
          'Produced 3.6 million units of recycled ocean-plastic performance apparel for a leading European athletic apparel brand.',
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      },
      {
        title: 'Aviation & Hospitality Attire Programme',
        location: 'Pan-India & International',
        year: '2024 - Active',
        status: 'Exclusive Supplier',
        description:
          'Designed, engineered, and manufactured 85,000 sets of bespoke cabin crew and ground staff uniforms combining stain-resistance with wrinkle-free wool blends.',
        imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
      },
    ],
    certifications: ['Global Organic Textile Standard (GOTS)', 'OEKO-TEX Standard 100 Class I', 'WRAP (Worldwide Responsible Accredited Production) Platinum'],
    inquiries: {
      primaryEmail: 'Admin@abyssholding.com',
      secondaryEmail: 'HR@abyssholding.com',
      phone: '+91 22 1234 5678',
      headquarters: 'Textile Manufacturing & Export Center, Trivandrum & Gujarat, India',
    },
  },
};

export const ALL_SECTORS_LIST = Object.values(SECTORS_DATA);

export function getSectorBySlug(slug: string): SectorDetail | undefined {
  const normalized = slug.toLowerCase().trim();
  return SECTORS_DATA[normalized];
}

