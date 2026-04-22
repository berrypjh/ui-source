import { execSync } from 'child_process';
import { ReleaseClient } from 'nx/release';

const LOCAL_REGISTRY = 'http://localhost:4873';

const checkRegistry = () => {
  try {
    execSync(`curl -sf ${LOCAL_REGISTRY} > /dev/null`, { stdio: 'pipe' });
  } catch {
    console.error(`Local registry is not running at ${LOCAL_REGISTRY}`);
    console.error('Run "pnpm local-registry" in another terminal first.');
    process.exit(1);
  }
};

const restorePackageJsonFiles = () => {
  try {
    const changed = execSync('git diff --name-only', { encoding: 'utf-8' })
      .split('\n')
      .filter((f) => f.endsWith('package.json') && f.startsWith('libs/'));

    if (changed.length > 0) {
      execSync(`git checkout -- ${changed.join(' ')}`, { stdio: 'pipe' });
    }
  } catch {
    console.warn(
      'Could not restore package.json files. Run: git checkout -- "libs/**/package.json"',
    );
  }
};

const client = new ReleaseClient({
  version: {
    preserveMatchingDependencyRanges: false,
  },
});

const main = async () => {
  checkRegistry();

  const { releaseGraph } = await client.releaseVersion({
    specifier: '0.0.0-e2e',
    stageChanges: false,
    gitCommit: false,
    gitTag: false,
    firstRelease: true,
    versionActionsOptionsOverrides: {
      skipLockFileUpdate: true,
    },
  });

  const publishResult = await client.releasePublish({
    releaseGraph,
    tag: 'e2e',
    firstRelease: true,
    registry: LOCAL_REGISTRY,
  });

  restorePackageJsonFiles();

  const allOk = Object.values(publishResult).every((result) => result.code === 0);
  process.exit(allOk ? 0 : 1);
};

main().catch((error) => {
  restorePackageJsonFiles();
  console.error('Local registry 배포 실패:', error);
  process.exit(1);
});
