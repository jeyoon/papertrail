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

Promotion         (event × design — the abstract artifact)
├── id
├── event_id      → Event
├── design_id     → Design

PrintOrder        (physical print run for a promotion)
├── id
├── promotion_id  → Promotion
├── quantity
├── ordered_at
├── notes

Placement         (promotion deployed at a location — owns attribution)
├── id
├── promotion_id  → Promotion
├── location_id   → Location
├── qr_code       (encodes placement_id)
├── created_at

Engagement        (someone engages via QR code)
├── id
├── placement_id  → Placement
├── scanned_at

Visit             (a trip to a store)
├── id
├── location_id   → Location
├── visited_by
├── visited_at
├── notes

DropoffAttempt    (one per promotion attempted during a visit)
├── id
├── visit_id      → Visit
├── placement_id  → Placement
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
4. Create **Promotions** by pairing an Event with a Design
5. Generate **Placements** for each store you plan to hit → unique QR code per placement
6. Log **PrintOrders** as you order physical batches of a promotion

**Field work**
7. Team member creates a **Visit** (location + who + when)
8. For each promotion they attempted to drop off, log a **DropoffAttempt** → quantity, status, comment
   - UI presents this as one visit form; each promotion is a row within it

**Attribution**
9. Someone scans a QR code → **Engagement** logged against the Placement
10. Placement → Promotion → Event + Design + Location gives full attribution

**Analytics**
- Engagements by location → which stores drive the most interest
- Engagements by event → which events attract the most interest
- Engagements by design → A/B comparison across variants
- Engagement timestamps → time-of-day / day-of-week patterns
- DropoffAttempts → acceptance rate by location, rejection patterns by design or event
