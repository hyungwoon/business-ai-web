/**
 * Server-side SKILL.md loader
 * Reads plugin skill files and builds system prompts (runs only on Next.js server)
 */
import fs from 'fs'
import path from 'path'

const PLUGINS_DIR = path.join(process.cwd(), 'plugins')

function loadSkill(pluginName: string, skillName: string): string {
  const skillPath = path.join(PLUGINS_DIR, pluginName, 'skills', skillName, 'SKILL.md')
  if (!fs.existsSync(skillPath)) return ''
  const content = fs.readFileSync(skillPath, 'utf-8')
  // Strip frontmatter
  if (content.startsWith('---')) {
    const parts = content.split('---')
    if (parts.length >= 3) return parts.slice(2).join('---').trim()
  }
  return content.trim()
}

function loadAllSkills(pluginName: string): string {
  const skillsDir = path.join(PLUGINS_DIR, pluginName, 'skills')
  if (!fs.existsSync(skillsDir)) return ''
  const skills = fs.readdirSync(skillsDir).filter(d =>
    fs.existsSync(path.join(skillsDir, d, 'SKILL.md'))
  )
  return skills.map(skill => loadSkill(pluginName, skill)).filter(Boolean).join('\n\n---\n\n')
}

/** Agent → [plugin names] mapping (mirrors Python agent plugin_names) */
const AGENT_PLUGIN_MAP: Record<string, string[]> = {
  marketing: ['marketing'],
  research: ['marketing', 'sales', 'data'],
  writing: ['marketing', 'sales', 'customer-support'],
  hr: ['hr', 'productivity'],
  finance: ['finance', 'data'],
  legal: ['legal', 'enterprise-search'],
  sales: ['sales'],
  data: ['data'],
  product: ['product-management', 'marketing'],
  development: ['development', 'data', 'cowork-plugin-management'],
  design: ['design', 'marketing'],
  productivity: ['productivity'],
  pr: ['pr', 'marketing'],
  security: ['security', 'data'],
  compliance: ['compliance', 'data'],
  business_dev: ['business-dev', 'marketing', 'sales'],
}

/** Build skills context string for an agent */
export function buildSkillsForAgent(agentKey: string): string {
  const plugins = AGENT_PLUGIN_MAP[agentKey] ?? []
  const parts: string[] = []
  for (const plugin of plugins) {
    const content = loadAllSkills(plugin)
    if (content) parts.push(content)
  }
  return parts.join('\n\n---\n\n')
}
