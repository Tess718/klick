"use client";

import { useState } from "react";
import { FAQItem } from "./faq-item";

export interface FAQItemData {
  question: string;
  answer: string;
}

export function FAQAccordion({ items }: { items: FAQItemData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
