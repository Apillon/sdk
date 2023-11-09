import { IWebsiteFilters } from '../../docs-index';
import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList, IApillonListResponse } from '../../types/apillon';
import { HostingWebsite } from './hosting-website';

export class Hosting extends ApillonModule {
  /**
   * Base API url for hosting.
   */
  private API_PREFIX = '/hosting/websites';

  /**
   * @param {IWebsiteFilters} params Query filters for listing websites
   * @returns A list of HostingWebsite instances.
   */
  public async listWebsites(
    params?: IWebsiteFilters,
  ): Promise<IApillonList<HostingWebsite>> {
    const url = constructUrlWithQueryParams(this.API_PREFIX, params);

    const { data } = await ApillonApi.get<IApillonListResponse<HostingWebsite>>(
      url,
    );

    return {
      items: data.items.map(
        (website) => new HostingWebsite(website['websiteUuid'], website),
      ),
      total: data.total,
    };
  }

  /**
   * @param uuid Unique website identifier.
   * @returns An instance of HostingWebsite.
   */
  public website(uuid: string): HostingWebsite {
    return new HostingWebsite(uuid);
  }
}
