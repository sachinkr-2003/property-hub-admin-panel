// Comprehensive Dataset matching the AdminPanel Architecture Poster

export const mockDashboardMetrics = {
  totalUsers: 8420,
  usersChange: "+18.4% this month",
  totalProperties: 1248,
  propertiesChange: "+14.2% this month",
  pendingVerifications: 19,
  pendingKyc: 11,
  pendingProperties: 8,
  revenueSummary: 485200,
  revenueChange: "+22.4% vs last month",
  activeSubscriptions: 436,
  fraudAlertsBlocked: 14,
  duplicateListingsFlagged: 6,
};

// 10 Earning Models from Poster
export const earningModels = [
  { id: 1, name: "Property Listing Charges", rate: "₹99 - ₹299", unit: "per listing", mtdRevenue: 124500, activeTransactions: 512, status: "Active" },
  { id: 2, name: "Featured Property", rate: "₹199 - ₹999", unit: "per boost", mtdRevenue: 89400, activeTransactions: 198, status: "Active" },
  { id: 3, name: "Owner Premium Subscription", rate: "₹299 / ₹599 / ₹999", unit: "monthly recurring", mtdRevenue: 145000, activeTransactions: 219, status: "Active" },
  { id: 4, name: "Verification Fee (KYC / Deed)", rate: "₹99 - ₹499", unit: "per verification", mtdRevenue: 34200, activeTransactions: 88, status: "Active" },
  { id: 5, name: "Promoted Used Item Listing", rate: "₹49 - ₹199", unit: "per item", mtdRevenue: 12800, activeTransactions: 142, status: "Active" },
  { id: 6, name: "Service Provider Subscription", rate: "₹299 / ₹599 / ₹999", unit: "monthly", mtdRevenue: 38500, activeTransactions: 45, status: "Active" },
  { id: 7, name: "Service Lead / Booking Fee", rate: "5% - 15%", unit: "commission take-rate", mtdRevenue: 28900, activeTransactions: 360, status: "Active" },
  { id: 8, name: "Advertisement & Banners", rate: "Sponsored Listing", unit: "flat campaign", mtdRevenue: 15000, activeTransactions: 4, status: "Active" },
  { id: 9, name: "Payment Gateway Commission", rate: "1% - 3%", unit: "per transaction", mtdRevenue: 7800, activeTransactions: 1240, status: "Active" },
  { id: 10, name: "Refund / Processing Fee", rate: "As per policy", unit: "on cancellation", mtdRevenue: 3100, activeTransactions: 18, status: "Active" },
];

// Users
export const initialUsers = [
  {
    id: "USR-101",
    name: "Aditya Verma",
    email: "aditya.verma@tcs.com",
    mobile: "+91 98890 23119",
    role: "Tenant / Bachelor",
    profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    city: "Lucknow",
    locality: "Gomti Nagar",
    status: "Active",
    createdAt: "2026-08-14",
    reportsCount: 0,
    enquiriesSent: 12,
  },
  {
    id: "USR-102",
    name: "Pooja Sharma",
    email: "pooja.sharma@gmail.com",
    mobile: "+91 96500 88219",
    role: "Tenant / Roommate",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    city: "Lucknow",
    locality: "Aliganj",
    status: "Active",
    createdAt: "2026-07-22",
    reportsCount: 0,
    enquiriesSent: 5,
  },
  {
    id: "USR-103",
    name: "Zaid Khan",
    email: "zaid.design@gmail.com",
    mobile: "+91 91234 56780",
    role: "Tenant / Bachelor",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    city: "Lucknow",
    locality: "Hazratganj",
    status: "Active",
    createdAt: "2026-09-01",
    reportsCount: 0,
    enquiriesSent: 8,
  },
  {
    id: "USR-104",
    name: "Dr. Shalini Tandon",
    email: "dr.shalini@apollo.com",
    mobile: "+91 94500 12890",
    role: "Family Tenant",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    city: "Lucknow",
    locality: "Indira Nagar",
    status: "Active",
    createdAt: "2026-05-18",
    reportsCount: 0,
    enquiriesSent: 3,
  },
  {
    id: "USR-105",
    name: "Mohit Aggarwal",
    email: "mohit.fake99@tempmail.com",
    mobile: "+91 91999 00112",
    role: "Tenant / Suspended",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    city: "Lucknow",
    locality: "Charbagh",
    status: "Suspended",
    createdAt: "2026-09-12",
    reportsCount: 4,
    enquiriesSent: 28,
  }
];

