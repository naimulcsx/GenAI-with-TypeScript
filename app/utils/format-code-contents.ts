export function formatCodeContent(content: string, language: string) {
  return `\`\`\`${language}
${content}
\`\`\`
`;
}
