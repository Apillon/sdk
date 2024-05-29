import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList } from '../../types/apillon';
import { IWebsiteFilters } from '../../types/hosting';
import { HostingWebsite } from './hosting-website';

export class Hosting extends ApillonModule {
  /**
   * Base API url for hosting.
   */
  private API_PREFIX = '/hosting';

  /**
   * List all websites
   * @param {IWebsiteFilters} params Query filters for listing websites
   * @returns A list of HostingWebsite instances.
   */
  public async listWebsites(
    params?: IWebsiteFilters,
  ): Promise<IApillonList<HostingWebsite>> {
    const url = constructUrlWithQueryParams(
      `${this.API_PREFIX}/websites`,
      params,
    );

    const data = await ApillonApi.get<IApillonList<HostingWebsite>>(url);

    return {
      ...data,
      items: data.items.map(
        (website) => new HostingWebsite(website['websiteUuid'], website),
      ),
    };
  }

  /**
   * @param uuid Unique website identifier.
   * @returns An instance of HostingWebsite.
   */
  public website(uuid: string): HostingWebsite {
    return new HostingWebsite(uuid);
  }

  /**
   * Generate a short link for a given target URL
   * @param {string} targetUrl - The targer URL to generate a shortened URL for
   * @returns `id`: the short URL slug, `url`: the short URL, `targetUrl`: the target URL which the short link points to
   */
  public async generateShortUrl(
    targetUrl: string,
  ): Promise<{ id: string; url: string; targetUrl: string }> {
    return await ApillonApi.post<any>(`${this.API_PREFIX}/short-url`, {
      targetUrl,
    });
  }
}
