import type { Metadata } from "next";
import CakeConfigurator from "@/components/configurator/CakeConfigurator";

export const metadata: Metadata = {
  title: "Ձևավորել Տորթ — Design Your Cake",
  description: "Ստեղծեք ձեր անհատական տորթը շերտ առ շերտ։ Ընտրեք բիսկվի, լցոնում, ծածկույթ ու զարդ։",
};

export default function ConfiguratorPage() {
  return (
    <div className="pt-16">
      <CakeConfigurator />
    </div>
  );
}