// User Abuse Reports
export const initialUserReports = [
  {
    id: "REP-U01",
    reportedUserName: "Mohit Aggarwal (USR-105)",
    reportedBy: "Vikramaditya Roy (Owner)",
    reason: "Fake identity & spamming contact requests",
    details: "User sent multiple messages asking for owner direct bank transfer without scheduling visit.",
    date: "2026-09-28",
    status: "Action Taken (User Suspended)"
  },
  {
    id: "REP-U02",
    reportedUserName: "Unknown Visitor (+91 90001 22331)",
    reportedBy: "Pooja Sharma (Roommate)",
    reason: "Inappropriate communication in chat",
    details: "Unverified profile made inappropriate comments during flatmate inquiry.",
    date: "2026-09-29",
    status: "Under Investigation"
  }
];

// Owners
export const initialOwners = [
  {
    id: "OWN-501",
    name: "Vikramaditya Roy",
    email: "vikram.roy@outlook.com",
    mobile: "+91 98390 12845",
    role: "Direct Owner",
    kycStatus: "Verified",
    verificationStatus: "Approved",
    documents: {
      aadhaar: "4521-8890-3412",
      pan: "ACUPR3498L",
      registry: "LDA Approved Sale Deed #1084/2019"
    },
    propertiesCount: 3,
    subscriptionPlan: "100% Free Lifetime",
    status: "Active",
    verifiedAt: "2026-09-28",
    createdAt: "2026-01-10",
  },
  {
    id: "OWN-502",
    name: "Ananya Deshmukh",
    email: "ananya.d@gmail.com",
    mobile: "+91 97112 44321",
    role: "Direct Owner",
    kycStatus: "Verified",
    verificationStatus: "Approved",
    documents: {
      aadhaar: "3312-9901-2244",
      pan: "BKUPD8821M",
      registry: "Nagar Nigam Tax Receipt 2025-26"
    },
    propertiesCount: 2,
    subscriptionPlan: "100% Free Lifetime",
    status: "Active",
    verifiedAt: "2026-09-20",
    createdAt: "2026-02-15",
  },
  {
    id: "OWN-503",
    name: "Raghav Mehra",
    email: "raghav.mehra@gmail.com",
    mobile: "+91 88401 99210",
    role: "Direct Owner",
    kycStatus: "Pending",
    verificationStatus: "Under Review",
    documents: {
      aadhaar: "7821-4490-1923",
      pan: "AMYPM4910K",
      registry: "Municipal House Tax Receipt #889"
    },
    propertiesCount: 1,
    subscriptionPlan: "100% Free Lifetime",
    status: "Active",
    verifiedAt: null,
    createdAt: "2026-09-29",
  },
  {
    id: "OWN-504",
    name: "Mohd. Shakeel",
    email: "shakeel.prop@yahoo.com",
    mobile: "+91 87654 32109",
    role: "Direct Owner",
    kycStatus: "Pending",
    verificationStatus: "Under Review",
    documents: {
      aadhaar: "9102-3341-8874",
      pan: "BSDPS1122N",
      registry: "Electricity Bill (Consumer #88712)"
    },
    propertiesCount: 1,
    subscriptionPlan: "100% Free Lifetime",
    status: "Active",
    verifiedAt: null,
    createdAt: "2026-09-30",
  },
  {
    id: "OWN-505",
    name: "Sanjay Dixit",
    email: "dixit.estates@gmail.com",
    mobile: "+91 93351 00291",
    role: "Broker / Unauthorized",
    kycStatus: "Rejected",
    verificationStatus: "Rejected",
    documents: {
      aadhaar: "1234-9988-7711",
      pan: "BKXPD9012K",
      registry: "Invalid Power of Attorney"
    },
    propertiesCount: 6,
    subscriptionPlan: "100% Free Lifetime (Blocked)",
    status: "Blocked",
    verifiedAt: null,
    createdAt: "2026-01-20",
  }
];

