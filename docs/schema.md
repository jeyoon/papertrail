# Data Schema

## Entities

```
Location
├── id
├── name
├── address
├── notes

Event
├── id
├── name
├── date
├── description
├── landing_url

Design
├── id
├── name          (e.g. "Bold v1", "Minimal B")
├── description

Flyer             (event × design — the abstract artifact)
├── id
├── event_id      → Event
├── design_id     → Design

PrintOrder        (physical print run for a flyer)
├── id
├── flyer_id      → Flyer
├── quantity
├── ordered_at
├── notes

Drop              (flyer deployed at a location — owns QR attribution)
├── id
├── flyer_id      → Flyer
├── location_id   → Location
├── qr_code       (encodes drop_id)
├── created_at

Engagement        (someone scans a QR code)
├── id
├── drop_id       → Drop
├── scanned_at

Visit             (a trip to a location)
├── id
├── location_id   → Location
├── visited_by
├── visited_at
├── notes

DropoffAttempt    (one per flyer attempted during a visit)
├── id
├── visit_id      → Visit
├── drop_id       → Drop
├── quantity      (how many leaflets left)
├── status        (accepted | rejected | tentative)
├── comment
```

---

## Flow

**Setup**
1. Create **Locations** (stores)
2. Create **Events**
3. Create **Designs** (one per visual variant)
4. Create **Flyers** by pairing an Event with a Design
5. Generate **Drops** for each store you plan to hit → unique QR code per drop
6. Log **PrintOrders** as you order physical batches of a flyer

**Field work**
7. Team member creates a **Visit** (location + who + when)
8. For each flyer they attempted to drop off, log a **DropoffAttempt** → quantity, status, comment
   - UI presents this as one visit form; each flyer is a row within it

**Attribution**
9. Someone scans a QR code → **Engagement** logged against the Drop
10. Drop → Flyer → Event + Design + Location gives full attribution

**Analytics**
- Engagements by location → which stores drive the most interest
- Engagements by event → which events attract the most interest
- Engagements by design → A/B comparison across variants
- Engagement timestamps → time-of-day / day-of-week patterns
- DropoffAttempts → acceptance rate by location, rejection patterns by design or event
