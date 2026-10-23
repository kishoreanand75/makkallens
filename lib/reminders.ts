export interface Reminder {
  id: string;
  title: string;
  /** ISO date, YYYY-MM-DD */
  due: string;
  note?: string;
  schemeId?: string;
}

export const REMINDERS_KEY = "av-reminders";

export function daysUntil(due: string, now = new Date()): number {
  const d = new Date(`${due}T00:00:00`);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((d.getTime() - start.getTime()) / 86400000);
}

export type Urgency = "overdue" | "soon" | "later";
export function urgency(due: string, now = new Date()): Urgency {
  const n = daysUntil(due, now);
  return n < 0 ? "overdue" : n <= 7 ? "soon" : "later";
}

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Standards-compliant iCalendar (all-day events with a 1-day-before alarm) so reminders work in any calendar app. */
export function toIcs(reminders: Reminder[], now = new Date()): string {
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MakkalLens//Deadline Radar//EN", "CALSCALE:GREGORIAN"];
  for (const r of reminders) {
    const d = r.due.replace(/-/g, "");
    const next = new Date(`${r.due}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    const end = next.toISOString().slice(0, 10).replace(/-/g, "");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${r.id}@arasuvazhi`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${d}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${esc(r.title)}`,
      ...(r.note ? [`DESCRIPTION:${esc(r.note)}`] : []),
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${esc(r.title)}`,
      "TRIGGER:-P1D",
      "END:VALARM",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/** Recurring, date-stable items worth reminding about. Dates for exams/scholarships are NOT listed: they change every year. */
export const recurringIdeas: { title: { ta: string; en: string }; hint: { ta: string; en: string } }[] = [
  { title: { ta: "வாழ்நாள் சான்று (ஓய்வூதியதாரர்கள்)", en: "Life certificate (pensioners)" }, hint: { ta: "மத்திய அரசு ஓய்வூதியதாரர்கள் பொதுவாக நவம்பரில் சமர்ப்பிக்க வேண்டும்; உங்கள் துறையில் உறுதிசெய்யவும்.", en: "Central pensioners usually submit it in November; confirm with your department." } },
  { title: { ta: "வருமான வரிக் கணக்கு தாக்கல்", en: "Income-tax return filing" }, hint: { ta: "தனிநபர்களுக்குப் பொதுவாக ஜூலை 31; ஆண்டுதோறும் அறிவிப்பைப் பாருங்கள்.", en: "Usually 31 July for individuals; check the notice each year." } },
  { title: { ta: "பயிர்க் காப்பீட்டுக் கடைசித் தேதி", en: "Crop insurance cut-off" }, hint: { ta: "பருவத்துக்கு ஏற்ப மாறும்; வங்கி / வேளாண் அலுவலகத்தில் கேளுங்கள்.", en: "Varies by season; ask your bank or agriculture office." } },
];
