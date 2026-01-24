import { releaseVersion, releasePublish } from 'nx/release';

const main = async () => {
  // e2e / local test용 버전 고정
  const { releaseGraph } = await releaseVersion({
    specifier: '0.0.0-e2e',
    stageChanges: false,
    gitCommit: false,
    gitTag: false,
    firstRelease: true,
    versionActionsOptionsOverrides: {
      skipLockFileUpdate: true,
    },
  });

  const publishResult = await releasePublish({
    releaseGraph,
    tag: 'e2e',
    firstRelease: true,
  });

  const allOk = Object.values(publishResult).every((result) => result.code === 0);

  process.exit(allOk ? 0 : 1);
};

main().catch((error) => {
  console.error('예상치 못한 오류 발생 (local-registry 배포):', error);
  process.exit(1);
});
