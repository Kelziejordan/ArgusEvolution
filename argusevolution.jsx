// filepath: src/components/ArgosBootstrapper.jsx
import React, { useEffect, useMemo, useState } from 'react';

const DEFAULT_TREE = [
  'app/',
  'app/(auth)/login/',
  'app/(core)/dashboard/',
  'app/(core)/projects/',
  'app/(core)/projects/[projectId]/',
  'app/(core)/approvals/',
  'app/(core)/queue/',
  'app/(core)/memory/',
  'app/(core)/audit/',
  'app/(core)/settings/',
  'app/(core)/deploy/',
  'app/api/approvals/',
  'app/api/deploy/',
  'app/api/tasks/',
  'app/api/memory/',
  'app/api/audit/',
  'app/api/policy/',
  'components/layout/',
  'components/navigation/',
  'components/cards/',
  'components/tables/',
  'components/forms/',
  'components/dialogs/',
  'components/badges/',
  'components/audit/',
  'lib/auth/',
  'lib/routing/',
  'lib/policy/',
  'lib/approvals/',
  'lib/execution/',
  'lib/deployment/',
  'lib/logging/',
  'lib/memory/',
  'lib/brand/',
  'schemas/',
  'hooks/',
  'store/',
  'docs/',
  'public/brand/',
  'public/icons/'
];

const DEFAULT_FILES = [
  { path: 'schemas/user.ts', content: 'export const userSchema = {};
' },
  { path: 'schemas/project.ts', content: 'export const projectSchema = {};
' },
  { path: 'schemas/task.ts', content: 'export const taskSchema = {};
' },
  { path: 'schemas/approval.ts', content: 'export const approvalSchema = {};
' },
  { path: 'schemas/memory.ts', content: 'export const memorySchema = {};
' },
  { path: 'schemas/deployment.ts', content: 'export const deploymentSchema = {};
' },
  { path: 'schemas/audit.ts', content: 'export const auditSchema = {};
' },
  { path: 'schemas/policy.ts', content: 'export const policySchema = {};
' },
  { path: 'lib/policy/index.ts', content: 'export const policy = { version: "ArgOS Evolution v1" };
' },
  { path: 'docs/disclaimers/README.md', content: '# Disclaimers

Personal-use only. Verify all actions before irreversible changes.
' },
  { path: 'docs/governance/README.md', content: '# Governance

All external actions require policy approval.
' },
  { path: 'docs/brand/README.md', content: '# Brand

Built by KELZIEJORDAN.
' }
];

function normalizePath(value) {
  return String(value || '').trim().replace(/^\/+/, '').replace(/\\/g, '/');
}

function buildStructure(files) {
  const root = {};
  files.forEach((file) => {
    const parts = normalizePath(file.path).split('/').filter(Boolean);
    let node = root;
    parts.forEach((part, index) => {
      const isLeaf = index === parts.length - 1;
      if (!node[part]) node[part] = isLeaf ? '__file__' : {};
      if (!isLeaf) node = node[part];
    });
  });
  return root;
}

function renderTree(node, indent = '') {
  return Object.entries(node).map(([key, value]) => {
    if (value === '__file__') return `${indent}- ${key}`;
    return `${indent}- ${key}/
${renderTree(value, `${indent}  `)}`;
  }).join('
');
}

export default function ArgosBootstrapper() {
  const [files, setFiles] = useState(DEFAULT_FILES);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('Ready to generate structure.');

  const structureText = useMemo(() => renderTree(buildStructure(files)), [files]);

  useEffect(() => {
    setStatus('ready');
  }, []);

  const addDefaults = () => {
    setFiles((current) => {
      const merged = [...current];
      DEFAULT_FILES.forEach((file) => {
        if (!merged.some((item) => item.path === file.path)) merged.push(file);
      });
      return merged;
    });
    setMessage('Default ArgOS Evolution files prepared.');
  };

  const handleDownload = () => {
    const payload = JSON.stringify({ files, structure: structureText }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'argos-evolution-bootstrap.json';
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Bootstrap JSON generated for upload.');
  };

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 980, margin: '0 auto' }}>
      <h1>ArgOS Evolution Bootstrapper</h1>
      <p>{message}</p>
      <section aria-label="controls" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={addDefaults}>Load Default Structure</button>
        <button onClick={handleDownload}>Download Bootstrap JSON</button>
      </section>
      <section aria-label="status">
        <p>Status: {status}</p>
      </section>
      <section aria-label="tree">
        <h2>Directory Tree</h2>
        <pre style={{ background: '#f5f5f5', padding: 16, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{structureText}</pre>
      </section>
      <section aria-label="files">
        <h2>Prepared Files</h2>
        <ul>
          {files.map((file) => (
            <li key={file.path}>{file.path}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
