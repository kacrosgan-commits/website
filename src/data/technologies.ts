/**
 * Working catalog aligned with the nine roles.
 * This is not a certification list. Edit it when the team's confirmed stack changes.
 */
export const technologyGroups = [
  {
    label: "Frontend",
    items: ["React", "Next.js", "TypeScript"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Python", "Go"],
  },
  {
    label: "Mobile",
    items: ["Flutter", "React Native", "Swift", "Kotlin"],
  },
  {
    label: "AI",
    items: ["LLM APIs", "RAG", "AI agents", "Vector search"],
  },
  {
    label: "Data",
    items: ["PostgreSQL", "MySQL", "Redis"],
  },
  {
    label: "Cloud",
    items: ["AWS", "Docker", "Kubernetes", "CI/CD"],
  },
] as const;
