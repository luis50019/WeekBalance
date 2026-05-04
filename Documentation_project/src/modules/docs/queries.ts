import { getCollection, type CollectionEntry } from "astro:content";

export type DocEntry = CollectionEntry<"docs">;

export interface SidebarItem {
  label: string;
  slug: string;
  href: string;
  order: number;
  group?: string;
  description?: string;
}

const sortBySidebarOrder = (docs: DocEntry[]): DocEntry[] =>
  [...docs].sort((a, b) => a.data.sidebar.order - b.data.sidebar.order);

export const getDocs = async (): Promise<DocEntry[]> => {
  const docs = await getCollection("docs");
  return sortBySidebarOrder(docs);
};

export const getDocBySlug = async (slug: string): Promise<DocEntry | undefined> => {
  const normalizedSlug = slug.trim();
  const docs = await getCollection("docs", ({ data }) => data.slug === normalizedSlug);
  return docs[0];
};

export const buildSidebarItems = (docs: DocEntry[]): SidebarItem[] =>
  sortBySidebarOrder(docs).map((doc) => ({
    label: doc.data.sidebar.label,
    slug: doc.data.slug,
    href: `/docs/${doc.data.slug}`,
    order: doc.data.sidebar.order,
    group: doc.data.sidebar.group,
    description: doc.data.description,
  }));
