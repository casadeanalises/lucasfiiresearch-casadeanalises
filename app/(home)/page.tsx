import { auth } from "@clerk/nextjs";
import { HomeClient } from "../_components/HomeClient";
import { LoggedInHome } from "../_components/LoggedInHome";

export default function HomePage() {
  const { userId } = auth();

  if (!userId) {
    return (
      <div className="contents">
        <HomeClient />
      </div>
    );
  }

  return (
    <div className="contents">
      <LoggedInHome />
    </div>
  );
}
