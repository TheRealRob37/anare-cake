import type { Metadata } from "next";
import About from "@/components/home/About";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Meet the team behind Anare Cake — Anna Hakobyan and her Yerevan-based pastry artisans.",
};

export default function Page() {
  return (
    <div className="pt-16">
      <About />
    </div>
  );
}