// Owner KYC Approval & Rejection Decisions Log
export const initialKycLogs = [
  { id: "KYC-LOG-01", ownerName: "Vikramaditya Roy", date: "2026-09-28", decision: "Approved", admin: "Priya Narang", notes: "Aadhaar UID and LDA Sale Deed cross-verified." },
  { id: "KYC-LOG-02", ownerName: "Ananya Deshmukh", date: "2026-09-20", decision: "Approved", admin: "Priya Narang", notes: "Nagar Nigam house tax validated." },
  { id: "KYC-LOG-03", ownerName: "Sanjay Dixit", date: "2026-09-22", decision: "Rejected", admin: "Aarav Singhania", notes: "Broker attempting to register third party residential plot without owner authorization." }
];

// Properties
export const initialProperties = [
  {
    id: "PROP-1001",
    title: "Luxury 3 BHK High-Rise Apartment with Balcony View",
    type: "Flat",
    listingType: "Rent",
    price: 32000,
    priceUnit: "/month",
    deposit: 64000,
    bhk: 3,
    areaSqFt: 1850,
    address: "Tower 4, Shalimar Grand Residences, Gomti Nagar",
    locality: "Gomti Nagar Extension",
    city: "Lucknow",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80"
    ],
    isVerified: true,
    isFeatured: true,
    isDuplicate: false,
    ownerName: "Vikramaditya Roy",
    ownerPhone: "+91 98390 12845",
    ownerRole: "Direct Owner",
    amenities: ["Gated Security", "Swimming Pool", "Car Parking", "Power Backup", "Gym"],
    furnishing: "Fully Furnished",
    targetTenant: "Family & Working Professionals",
    description: "Premium sunlit apartment on 14th floor with Italian marble flooring, modular kitchen, dedicated covered parking and 24x7 power backup.",
    postedAt: "2026-09-28",
    status: "Active",
    reportsCount: 0,
    deedDocument: "LDA Registry #1084/2019 (Verified)"
  },
  {
    id: "PROP-1002",
    title: "Cozy 2 BHK Independent Villa with Private Garden",
    type: "House",
    listingType: "Rent",
    price: 24000,
    priceUnit: "/month",
    deposit: 48000,
    bhk: 2,
    areaSqFt: 1400,
    address: "Lane 5, Indira Nagar Block B",
    locality: "Indira Nagar",
    city: "Lucknow",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80"
    ],
    isVerified: true,
    isFeatured: false,
    isDuplicate: false,
    ownerName: "Ananya Deshmukh",
    ownerPhone: "+91 97112 44321",
    ownerRole: "Direct Owner",
    amenities: ["Private Garden", "Dedicated Parking", "RO Water", "CCTV", "Inverter"],
    furnishing: "Semi-Furnished",
    targetTenant: "Family Only",
    description: "Serene ground floor independent villa with ample green space, peaceful neighborhood, close to metro station.",
    postedAt: "2026-09-27",
    status: "Active",
    reportsCount: 0,
    deedDocument: "Nagar Nigam Tax Bill 2025-26 (Verified)"
  },
  {
    id: "PROP-1003",
    title: "Executive Single Occupancy AC PG for Professionals",
    type: "PG",
    listingType: "Rent",
    price: 9500,
    priceUnit: "/month",
    deposit: 9500,
    bhk: 1,
    areaSqFt: 280,
    address: "Near Wave Mall, Vibhuti Khand",
    locality: "Vibhuti Khand",
    city: "Lucknow",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80"
    ],
    isVerified: false,
    isFeatured: false,
    isDuplicate: false,
    ownerName: "Raghav Mehra",
    ownerPhone: "+91 88401 99210",
    ownerRole: "Direct Owner",
    amenities: ["High-speed WiFi", "3 Meals Included", "AC", "Housekeeping", "Laundry"],
    furnishing: "Fully Furnished",
    targetTenant: "Bachelors & Working Pros",
    description: "Modern co-living space with single occupancy rooms. Includes hygienic home-cooked meals, daily housekeeping and 100Mbps Wi-Fi.",
    postedAt: "2026-09-29",
    status: "Pending Verification",
    reportsCount: 0,
    deedDocument: "Municipal Tax Receipt #889 (Under Review)"
  },
  {
    id: "PROP-1004",
    title: "Prime Commercial Showroom / Office Space",
    type: "Office",
    listingType: "Rent",
    price: 75000,
    priceUnit: "/month",
    deposit: 225000,
    bhk: 0,
    areaSqFt: 2200,
    address: "Main Road, Hazratganj Commercial Complex",
    locality: "Hazratganj",
    city: "Lucknow",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80"
    ],
    isVerified: true,
    isFeatured: true,
    isDuplicate: false,
    ownerName: "Harshvardhan Kapoor",
    ownerPhone: "+91 94150 78652",
    ownerRole: "Commercial Owner",
    amenities: ["Lift", "Fire Safety", "Central AC", "Ample Visitor Parking"],
    furnishing: "Unfurnished",
    targetTenant: "Corporate / Retail",
    description: "High footfall commercial space suitable for bank branch, IT firm, clinic or retail brand showroom.",
    postedAt: "2026-09-25",
    status: "Active",
    reportsCount: 0,
    deedDocument: "LDA Commercial Sanction Deed #2015 (Verified)"
  },
  {
    id: "PROP-1005",
    title: "Pocket-Friendly 1 BHK Flat for Students & Singles",
    type: "Flat",
    listingType: "Rent",
    price: 8500,
    priceUnit: "/month",
    deposit: 17000,
    bhk: 1,
    areaSqFt: 550,
    address: "Behind Engineering College, Jankipuram",
    locality: "Jankipuram",
    city: "Lucknow",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80"
    ],
    isVerified: false,
    isFeatured: false,
    isDuplicate: true, // Duplicate check demo
    duplicateOf: "PROP-0982",
    similarityScore: "94% Match",
    ownerName: "Mohd. Shakeel",
    ownerPhone: "+91 87654 32109",
    ownerRole: "Direct Owner",
    amenities: ["Geyser", "Bike Parking", "24/7 Water"],
    furnishing: "Semi-Furnished",
    targetTenant: "Students & Bachelors",
    description: "Affordable 1 BHK flat near coaching hub and university campus. Independent electricity meter.",
    postedAt: "2026-09-30",
    status: "Pending Verification",
    reportsCount: 1,
    deedDocument: "Electricity Bill (Pending Cross-check)"
  },
  {
    id: "PROP-1006",
    title: "Suspended Listing - Suspicious Advance Payment Demand",
    type: "Flat",
    listingType: "Rent",
    price: 12000,
    priceUnit: "/month",
    deposit: 30000,
    bhk: 2,
    areaSqFt: 900,
    address: "Sector 14, Ring Road, Kalyanpur",
    locality: "Kalyanpur",
    city: "Lucknow",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80"
    ],
    isVerified: false,
    isFeatured: false,
    isDuplicate: false,
    ownerName: "Sanjay Dixit",
    ownerPhone: "+91 93351 00291",
    ownerRole: "Broker",
    amenities: ["Water Supply"],
    furnishing: "Unfurnished",
    targetTenant: "Anyone",
    description: "Suspended due to user reports claiming fraudulent deposit demand prior to physical visit.",
    postedAt: "2026-09-20",
    status: "Suspended",
    reportsCount: 5,
    deedDocument: "Disputed Document (Suspended)"
  }
];

