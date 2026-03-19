import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import QRCode from "qrcode";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function qr(id: string) {
  return QRCode.toDataURL(`${BASE}/t/${id}`, {
    width: 400, margin: 2,
    color: { dark: "#25343F", light: "#f7fafa" },
  });
}

async function main() {
  // ── Locations ──────────────────────────────────────────────────────────────
  const loc1 = await prisma.location.upsert({
    where: { id: "loc_grove_coffee" },
    update: {},
    create: {
      id: "loc_grove_coffee",
      name: "Grove Street Coffee",
      address: "42 Grove St, Brooklyn, NY 11221",
      notes: "Ask for Maya at the counter. Open til 8pm.",
    },
  });

  const loc2 = await prisma.location.upsert({
    where: { id: "loc_anchor_bar" },
    update: {},
    create: {
      id: "loc_anchor_bar",
      name: "The Anchor Bar",
      address: "188 Atlantic Ave, Brooklyn, NY 11201",
      notes: "Good foot traffic on weekends. Bulletin board near entrance.",
    },
  });

  const loc3 = await prisma.location.upsert({
    where: { id: "loc_city_books" },
    update: {},
    create: {
      id: "loc_city_books",
      name: "City Park Bookshop",
      address: "76 Prospect Park W, Brooklyn, NY 11215",
      notes: "Community-focused. Happy to display neighborhood events.",
    },
  });

  // ── Events ─────────────────────────────────────────────────────────────────
  const evt1 = await prisma.event.upsert({
    where: { id: "evt_summer_block" },
    update: {},
    create: {
      id: "evt_summer_block",
      name: "Summer Block Party",
      date: new Date("2026-07-19T15:00:00"),
      description: "Annual neighborhood block party with live music and food vendors.",
      landingUrl: "https://example.com/events/summer-block-party",
    },
  });

  const evt2 = await prisma.event.upsert({
    where: { id: "evt_jazz_night" },
    update: {},
    create: {
      id: "evt_jazz_night",
      name: "Jazz Night",
      date: new Date("2026-08-09T20:00:00"),
      description: "Live jazz quartet in the park. Free entry, bring a blanket.",
      landingUrl: "https://example.com/events/jazz-night",
    },
  });

  const evt3 = await prisma.event.upsert({
    where: { id: "evt_art_walk" },
    update: {},
    create: {
      id: "evt_art_walk",
      name: "Art Walk",
      date: new Date("2026-09-05T11:00:00"),
      description: "Self-guided tour of local studios and pop-up galleries across the neighborhood.",
      landingUrl: "https://example.com/events/art-walk",
    },
  });

  // ── Designs ────────────────────────────────────────────────────────────────
  const dsg1 = await prisma.design.upsert({
    where: { id: "dsg_bold_red" },
    update: {},
    create: {
      id: "dsg_bold_red",
      name: "Bold Red v1",
      description: "High-contrast red and black design with large event title. Variant A.",
    },
  });

  const dsg2 = await prisma.design.upsert({
    where: { id: "dsg_minimal_cream" },
    update: {},
    create: {
      id: "dsg_minimal_cream",
      name: "Minimal Cream",
      description: "Clean, understated layout with serif headline. Good for upscale venues.",
    },
  });

  const dsg3 = await prisma.design.upsert({
    where: { id: "dsg_neon_green" },
    update: {},
    create: {
      id: "dsg_neon_green",
      name: "Neon Green v2",
      description: "Eye-catching fluorescent green on dark background. High street visibility.",
    },
  });

  // ── Flyers ─────────────────────────────────────────────────────────────────
  const fly1 = await prisma.flyer.upsert({
    where: { id: "fly_summer_bold" },
    update: {},
    create: { id: "fly_summer_bold", eventId: evt1.id, designId: dsg1.id },
  });

  const fly2 = await prisma.flyer.upsert({
    where: { id: "fly_summer_minimal" },
    update: {},
    create: { id: "fly_summer_minimal", eventId: evt1.id, designId: dsg2.id },
  });

  const fly3 = await prisma.flyer.upsert({
    where: { id: "fly_jazz_bold" },
    update: {},
    create: { id: "fly_jazz_bold", eventId: evt2.id, designId: dsg1.id },
  });

  const fly4 = await prisma.flyer.upsert({
    where: { id: "fly_jazz_neon" },
    update: {},
    create: { id: "fly_jazz_neon", eventId: evt2.id, designId: dsg3.id },
  });

  const fly5 = await prisma.flyer.upsert({
    where: { id: "fly_art_minimal" },
    update: {},
    create: { id: "fly_art_minimal", eventId: evt3.id, designId: dsg2.id },
  });

  // ── Print Orders ───────────────────────────────────────────────────────────
  await prisma.printOrder.upsert({
    where: { id: "po_summer_bold_1" },
    update: {},
    create: { id: "po_summer_bold_1", flyerId: fly1.id, quantity: 100, orderedAt: new Date("2026-06-01"), notes: "First run. Ordered from Canva Print." },
  });
  await prisma.printOrder.upsert({
    where: { id: "po_summer_bold_2" },
    update: {},
    create: { id: "po_summer_bold_2", flyerId: fly1.id, quantity: 75, orderedAt: new Date("2026-06-20"), notes: "Reorder — ran out at Grove Street." },
  });
  await prisma.printOrder.upsert({
    where: { id: "po_summer_minimal_1" },
    update: {},
    create: { id: "po_summer_minimal_1", flyerId: fly2.id, quantity: 50, orderedAt: new Date("2026-06-05") },
  });
  await prisma.printOrder.upsert({
    where: { id: "po_jazz_bold_1" },
    update: {},
    create: { id: "po_jazz_bold_1", flyerId: fly3.id, quantity: 80, orderedAt: new Date("2026-07-10") },
  });
  await prisma.printOrder.upsert({
    where: { id: "po_jazz_neon_1" },
    update: {},
    create: { id: "po_jazz_neon_1", flyerId: fly4.id, quantity: 60, orderedAt: new Date("2026-07-10"), notes: "Neon requires special paper stock." },
  });
  await prisma.printOrder.upsert({
    where: { id: "po_art_minimal_1" },
    update: {},
    create: { id: "po_art_minimal_1", flyerId: fly5.id, quantity: 40, orderedAt: new Date("2026-08-15") },
  });

  // ── Drops ──────────────────────────────────────────────────────────────────
  // Helper: upsert a drop and ensure it has a QR code
  async function upsertDrop(id: string, flyerId: string, locationId: string) {
    const drop = await prisma.drop.upsert({
      where: { id },
      update: {},
      create: { id, flyerId, locationId },
    });
    if (!drop.qrCode) {
      const code = await qr(id);
      await prisma.drop.update({ where: { id }, data: { qrCode: code } });
    }
    return drop;
  }

  const drop1 = await upsertDrop("drop_summer_bold_grove",   fly1.id, loc1.id);
  const drop2 = await upsertDrop("drop_summer_bold_anchor",  fly1.id, loc2.id);
  const drop3 = await upsertDrop("drop_summer_minimal_books",fly2.id, loc3.id);
  const drop4 = await upsertDrop("drop_jazz_bold_grove",     fly3.id, loc1.id);
  const drop5 = await upsertDrop("drop_jazz_neon_anchor",    fly4.id, loc2.id);
  const drop6 = await upsertDrop("drop_jazz_neon_books",     fly4.id, loc3.id);
  const drop7 = await upsertDrop("drop_art_minimal_grove",   fly5.id, loc1.id);
  const drop8 = await upsertDrop("drop_art_minimal_books",   fly5.id, loc3.id);

  // ── Engagements ────────────────────────────────────────────────────────────
  const engagements = [
    { id: "eng_001", dropId: drop1.id, scannedAt: new Date("2026-06-18T14:22:00") },
    { id: "eng_002", dropId: drop1.id, scannedAt: new Date("2026-06-20T09:45:00") },
    { id: "eng_003", dropId: drop1.id, scannedAt: new Date("2026-06-21T16:10:00") },
    { id: "eng_004", dropId: drop2.id, scannedAt: new Date("2026-06-19T18:30:00") },
    { id: "eng_005", dropId: drop2.id, scannedAt: new Date("2026-06-22T12:05:00") },
    { id: "eng_006", dropId: drop3.id, scannedAt: new Date("2026-06-23T11:00:00") },
    { id: "eng_007", dropId: drop3.id, scannedAt: new Date("2026-06-24T15:20:00") },
    { id: "eng_008", dropId: drop3.id, scannedAt: new Date("2026-06-25T10:50:00") },
    { id: "eng_009", dropId: drop4.id, scannedAt: new Date("2026-07-14T13:15:00") },
    { id: "eng_010", dropId: drop4.id, scannedAt: new Date("2026-07-15T17:40:00") },
    { id: "eng_011", dropId: drop5.id, scannedAt: new Date("2026-07-16T19:00:00") },
    { id: "eng_012", dropId: drop5.id, scannedAt: new Date("2026-07-17T20:30:00") },
    { id: "eng_013", dropId: drop5.id, scannedAt: new Date("2026-07-18T21:00:00") },
    { id: "eng_014", dropId: drop6.id, scannedAt: new Date("2026-07-17T14:00:00") },
    { id: "eng_015", dropId: drop7.id, scannedAt: new Date("2026-08-20T10:00:00") },
    { id: "eng_016", dropId: drop8.id, scannedAt: new Date("2026-08-21T11:30:00") },
    { id: "eng_017", dropId: drop8.id, scannedAt: new Date("2026-08-22T14:00:00") },
  ];
  for (const e of engagements) {
    await prisma.engagement.upsert({ where: { id: e.id }, update: {}, create: e });
  }

  // ── Visits ─────────────────────────────────────────────────────────────────
  const vis1 = await prisma.visit.upsert({
    where: { id: "vis_001" },
    update: {},
    create: { id: "vis_001", locationId: loc1.id, visitedBy: "Jordan", visitedAt: new Date("2026-06-15T11:30:00"), notes: "Staff were friendly, happy to display flyers near the register." },
  });
  const vis2 = await prisma.visit.upsert({
    where: { id: "vis_002" },
    update: {},
    create: { id: "vis_002", locationId: loc2.id, visitedBy: "Sam", visitedAt: new Date("2026-06-17T14:00:00"), notes: "Busy lunch crowd. Manager approved placement by the bar." },
  });
  const vis3 = await prisma.visit.upsert({
    where: { id: "vis_003" },
    update: {},
    create: { id: "vis_003", locationId: loc3.id, visitedBy: "Jordan", visitedAt: new Date("2026-06-22T10:00:00") },
  });
  const vis4 = await prisma.visit.upsert({
    where: { id: "vis_004" },
    update: {},
    create: { id: "vis_004", locationId: loc1.id, visitedBy: "Alex", visitedAt: new Date("2026-07-12T09:00:00"), notes: "Dropped Jazz Night flyers — rack was almost empty." },
  });

  // ── Dropoff Attempts ───────────────────────────────────────────────────────
  const attempts = [
    { id: "da_001", visitId: vis1.id, dropId: drop1.id, quantity: 25, status: "accepted" as const, comment: "Placed in the leaflet rack by the door." },
    { id: "da_002", visitId: vis2.id, dropId: drop2.id, quantity: 20, status: "accepted" as const, comment: "Bar staff put them on the community board." },
    { id: "da_003", visitId: vis3.id, dropId: drop3.id, quantity: 20, status: "accepted" as const },
    { id: "da_004", visitId: vis4.id, dropId: drop4.id, quantity: 30, status: "accepted" as const, comment: "Refilled the Grove Street rack." },
    { id: "da_005", visitId: vis4.id, dropId: drop5.id, quantity: 0, status: "rejected" as const, comment: "Manager said no more flyers this month." },
  ];
  for (const a of attempts) {
    await prisma.dropoffAttempt.upsert({ where: { id: a.id }, update: {}, create: a });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
