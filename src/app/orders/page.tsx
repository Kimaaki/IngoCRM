export const dynamic = "force-dynamic";
export const revalidate = 0;

import OrdersClient from "./OrdersClient";

export default function Page() {
  return <OrdersClient />;
}
