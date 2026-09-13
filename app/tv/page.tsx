import TypeCatalogue from "@/components/TypeCatalogue";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "TV Series" };

export default async function TvPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <TypeCatalogue type="tv" searchParams={sp} />;
}