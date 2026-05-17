// SEO keywords used in schemas.js and per-page metadata

// Identity
export const IDENTITY_KEYWORDS = [
  'Soumyadeep Pradhan', 'Soumya Pradhan', 'Soumya',
  'soumyadeep', 'heysoumyadeep', 'soumya.io', 'Pradhan',
];

// Role
export const ROLE_KEYWORDS = [
  'Full-Stack Developer', 'Full Stack Developer', 'Software Engineer',
  'SDE2', 'Software Engineer II', 'JPMorgan Chase', 'JPMC',
  'software engineer India', 'developer portfolio',
];

// Tech stack
export const TECH_KEYWORDS = [
  'React', 'React developer', 'Node.js', 'JavaScript', 'TypeScript',
  'Java', 'Spring Boot', 'AWS', 'Docker', 'PostgreSQL', 'Redis',
  'Kafka', 'Python', 'REST API', 'microservices', 'full stack web development',
];

// Projects
export const PROJECT_KEYWORDS = [
  'developer tools', 'full stack web development',
  'internal platform tooling', 'engineering productivity',
];

// Blog topics
export const BLOG_KEYWORDS = [
  'software engineering blog', 'engineering career advice', 'SDE2 lessons',
  'mid-level engineering', 'software craft', 'developer growth',
  'code review best practices', 'scope management', 'AI in software development',
];

// Per-post keywords, add one for each new post
export const POST_KEYWORDS = {
  'sde2-lessons': [
    'SDE2 lessons learned', 'first year SDE2', 'mid-level engineer tips',
    'software engineer career growth', 'SDE1 to SDE2 promotion',
    'engineering scope creep', 'code review teaching',
    'reduce uncertainty engineering', 'software engineer career advice',
  ],
  'singing-and-software': [
    'hobbies make better engineers', 'music and software engineering',
    'deliberate practice programming', 'software craft essay',
    'restraint in code', 'iteration without ego',
    'classical music software', 'creative hobbies engineering',
  ],
  'database-indexing-explained': [
    'database indexing explained', 'how database indexes work',
    'B-Tree index explained', 'LSM tree vs B-Tree', 'hash index database',
    'PostgreSQL EXPLAIN ANALYZE', 'composite index leftmost prefix',
    'covering index postgres', 'database performance optimization',
    'CREATE INDEX SQL', 'database internals',
  ],
  // 'building-my-portfolio': [
  //   'portfolio architecture', 'React portfolio', 'Vite portfolio',
  //   'MDX blog', 'custom Vite plugins', 'SSG React',
  //   'flash-free theming', 'performance optimization React',
  //   'portfolio SEO', 'developer portfolio best practices',
  // ],
  'rag-chunking-indexing': [
    'RAG chunking strategies', 'vector database indexing',
    'semantic chunking', 'embedding optimization',
    'RAG retrieval accuracy', 'chunking best practices',
    'vector search optimization', 'LLM context window',
  ],
};

export const SITE_KEYWORDS_STRING = [
  ...IDENTITY_KEYWORDS, ...ROLE_KEYWORDS,
  ...TECH_KEYWORDS, ...PROJECT_KEYWORDS, ...BLOG_KEYWORDS,
].join(', ');

export const KNOWS_ABOUT = [
  'Full-Stack Development', 'React', 'Node.js', 'Java', 'Spring Boot',
  'AWS', 'Artificial Intelligence', 'Developer Tools', 'Software Architecture',
  'TypeScript', 'Python', 'Microservices', 'Database Indexing',
  'PostgreSQL', 'System Design', 'Code Review', 'Engineering Career Growth',
];

export function getPostKeywords(slug) {
  return POST_KEYWORDS[slug] ?? BLOG_KEYWORDS;
}
