// Demo data fallback when Supabase is unavailable
export const DEMO_LEADS = [
  { id: "1", name: "James Whitfield", email: "james.whitfield@gmail.com", phone: "0412 345 678", property: "32 Ocean Parade", suburb: "Brighton VIC 3186", budget: "$2.5M–$3M", price: "", requested: "Section 32", status: "New", captured: "21 May 2026" },
  { id: "2", name: "Sophie Laurent", email: "sophie.laurent@outlook.com", phone: "0423 567 890", property: "55 Bay Rd", suburb: "St Kilda VIC 3182", budget: "$1.2M–$1.5M", price: "", requested: "Appraisal", status: "Contacted", captured: "20 May 2026" },
  { id: "3", name: "Marcus Chen", email: "mchen@icloud.com", phone: "0435 678 901", property: "7 Hillcrest Ave", suburb: "Toorak VIC 3142", budget: "$4M+", price: "", requested: "Contract", status: "Qualified", captured: "19 May 2026" },
  { id: "4", name: "Emma Rodriguez", email: "emma.r@hotmail.com", phone: "0401 234 567", property: "14A Collins St", suburb: "Melbourne CBD VIC 3000", budget: "$800K–$1M", price: "", requested: "Floor Plan", status: "New", captured: "18 May 2026" },
  { id: "5", name: "Liam O'Brien", email: "liam.obrien@gmail.com", phone: "0456 789 012", property: "Penthouse, 200 Spencer St", suburb: "Melbourne CBD VIC 3000", budget: "$5M+", price: "", requested: "Section 32", status: "Hot", captured: "17 May 2026" },
  { id: "6", name: "Priya Sharma", email: "priya.sharma@gmail.com", phone: "0467 890 123", property: "22 Park Lane", suburb: "South Yarra VIC 3141", budget: "$1.8M–$2.2M", price: "", requested: "Appraisal", status: "Contacted", captured: "16 May 2026" },
  { id: "7", name: "David Thompson", email: "d.thompson@bigpond.com", phone: "0478 901 234", property: "3/45 St Kilda Rd", suburb: "St Kilda VIC 3182", budget: "$650K–$750K", price: "", requested: "Contract", status: "Qualified", captured: "15 May 2026" },
  { id: "8", name: "Natalie Kim", email: "natalie.kim@yahoo.com", phone: "0489 012 345", property: "88 Punt Rd", suburb: "Richmond VIC 3121", budget: "$1.1M–$1.3M", price: "", requested: "Section 32", status: "New", captured: "14 May 2026" },
];

export const DEMO_LISTINGS = [
  { id: "1", address: "32 Ocean Parade", suburb: "Brighton VIC 3186", price: "$2,850,000", beds: 4, baths: 3, cars: 2, type: "House", status: "Active", agent: "Sam Banks", days: 12, img: "" },
  { id: "2", address: "7 Hillcrest Ave", suburb: "Toorak VIC 3142", price: "$4,200,000", beds: 5, baths: 4, cars: 3, type: "House", status: "Active", agent: "Jake Wilson", days: 8, img: "" },
  { id: "3", address: "Penthouse, 200 Spencer St", suburb: "Melbourne CBD VIC 3000", price: "$5,500,000", beds: 3, baths: 3, cars: 2, type: "Apartment", status: "Under Offer", agent: "Toby Harris", days: 21, img: "" },
  { id: "4", address: "14A Collins St", suburb: "Melbourne CBD VIC 3000", price: "$950,000", beds: 2, baths: 2, cars: 1, type: "Apartment", status: "Active", agent: "Kelvin Nguyen", days: 5, img: "" },
  { id: "5", address: "55 Bay Rd", suburb: "St Kilda VIC 3182", price: "$1,350,000", beds: 3, baths: 2, cars: 1, type: "House", status: "Active", agent: "Jacinta Moore", days: 3, img: "" },
  { id: "6", address: "22 Park Lane", suburb: "South Yarra VIC 3141", price: "$2,100,000", beds: 4, baths: 3, cars: 2, type: "Townhouse", status: "Sold", agent: "Pradnya Patil", days: 34, img: "" },
];

export const DEMO_RENTALS = [
  { id: "1", address: "12 Elwood St", suburb: "Elwood VIC 3184", rent: "$650/week", beds: 3, baths: 2, cars: 1, type: "House", status: "Leased", agent: "Sam Banks", available: "01 Jun 2026" },
  { id: "2", address: "5/28 Chapel St", suburb: "Prahran VIC 3181", rent: "$480/week", beds: 2, baths: 1, cars: 1, type: "Apartment", status: "Available", agent: "Jake Wilson", available: "Now" },
  { id: "3", address: "101 Acland St", suburb: "St Kilda VIC 3182", rent: "$420/week", beds: 1, baths: 1, cars: 0, type: "Apartment", status: "Available", agent: "Toby Harris", available: "Now" },
  { id: "4", address: "7 Domain Rd", suburb: "South Yarra VIC 3141", rent: "$750/week", beds: 3, baths: 2, cars: 2, type: "Townhouse", status: "Leased", agent: "Kelvin Nguyen", available: "15 Jun 2026" },
];

export const DEMO_TEAM = [
  { id: "1", name: "Sam Banks", role: "Principal Agent", email: "sam@realtyavatar.com", phone: "0412 345 678", listings: 3, leads: 12 },
  { id: "2", name: "Jake Wilson", role: "Senior Agent", email: "jake@realtyavatar.com", phone: "0423 456 789", listings: 2, leads: 8 },
  { id: "3", name: "Toby Harris", role: "Agent", email: "toby@realtyavatar.com", phone: "0434 567 890", listings: 1, leads: 5 },
  { id: "4", name: "Kelvin Nguyen", role: "Agent", email: "kelvin@realtyavatar.com", phone: "0445 678 901", listings: 2, leads: 7 },
  { id: "5", name: "Jacinta Moore", role: "Property Manager", email: "jacinta@realtyavatar.com", phone: "0456 789 012", listings: 1, leads: 4 },
  { id: "6", name: "Pradnya Patil", role: "Agent", email: "pradnya@realtyavatar.com", phone: "0467 890 123", listings: 1, leads: 6 },
];