// Duplicate Detection Engine Pairings
export const initialDuplicatePairs = [
  {
    id: "DUP-PAIR-01",
    originalId: "PROP-0982",
    originalTitle: "1 BHK Student Flat Jankipuram Sec F",
    originalOwner: "Rameshwar Prasad (+91 94150 11223)",
    flaggedId: "PROP-1005",
    flaggedTitle: "Pocket-Friendly 1 BHK Flat for Students & Singles",
    flaggedOwner: "Mohd. Shakeel (+91 87654 32109)",
    similarityScore: "94% Text & Image Match",
    addressMatch: "Identical building address in Jankipuram",
    detectedAt: "2026-09-30 10:14",
    status: "Flagged Pending Decision"
  }
];

// 9 Bachelor Services from Poster
export const bachelorCategories = [
  { id: "CAT-01", name: "Tiffin / Mess", providersCount: 14, standardFee: "₹ 75/meal", commission: "10%", status: "Active" },
  { id: "CAT-02", name: "Laundry & Dry Clean", providersCount: 8, standardFee: "₹ 15/cloth", commission: "8%", status: "Active" },
  { id: "CAT-03", name: "Maid & Domestic Helpers", providersCount: 12, standardFee: "₹ 2,000/mo", commission: "12%", status: "Active" },
  { id: "CAT-04", name: "Deep Home Cleaning", providersCount: 6, standardFee: "₹ 1,499", commission: "15%", status: "Active" },
  { id: "CAT-05", name: "Electrician & AC Repair", providersCount: 16, standardFee: "₹ 199", commission: "10%", status: "Active" },
  { id: "CAT-06", name: "Plumber & Sanitation", providersCount: 11, standardFee: "₹ 249", commission: "10%", status: "Active" },
  { id: "CAT-07", name: "Carpenter & Furniture Fix", providersCount: 5, standardFee: "₹ 299", commission: "10%", status: "Active" },
  { id: "CAT-08", name: "Internet / Wi-Fi Setup", providersCount: 4, standardFee: "₹ 499/mo", commission: "10%", status: "Active" },
  { id: "CAT-09", name: "Packers & Movers", providersCount: 7, standardFee: "₹ 2,999", commission: "12%", status: "Active" }
];

