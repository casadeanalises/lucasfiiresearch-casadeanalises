import { HomeClient } from "./HomeClient";

export const dynamic = "force-dynamic";
export const runtime = "edge";
export const revalidate = 0;

export default function Page() {
  return <HomeClient />;
}
