const GROQ_API_KEYS = process.env.GROQ_API_KEY
  ? [process.env.GROQ_API_KEY]
  : [];

const GROQ_API_KEY = process.env.GROQ_API_KEY || GROQ_API_KEYS[0] || "";
const TOXIC_API_KEY = process.env.API_KEY || "_0u5aff45,_0l1876s8qc";
const TOXIC_API_FALLBACK = process.env.API_FALLBACK || "gifted";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

export { GROQ_API_KEYS, GROQ_API_KEY, TOXIC_API_KEY, TOXIC_API_FALLBACK, GITHUB_TOKEN };