export const initialServices = [
  {
    id: "SRV-01",
    name: "Annapurna Homestyle Tiffin & Mess",
    category: "Tiffin / Mess",
    provider: "Manoj Tiwari",
    phone: "+91 98399 11001",
    rating: 4.8,
    orders: 840,
    priceStarts: "₹ 75 / meal",
    status: "Active",
    complaints: 1,
    verified: true
  },
  {
    id: "SRV-02",
    name: "SpeedyWash Laundry & Dry Cleaners",
    category: "Laundry",
    provider: "Suresh Kashyap",
    phone: "+91 94150 22334",
    rating: 4.7,
    orders: 412,
    priceStarts: "₹ 15 / cloth",
    status: "Active",
    complaints: 0,
    verified: true
  },
  {
    id: "SRV-03",
    name: "TrustMaid Verified Domestic Helpers",
    category: "Maid",
    provider: "Geeta Devi Agency",
    phone: "+91 88401 55667",
    rating: 4.9,
    orders: 310,
    priceStarts: "₹ 2,000 / mo",
    status: "Active",
    complaints: 2,
    verified: true
  },
  {
    id: "SRV-04",
    name: "Urban Clean Pro - Deep Home & Bathroom Cleaning",
    category: "Cleaning",
    provider: "Sunil Maurya",
    phone: "+91 98399 22100",
    rating: 4.8,
    orders: 342,
    priceStarts: "₹ 1,499",
    status: "Active",
    complaints: 0,
    verified: true
  },
  {
    id: "SRV-05",
    name: "QuickVolt Electrician & AC Repair",
    category: "Electrician",
    provider: "Anil Sharma",
    phone: "+91 97112 33445",
    rating: 4.6,
    orders: 520,
    priceStarts: "₹ 199",
    status: "Active",
    complaints: 1,
    verified: true
  },
  {
    id: "SRV-06",
    name: "Express Fix Plumber & Sanitary",
    category: "Plumber",
    provider: "Dinesh Kumar",
    phone: "+91 87650 11928",
    rating: 4.6,
    orders: 219,
    priceStarts: "₹ 249",
    status: "Active",
    complaints: 0,
    verified: true
  },
  {
    id: "SRV-07",
    name: "SafeShift Packers & Movers",
    category: "Packers & Movers",
    provider: "Rajesh Logistics",
    phone: "+91 94150 99881",
    rating: 4.9,
    orders: 512,
    priceStarts: "₹ 2,999",
    status: "Active",
    complaints: 3,
    verified: true
  }
];

