import { HomeClient } from "../_components/HomeClient";

export const dynamic = "force-dynamic";
export const runtime = "edge";
export const revalidate = 0;

export default function HomePage() {
  return <HomeClient />;
}
