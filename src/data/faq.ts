export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "How do you start a new software project?",
    answer:
      "We start with a conversation about the product, the users, and what the first release has to do. If there is a fit, we follow with discovery and a written proposal. Scope, timing, and commercial terms are agreed there. They are not assumed from this website.",
  },
  {
    question: "Can you improve an existing application?",
    answer:
      "Yes, when we can see the current product and the problem you want changed. We review the codebase or the product surface first, then recommend whether to extend it, stabilize it, or replace a part of it. We do not promise a rewrite before that review.",
  },
  {
    question: "Do you build both web and mobile apps?",
    answer:
      "The practice covers custom web applications and mobile applications, including iOS, Android, and cross-platform work. Which path fits a product is decided in planning, not assumed for every inquiry.",
  },
  {
    question: "Can you integrate AI into existing software?",
    answer:
      "We can add AI features such as assistants, retrieval over your own content, and workflow automation when the product and the data support them. A useful integration starts with the task the software should perform, not with a model name.",
  },
  {
    question: "How do you manage testing and deployment?",
    answer:
      "Testing and release are part of the delivery plan. Critical paths are checked before a release, and deployment is set up so it can be repeated. The exact tooling is chosen for the project and written into the proposal.",
  },
  {
    question: "What happens after product launch?",
    answer:
      "Support after launch is agreed before the project starts. That can include a fix window, monitoring, or a next phase of improvements. This website does not include an open-ended support promise.",
  },
];
