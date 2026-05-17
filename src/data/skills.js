export const skillCategories = [
  {
    category: 'DAILY DRIVERS',
    skills: [
      { name: 'C#', color: '#239120', textColor: '#fff' },
      { name: 'C++', color: '#00599C', textColor: '#fff' },
      { name: '.NET', color: '#512BD4', textColor: '#fff' },
      { name: 'Angular', color: '#DD0031', textColor: '#fff' },
      { name: 'TypeScript', color: '#3178C6', textColor: '#fff' },
    ]
  },
  {
    category: 'COMFORTABLE WITH',
    skills: [
      { name: 'JavaScript', color: '#F7DF1E', textColor: '#000' },
      { name: 'PostgreSQL', color: '#4169E1', textColor: '#fff' },
      { name: 'Redis', color: '#DC382D', textColor: '#fff' },
      { name: 'React', color: '#61DAFB', textColor: '#000' },
      { name: 'Node.js', color: '#339933', textColor: '#fff' },
      { name: 'Docker', color: '#2496ED', textColor: '#fff' },
      { name: 'Kafka', color: '#231F20', textColor: '#fff' },
      { name: 'AWS', color: '#FF9900', textColor: '#000' },
      { name: 'C', color: '#A8B9CC', textColor: '#000' },
    ]
  },
  {
    category: 'CURRENTLY EXPLORING',
    skills: [
      { name: 'Java', color: '#ED8B00', textColor: '#fff' },
      { name: 'Spring Boot', color: '#6DB33F', textColor: '#fff' },
      { name: 'AWS Bedrock', color: '#FF9900', textColor: '#000' },
      { name: 'RAG Patterns', color: '#8B5CF6', textColor: '#fff' },
      { name: 'LangChain', color: '#1C3C3C', textColor: '#fff' },
      { name: 'Vector DBs', color: '#10B981', textColor: '#fff' },
      { name: 'Prompt Engineering', color: '#F59E0B', textColor: '#000' },
    ]
  }
];

// Legacy export for backward compatibility
export const skills = skillCategories.flatMap(cat => cat.skills);
