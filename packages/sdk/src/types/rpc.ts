export type RpcEndpoint = {
  id: number;
  name: string;
  imageUrl: string;
  type: string;
  version: string;
  nodes: Array<{
    id: number;
    https: string;
    wss: string;
    nodeType: string;
    type: string;
    version: string;
  }>;
  networkName: string;
  networkId: number;
};
