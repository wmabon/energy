import { LogComposer } from "@/components/log/log-composer";

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const type = params.type === "drain" ? "drain" : "charge";

  return <LogComposer initialType={type} />;
}
