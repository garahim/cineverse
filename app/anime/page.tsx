import TypeCatalogue from "@/components/TypeCatalogue";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Anime" };

export default async function AnimePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <TypeCatalogue type="anime" searchParams={sp} />;
}