export const initialServiceComplaints = [
  { id: "COMP-01", service: "SafeShift Packers & Movers", customer: "Deepak Srivastava", issue: "Minor scratch on refrigerator during relocation", date: "2026-09-29", status: "In Mediation" },
  { id: "COMP-02", service: "TrustMaid Verified Domestic Helpers", customer: "Ananya Deshmukh", issue: "Maid absent without advance notice", date: "2026-09-28", status: "Resolved (Replacement assigned)" }
];

// Used Items
export const initialUsedItems = [
  {
    id: "ITEM-301",
    title: "Solid Sheesham Wood Queen Bed with Storage",
    category: "Furniture",
    price: 11500,
    originalPrice: 24000,
    sellerName: "Tanmay Gupta (Tenant)",
    phone: "+91 98190 77123",
    locality: "Mahanagar, Lucknow",
    status: "Active",
    condition: "Like New (1 yr used)",
    reported: false,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80",
    postedAt: "2026-09-28"
  },
  {
    id: "ITEM-302",
    title: "LG 260L 3-Star Inverter Frost-Free Refrigerator",
    category: "Appliances",
    price: 13500,
    originalPrice: 28000,
    sellerName: "Neha Rastogi",
    phone: "+91 94151 33445",
    locality: "Gomti Nagar, Lucknow",
    status: "Active",
    condition: "Good Condition",
    reported: false,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=400&q=80",
    postedAt: "2026-09-25"
  },
  {
    id: "ITEM-303",
    title: "Ergonomic Mesh Study / Office Chair with Lumbar",
    category: "Furniture",
    price: 3200,
    originalPrice: 8500,
    sellerName: "Rohit Saxena",
    phone: "+91 93350 44556",
    locality: "Vibhuti Khand",
    status: "Reported",
    condition: "Broken armrest (Disputed description)",
    reported: true,
    image: "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=400&q=80",
    postedAt: "2026-09-29"
  }
];

// Finance & Transactions
export const initialTransactions = [
  {
    id: "TXN-98401",
    userName: "Vikramaditya Roy",
    userRole: "Owner",
    purpose: "Owner Premium Subscription (Gold Pro)",
    amount: 999,
    gateway: "Razorpay",
    paymentId: "pay_Rzp9012481",
    status: "Success",
    date: "2026-09-28 14:22"
  },
  {
    id: "TXN-98402",
    userName: "Harshvardhan Kapoor",
    userRole: "Commercial Owner",
    purpose: "Featured Property Boost (30 Days)",
    amount: 999,
    gateway: "Razorpay",
    paymentId: "pay_Rzp9012993",
    status: "Success",
    date: "2026-09-27 10:15"
  },
  {
    id: "TXN-98403",
    userName: "Ananya Deshmukh",
    userRole: "Direct Owner",
    purpose: "Property Listing Charge (House #PROP-1002)",
    amount: 199,
    gateway: "Razorpay",
    paymentId: "pay_Rzp9013110",
    status: "Success",
    date: "2026-09-27 09:40"
  },
  {
    id: "TXN-98404",
    userName: "Sunil Maurya",
    userRole: "Service Partner",
    purpose: "Urban Clean Pro Lead Commission",
    amount: 250,
    gateway: "Razorpay",
    paymentId: "pay_Rzp9014552",
    status: "Success",
    date: "2026-09-26 16:30"
  },
  {
    id: "TXN-98405",
    userName: "Mohit Aggarwal",
    userRole: "Tenant",
    purpose: "Verification Fee Refund",
    amount: 299,
    gateway: "Razorpay",
    paymentId: "ref_Rzp9019912",
    status: "Refunded",
    date: "2026-09-25 11:00"
  }
];

