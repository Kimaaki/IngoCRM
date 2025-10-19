// FILE: src/app/leads/page.tsx
// SERVER COMPONENT – evita prerender e força execução dinâmica.
export const dynamic = "force-dynamic";
export const revalidate = 0;

import LeadsClient from "./LeadsClient";

export default function Page() {
  return <LeadsClient />;
}
