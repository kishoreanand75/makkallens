import raw from "@/data/top50.json";

export type TopType = "service" | "scheme";
export interface TopItem {
  rank: number;
  type: TopType;
  id: string;
}

/** The 50 services and schemes Tamil Nadu residents most need, in order (see data/top50.json for how it was chosen). */
export const top50 = raw.items as TopItem[];
export const top50Note = raw._note;

const ranks = new Map(top50.map((t) => [`${t.type}:${t.id}`, t.rank]));
export const rankOf = (type: TopType, id: string): number => ranks.get(`${type}:${id}`) ?? 999;
export const isTop50 = (type: TopType, id: string) => ranks.has(`${type}:${id}`);

/** 10 for rank 1 … 1 for rank 50. */
export const popularityOf = (type: TopType, id: string): number => {
  const r = rankOf(type, id);
  return r > 50 ? 1 : Math.round(10 - ((r - 1) / 49) * 9);
};
