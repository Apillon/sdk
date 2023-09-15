import { DeployToEnvironment, Hosting } from '@apillon/sdk';

export async function deployWebsite(
  path: string,
  options: {
    uuid: string;
    preview?: boolean;
    key: string;
    secret: string;
    apiUrl?: string;
  },
) {
  const hosting = new Hosting({
    key: options.key,
    secret: options.secret,
    apiUrl: options?.apiUrl || undefined,
  });

  await hosting.uploadFromFolder(options.uuid, path);
  const deployment = await hosting.deployWebsite(
    options.uuid,
    options.preview
      ? DeployToEnvironment.TO_STAGING
      : DeployToEnvironment.DIRECTLY_TO_PRODUCTION,
  );
  const deploymentData = await hosting.getWebsiteDeployments(
    options.uuid,
    deployment.id,
  );
  console.log(deploymentData);
}
