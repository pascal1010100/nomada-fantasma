import { spawn } from 'node:child_process';

type Step = {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
};

const RUN_E2E = process.env.VERIFY_RELEASE_E2E === '1';
const CHECK_REMOTE = process.env.VERIFY_RELEASE_REMOTE === '1';

const steps: Step[] = [
  { name: 'TypeScript', command: 'pnpm', args: ['typecheck'] },
  { name: 'ESLint', command: 'pnpm', args: ['lint'] },
  { name: 'Unit tests', command: 'pnpm', args: ['test', '--', '--run'] },
  { name: 'Production build', command: 'pnpm', args: ['build'] },
  { name: 'Local migration dry-run', command: 'supabase', args: ['db', 'push', '--local', '--dry-run'] },
];

if (CHECK_REMOTE) {
  steps.push({
    name: 'Remote migration dry-run',
    command: 'supabase',
    args: ['db', 'push', '--dry-run'],
  });
}

if (RUN_E2E) {
  steps.push({
    name: 'Local booking E2E',
    command: 'pnpm',
    args: ['test:e2e:booking'],
    env: {
      RESEND_API_KEY: '',
    },
  });
}

function runStep(step: Step): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`\n==> ${step.name}`);
    console.log(`$ ${step.command} ${step.args.join(' ')}`);

    const child = spawn(step.command, step.args, {
      stdio: 'inherit',
      shell: false,
      env: {
        ...process.env,
        ...step.env,
      },
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${step.name} failed with exit code ${code ?? 'unknown'}`));
    });
  });
}

async function main() {
  console.log('Release verification started');
  console.log(`- Remote dry-run: ${CHECK_REMOTE ? 'enabled' : 'disabled'}`);
  console.log(`- Booking E2E: ${RUN_E2E ? 'enabled' : 'disabled'}`);

  for (const step of steps) {
    await runStep(step);
  }

  console.log('\nRelease verification passed');
}

main().catch((error) => {
  console.error('\nRelease verification failed');
  console.error(error);
  process.exit(1);
});
