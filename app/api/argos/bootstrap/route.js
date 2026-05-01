import { promises as fs } from 'fs';
import path from 'path';

const ALLOWED_ROOTS = new Set(['app', 'components', 'lib', 'schemas', 'hooks', 'store', 'docs', 'public']);

const DEFAULT_TREE =[
  'app/(auth)/login/page.jsx', 'app/(core)/dashboard/page.jsx', 'app/(core)/projects/page.jsx',
  'app/(core)/projects/[projectId]/page.jsx', 'app/(core)/approvals/page.jsx', 'app/(core)/queue/page.jsx',
  'app/(core)/memory/page.jsx', 'app/(core)/audit/page.jsx', 'app/(core)/settings/page.jsx',
  'app/(core)/deploy/page.jsx', 'app/api/approvals/route.js', 'app/api/deploy/route.js',
  'app/api/tasks/route.js', 'app/api/memory/route.js', 'app/api/audit/route.js', 'app/api/policy/route.js',
  'components/layout/AppShell.jsx', 'components/navigation/Sidebar.jsx', 'components/cards/ProjectCard.jsx',
  'components/tables/AuditTable.jsx', 'components/forms/TaskForm.jsx', 'components/dialogs/ApprovalDialog.jsx',
  'components/badges/StatusBadge.jsx', 'components/audit/AuditTimeline.jsx', 'lib/policy/index.js',
  'lib/routing/index.js', 'lib/approvals/index.js', 'lib/execution/index.js', 'lib/deployment/index.js',
  'lib/logging/index.js', 'lib/memory/index.js', 'lib/brand/index.js', 'schemas/user.js', 'schemas/project.js',
  'schemas/task.js', 'schemas/approval.js', 'schemas/memory.js', 'schemas/deployment.js', 'schemas/audit.js',
  'schemas/policy.js', 'hooks/useAuth.js', 'hooks/useProjects.js', 'hooks/useApprovals.js', 'hooks/useMemory.js',
  'hooks/useDeploymentQueue.js', 'hooks/useAuditLog.js', 'hooks/useTaskExecutor.js', 'store/session/index.js',
  'store/projects/index.js', 'store/approvals/index.js', 'store/memory/index.js', 'store/audit/index.js',
  'docs/disclaimers/README.md', 'docs/governance/README.md', 'docs/brand/README.md', 'public/brand/.keep',
  'public/icons/.keep'
];

const DEFAULT_FILES = {
  'app/(auth)/login/page.jsx': `export default function LoginPage() {\n  return <main>Login</main>;\n}\n`,
  'app/(core)/dashboard/page.jsx': `export default function DashboardPage() {\n  return <main>Dashboard</main>;\n}\n`,
  'docs/disclaimers/README.md': '# Disclaimers\n\nPersonal-use only. Verify all actions before irreversible changes.\n',
  'docs/governance/README.md': '# Governance\n\nAll external actions require policy approval.\n',
  'docs/brand/README.md': '# Brand\n\nBuilt by KELZIEJORDAN.\n',
  'lib/policy/index.js': `export const policy = {\n  version: 'ArgOS Evolution v1',\n  approvedAppsOnly: true\n};\n`,
  'schemas/user.js': `export const userSchema = {};\n`,
  'schemas/project.js': `export const projectSchema = {};\n`
};

function isSafeRelative(filePath) {
  const normalized = filePath.replace(/\\/g, '/').replace(/^\/+/, '');
  const root = normalized.split('/')[0];
  return ALLOWED_ROOTS.has(root) && !normalized.includes('..');
}

async function ensureFile(rootDir, relPath) {
  const fullPath = path.join(rootDir, relPath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  if (!DEFAULT_FILES[relPath]) {
    try {
      await fs.access(fullPath);
      return { path: relPath, created: false };
    } catch {
      await fs.writeFile(fullPath, '', 'utf8');
      return { path: relPath, created: true };
    }
  }
  await fs.writeFile(fullPath, DEFAULT_FILES[relPath], 'utf8');
  return { path: relPath, created: true };
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const rootDir = typeof payload.rootDir === 'string' && payload.rootDir.trim() ? payload.rootDir.trim() : process.cwd();
    const inputFiles = Array.isArray(payload.files) ? payload.files : DEFAULT_TREE;
    const files = inputFiles.filter((value) => typeof value === 'string').map((value) => value.trim()).filter(Boolean);

    for (const filePath of files) {
      if (!isSafeRelative(filePath)) {
        return Response.json({ ok: false, error: `Blocked path: ${filePath}` }, { status: 400 });
      }
    }

    const results =[];
    for (const filePath of files) {
      results.push(await ensureFile(rootDir, filePath));
    }
    return Response.json({ ok: true, rootDir, results });
  } catch (error) {
    return Response.json({ ok: false, error: error?.message ?? 'Unknown error' }, { status: 500 });
  }
}
