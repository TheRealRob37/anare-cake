import type { Metadata } from "next";
import CakeConfigurator from "@/components/configurator/CakeConfigurator";

export const metadata: Metadata = {
  title: "Design Your Cake",
  description: "Build your custom cake layer by layer — choose your recipe, frosting, and decorations.",
};

export default function ConfiguratorPage() {
  return (
    <div className="pt-16">
      <CakeConfigurator />
    </div>
  );
}
