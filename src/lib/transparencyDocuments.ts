export type TransparencyDocumentSection = "accountability" | "institutional";

export type TransparencyDocument = {
  id: string;
  title: string;
  section: TransparencyDocumentSection;
  year: string;
  dateLabel: string;
  url: string;
  fileName: string;
  order: number;
};

const DOCUMENTS_INDEX_PATH = "/docs/index.json";

export const fetchTransparencyDocuments = async (): Promise<TransparencyDocument[]> => {
  const response = await fetch(`${DOCUMENTS_INDEX_PATH}?v=${Date.now()}`);
  if (!response.ok) return [];

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const groupAccountabilityByYear = (documents: TransparencyDocument[]) => {
  const grouped = documents
    .filter((document) => document.section === "accountability")
    .reduce<Record<string, TransparencyDocument[]>>((acc, document) => {
      const year = document.year || "Outros";
      acc[year] = acc[year] ?? [];
      acc[year].push(document);
      return acc;
    }, {});

  return Object.entries(grouped)
    .sort(([yearA], [yearB]) => yearB.localeCompare(yearA))
    .map(([year, items]) => ({
      year,
      items: items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
    }));
};

export const getInstitutionalDocuments = (documents: TransparencyDocument[]) =>
  documents
    .filter((document) => document.section === "institutional")
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
