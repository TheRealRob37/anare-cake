import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Anare Cake — order a custom cake, ask a question, or find us in Yerevan.",
};

export default function Page() {
  return <ContactPage />;
}
