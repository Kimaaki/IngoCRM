// FILE: src/app/leads/[id]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import LeadDetailClient from "./LeadDetailClient";

export default function Page() {
  return <LeadDetailClient />;
}
