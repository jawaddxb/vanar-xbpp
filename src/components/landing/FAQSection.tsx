import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is xBPP?',
    answer: 'xBPP (Execution Boundary Permission Protocol) is the open standard for governing autonomous AI agent payments. It gives agents a declarative policy \u2014 what they can spend, with whom, and under what conditions \u2014 producing deterministic, auditable verdicts for every transaction.',
  },
  {
    question: 'What does xBPP stand for?',
    answer: 'xBPP stands for Execution Boundary Permission Protocol. The \u201cx\u201d signals extensibility across payment rails. The \u201cExecution Boundary\u201d is the decision point where an agent\u2019s spending intent meets policy enforcement before money moves.',
  },
  {
    question: 'How does xBPP work with x402?',
    answer: 'xBPP and x402 are complementary layers. x402 handles payment execution \u2014 moving money between parties using HTTP 402 flows. xBPP sits above it as the governance layer, deciding whether a payment should be allowed, blocked, or escalated before x402 executes it. Think of x402 as the engine and xBPP as the steering wheel.',
  },
  {
    question: 'What is an agent payment policy?',
    answer: 'A policy is a declarative JSON config that defines an agent\u2019s spending rules: per-transaction limits, daily/monthly budgets, approved counterparties, currency restrictions, time windows, and human escalation thresholds. Policies are evaluated deterministically \u2014 same input always yields the same verdict.',
  },
  {
    question: 'How do I add spending limits to AI agents?',
    answer: 'Install @vanarchain/xbpp, create a policy with your limits (max_single, max_daily, require_human_above), and wrap your x402 client. Every transaction is checked before execution. Setup takes under 60 seconds.',
  },
  {
    question: 'What is the difference between xBPP and x402?',
    answer: 'x402 answers \u201chow do I pay?\u201d \u2014 it is a payment execution protocol. xBPP answers \u201cshould I be allowed to pay?\u201d \u2014 it is a governance protocol. They work together: xBPP evaluates the policy, and if approved, x402 executes the payment.',
  },
  {
    question: 'What chains does xBPP support?',
    answer: 'xBPP is chain-agnostic by design. The reference implementation is built by VanarChain and optimised for Base, but the protocol works across any EVM-compatible chain and is designed to be extended to any payment rail.',
  },
  {
    question: 'Is xBPP open source?',
    answer: 'Yes. xBPP is an open standard with an open-source reference implementation. The specification, SDK, policy templates, and test suite are all freely available at github.com/Big-Immersive/rule-observer.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 relative" style={{ background: '#1B2129' }}>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-16">
          <div className="section-label mb-6" style={{ color: '#03D9AF' }}>
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2
            style={{
              fontFamily: "'Akira Expanded', 'Arial Black', sans-serif",
              fontSize: 'clamp(28px, 4vw, 48px)',
              lineHeight: 0.95,
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#ffffff',
            }}
          >
            EVERYTHING YOU NEED
            <br />
            TO <span style={{ color: '#03D9AF' }}>KNOW</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  background: isOpen
                    ? 'rgba(3, 217, 175, 0.06)'
                    : 'rgba(255, 255, 255, 0.03)',
                  borderLeft: isOpen ? '3px solid #03D9AF' : '3px solid transparent',
                  clipPath: 'polygon(16px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 16px)',
                  transition: 'all 0.3s ease',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span
                    className="font-medium text-base md:text-lg pr-4"
                    style={{
                      color: isOpen ? '#03D9AF' : '#e8e9e9',
                      fontFamily: "'Figtree', system-ui, sans-serif",
                    }}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 transition-transform duration-300',
                      isOpen && 'rotate-180'
                    )}
                    style={{ color: isOpen ? '#03D9AF' : '#6B6F7D' }}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <p
                    className="px-5 pb-5 text-sm md:text-base leading-relaxed"
                    style={{
                      color: '#CAD0DA',
                      fontFamily: "'Figtree', system-ui, sans-serif",
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