export const initialRefundRequests = [
  { id: "REF-01", user: "Mohit Aggarwal", amount: 299, reason: "Duplicate payment attempt on verification", date: "2026-09-25", status: "Refund Processed" },
  { id: "REF-02", user: "Kunal Bansal", amount: 199, reason: "Cancelled visit request before owner confirmation", date: "2026-09-30", status: "Pending Approval" }
];

// Communication
export const initialTickets = [
  {
    id: "TCK-501",
    from: "Deepak Srivastava (Tenant)",
    phone: "+91 99190 44332",
    subject: "Owner not answering scheduled visit call",
    category: "Visit Enquiry",
    priority: "High",
    status: "Open",
    createdAt: "2026-09-30 14:10"
  },
  {
    id: "TCK-502",
    from: "Tanmay Gupta (Seller)",
    phone: "+91 98190 77123",
    subject: "Buyer asking for delivery without payment",
    category: "Used Marketplace",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2026-09-29 18:30"
  },
  {
    id: "TCK-503",
    from: "Raghav Mehra (Owner)",
    phone: "+91 88401 99210",
    subject: "When will my PG KYC verification be completed?",
    category: "KYC Verification",
    priority: "Urgent",
    status: "Open",
    createdAt: "2026-09-30 11:45"
  }
];

export const initialBanners = [
  {
    id: "BAN-01",
    title: "Zero Brokerage Fest Gomti Nagar",
    subtext: "Connect directly with verified owners, pay 0% commission.",
    targetApp: "BachelorHub User App",
    status: "Active",
    clicks: 1420
  },
  {
    id: "BAN-02",
    title: "List Free for 45 Days!",
    subtext: "Special introductory offer for Lucknow property landlords.",
    targetApp: "OwnerHub Owner App",
    status: "Active",
    clicks: 890
  }
];

// Activity Logs
export const initialActivityLogs = [
  { id: "LOG-901", admin: "Aarav Singhania", action: "Approved Owner KYC", target: "Vikramaditya Roy (OWN-501)", time: "2 hours ago" },
  { id: "LOG-902", admin: "System Fraud Check", action: "Flagged Duplicate Property", target: "PROP-1005 (duplicate of PROP-0982)", time: "4 hours ago" },
  { id: "LOG-903", admin: "Aarav Singhania", action: "Blocked Broker", target: "Sanjay Dixit (OWN-505) for fraud complaints", time: "1 day ago" },
  { id: "LOG-904", admin: "System Razorpay", action: "Auto-collected subscription", target: "₹999 from OWN-501", time: "2 days ago" },
];

export const mockRevenueTrends = [
  { month: "Apr", revenue: 290000, listings: 410, kyc: 28 },
  { month: "May", revenue: 340000, listings: 480, kyc: 36 },
  { month: "Jun", revenue: 375000, listings: 550, kyc: 42 },
  { month: "Jul", revenue: 410000, listings: 690, kyc: 55 },
  { month: "Aug", revenue: 440000, listings: 810, kyc: 68 },
  { month: "Sep", revenue: 485200, listings: 982, kyc: 79 },
];
