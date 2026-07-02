import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "realtyavatar.db");

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      property TEXT,
      suburb TEXT,
      budget TEXT,
      price TEXT,
      requested TEXT,
      status TEXT DEFAULT 'New',
      notes TEXT DEFAULT '',
      captured TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL,
      suburb TEXT,
      price TEXT,
      type TEXT DEFAULT 'Sale',
      beds INTEGER DEFAULT 0,
      baths INTEGER DEFAULT 0,
      parking INTEGER DEFAULT 0,
      docs TEXT DEFAULT '0 Uploaded',
      status TEXT DEFAULT 'Active',
      img TEXT DEFAULT '#DBEAFE',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER,
      listing_address TEXT,
      doc_type TEXT,
      filename TEXT,
      status TEXT DEFAULT 'Uploaded',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      role TEXT DEFAULT 'Agent',
      department TEXT DEFAULT 'Sales',
      status TEXT DEFAULT 'Active',
      avatar_color TEXT DEFAULT '#2342B0',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rentals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL,
      suburb TEXT,
      price TEXT,
      beds INTEGER DEFAULT 0,
      baths INTEGER DEFAULT 0,
      parking INTEGER DEFAULT 0,
      available TEXT DEFAULT 'Now',
      status TEXT DEFAULT 'Available',
      docs TEXT DEFAULT '0 Uploaded',
      img TEXT DEFAULT '#D1FAE5',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      suburb TEXT NOT NULL,
      radius TEXT DEFAULT '10 km',
      type TEXT DEFAULT 'Seller Outreach',
      message TEXT DEFAULT '',
      status TEXT DEFAULT 'Draft',
      leads_captured INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      last_sent TEXT DEFAULT 'Not started',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Seed data if empty
  const leadCount = (db.prepare("SELECT COUNT(*) as c FROM leads").get() as any).c;
  if (leadCount === 0) {
    const insertLead = db.prepare(`INSERT INTO leads (name, email, phone, property, suburb, budget, price, requested, status, captured) VALUES (?,?,?,?,?,?,?,?,?,?)`);
    const seedLeads = [
      ["James Whitfield","j.whitfield@gmail.com","+61 412 345 678","32 Ocean Parade, Brighton","Brighton, VIC","$3.0M – $3.5M","$3,200,000","Section 32","Hot","Apr 13, 2026 – 9:15AM"],
      ["Priya Sharma","priya.s@outlook.com","+61 423 456 789","14A Collins St, Melbourne CBD","Melbourne CBD, VIC","$1.7M – $2.0M","$1,850,000","Contract","Warm","Apr 13, 2026 – 9:00AM"],
      ["Marcus Chen","marcus.chen@icloud.com","+61 434 567 890","7 Hillcrest Ave, Toorak","Toorak, VIC","$5.5M – $6.2M","$5,800,000","Floor Plan","Hot","Apr 13, 2026 – 8:20AM"],
      ["Sophie Laurent","sophie.l@gmail.com","+61 445 678 901","55 Bay Rd, St Kilda","St Kilda, VIC","$1.9M – $2.2M","$2,100,000","Section 32","New","Apr 13, 2026 – 6:30AM"],
      ["Daniel Kim","d.kim@gmail.com","+61 456 789 012","Penthouse, 200 Spencer St","Melbourne CBD, VIC","$4.0M – $5.0M","$4,500,000","Contract","Warm","Apr 12, 2026 – 4:10PM"],
      ["Amelia Torres","a.torres@hotmail.com","+61 467 890 123","9 Bayside Blvd, Elwood","Elwood, VIC","$1,500/wk – $1,800/wk","$1,650/wk","Rental Form","Cold","Apr 12, 2026 – 10:00AM"],
      ["Noah Williams","noah.w@gmail.com","+61 478 901 234","22 Park Lane, South Yarra","South Yarra, VIC","$2.5M – $3.0M","$2,750,000","Section 32","New","Apr 12, 2026 – 9:00AM"],
      ["Isabella Moore","i.moore@gmail.com","+61 489 012 345","44 Chapel St, Windsor","Windsor, VIC","$900/wk – $1,100/wk","$980/wk","Rental Form","Warm","Apr 11, 2026 – 3:45PM"],
    ];
    seedLeads.forEach(l => insertLead.run(...l));
  }

  const listingCount = (db.prepare("SELECT COUNT(*) as c FROM listings").get() as any).c;
  if (listingCount === 0) {
    const insertListing = db.prepare(`INSERT INTO listings (address, suburb, price, type, beds, baths, parking, docs, img) VALUES (?,?,?,?,?,?,?,?,?)`);
    [
      ["32 Ocean Parade","Brighton VIC 3186","$3,200,000","Sale",4,3,2,"2 Uploaded","#DBEAFE"],
      ["7 Hillcrest Ave","Toorak VIC 3142","$5,800,000","Sale",5,4,2,"Complete","#DCF8E8"],
      ["Penthouse, 200 Spencer St","Melbourne CBD VIC 3000","$4,500,000","Sale",3,2,1,"1 Missing","#FEE2E2"],
      ["14A Collins St","Melbourne CBD VIC 3000","$1,850,000","Sale",2,2,1,"Complete","#FEF3C7"],
      ["55 Bay Rd","St Kilda VIC 3182","$2,100,000","Sale",3,2,1,"2 Uploaded","#EDE9FE"],
      ["9 Bayside Blvd","Elwood VIC 3184","$1,650/wk","Rent",4,2,2,"Complete","#DBEAFE"],
      ["22 Park Lane","South Yarra VIC 3141","$2,750,000","Sale",3,2,1,"1 Missing","#FCE7F3"],
      ["44 Chapel St","Windsor VIC 3181","$980/wk","Rent",2,1,1,"2 Uploaded","#D1FAE5"],
    ].forEach(l => insertListing.run(...l));
  }

  // Seed team members
  const teamCount = (db.prepare("SELECT COUNT(*) as c FROM team_members").get() as any).c;
  if (teamCount === 0) {
    const insertMember = db.prepare(`INSERT INTO team_members (name, email, phone, role, department, status, avatar_color) VALUES (?,?,?,?,?,?,?)`);
    [
      ["Sam Banks","sam@realtyavatar.com","+61 412 345 678","Admin","Management","Active","#2342B0"],
      ["Jake Morrison","jake@realtyavatar.com","+61 423 456 789","Agent","Sales","Active","#16A34A"],
      ["Toby Richardson","toby@realtyavatar.com","+61 434 567 890","Agent","Sales","Active","#9333EA"],
      ["Kelvin Nguyen","kelvin@realtyavatar.com","+61 445 678 901","Agent","Rentals","Active","#F59E0B"],
      ["Jacinta Walsh","jacinta@realtyavatar.com","+61 456 789 012","Agent","Rentals","Active","#EF4444"],
      ["Pradhan Singh","pradhan@realtyavatar.com","+61 467 890 123","Agent","Sales","Active","#0EA5E9"],
    ].forEach(m => insertMember.run(...m));
  }

  // Seed rentals
  const rentalCount = (db.prepare("SELECT COUNT(*) as c FROM rentals").get() as any).c;
  if (rentalCount === 0) {
    const insertRental = db.prepare(`INSERT INTO rentals (address, suburb, price, beds, baths, parking, available, img) VALUES (?,?,?,?,?,?,?,?)`);
    [
      ["9 Bayside Blvd","Elwood VIC 3184","$1,650/wk",4,2,2,"Now","#D1FAE5"],
      ["44 Chapel St","Windsor VIC 3181","$980/wk",2,1,1,"Now","#DBEAFE"],
      ["12 Fitzroy St","St Kilda VIC 3182","$850/wk",2,1,0,"15 May","#FEF3C7"],
      ["8 Union Rd","Ascot Vale VIC 3032","$650/wk",1,1,1,"Now","#EDE9FE"],
      ["Unit 3, 45 Smith St","Collingwood VIC 3066","$580/wk",1,1,0,"1 Jun","#FCE7F3"],
    ].forEach(r => insertRental.run(...r));
  }

  const campaignCount = (db.prepare("SELECT COUNT(*) as c FROM campaigns").get() as any).c;
  if (campaignCount === 0) {
    const insertCampaign = db.prepare(`INSERT INTO campaigns (suburb, status, leads_captured, clicks, last_sent) VALUES (?,?,?,?,?)`);
    [
      ["Bondi, NSW","Active",14,382,"Apr 11, 2026"],
      ["Fitzroy, VIC","Active",9,241,"Apr 10, 2026"],
      ["St Kilda, VIC","Paused",3,98,"Mar 28, 2026"],
      ["Toorak, VIC","Active",21,554,"Apr 12, 2026"],
      ["Brighton, VIC","Draft",0,0,"Not started"],
    ].forEach(c => insertCampaign.run(...c));
  }
}

export default getDb;
