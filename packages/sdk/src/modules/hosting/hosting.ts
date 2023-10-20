import { ApillonModule } from '../../lib/apillon';
import { HostingWebsite } from './hosting-website';

export class Hosting extends ApillonModule {
  /**
   * @dev Returns an website instance.
   * @param uuid Unique website identifier.
   * @returns An instance of Website.∂
   */
  public website(uuid: string): HostingWebsite {
    return new HostingWebsite(this.api, this.logger, uuid);
  }
}
