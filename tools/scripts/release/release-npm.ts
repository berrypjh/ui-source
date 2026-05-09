import { execSync } from 'node:child_process';

import { releaseChangelog, releasePublish, releaseVersion } from 'nx/release';

/**
 * 직전 release tag 이후 commit 본문에 BREAKING CHANGE footer가 있는지 확인합니다.
 *
 * nx release의 conventionalCommits scope 매칭은 full npm name(@scope/pkg)을 요구하지만,
 * 현재 프로젝트 commit scope는 short name(react-ui 등)이라 자동 매칭이 안 되므로, 여기서 직접 감지해 major 강제 여부를 결정합니다.
 */
const hasBreakingChangeSinceLastTag = (): boolean => {
  try {
    const lastTag = execSync('git describe --tags --abbrev=0 --match="v*"', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!lastTag) return false;
    const log = execSync(`git log ${lastTag}..HEAD --format=%B`, { encoding: 'utf8' });
    return /^BREAKING CHANGE:/m.test(log);
  } catch {
    return false;
  }
};

const main = async () => {
  const isFirstRelease = process.argv.includes('--first-release');
  const isBeta = process.argv.includes('--beta') || process.argv.includes('--preid=beta');
  const hasBreaking = !isBeta && hasBreakingChangeSinceLastTag();

  if (hasBreaking) {
    console.log('직전 tag 이후 BREAKING CHANGE 감지 — major bump를 강제합니다.');
  }

  const specifier = isBeta ? 'prerelease' : hasBreaking ? 'major' : undefined;

  const { workspaceVersion, projectsVersionData, releaseGraph } = await releaseVersion({
    firstRelease: isFirstRelease,
    specifier,
    preid: isBeta ? 'beta' : undefined,
  });

  await releaseChangelog({
    versionData: projectsVersionData,
    version: workspaceVersion,
    releaseGraph,
    firstRelease: isFirstRelease,
  });

  const publishResult = await releasePublish({
    releaseGraph,
    registry: 'https://npm.pkg.github.com',
    access: 'public',
    firstRelease: isFirstRelease,
    tag: isBeta ? 'beta' : undefined,
  });

  const allOk = Object.values(publishResult).every((result) => result.code === 0);

  process.exit(allOk ? 0 : 1);
};

main().catch((error) => {
  console.error('예상치 못한 오류 발생 (npm 배포):', error);
  process.exit(1);
});
