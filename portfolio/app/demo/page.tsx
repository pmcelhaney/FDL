import type { Metadata } from "next";
import PaymentDemo from "./PaymentDemo";

export const metadata: Metadata = {
  title: "ACH policy demo | FDL",
  description:
    "An interactive child-support payment scenario driven by one declarative field model.",
};

export default function DemoPage() {
  return <PaymentDemo />;
}
