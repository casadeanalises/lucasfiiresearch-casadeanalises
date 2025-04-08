import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isMatch } from "date-fns";
import { getDashboard } from "../_data/get-dashboard";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import dynamic from "next/dynamic";
import Footer from "../_components/footer";

// Componentes carregados dinamicamente para evitar problemas com SSR
const FIIPortfolio = dynamic(() => import("./_components/fii-portfolio"), {
  ssr: false,
});

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const user = await clerkClient().users.getUser(userId);
  // Check if user has premium subscription
  if (user.publicMetadata.subscriptionPlan !== "premium") {
    redirect("/subscription?message=subscription-required");
  }

  const monthIsInvalid = !month || !isMatch(month, "MM");
  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`);
  }

  await getDashboard(month);
  await canUserAddTransaction();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex-1 p-6 pb-36">
        {/* Carteira de FIIs */}
        <div className="mb-6">
          <FIIPortfolio />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
