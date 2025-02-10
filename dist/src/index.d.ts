import { JsonRpcProvider } from "@ethersproject/providers";
import { MultiChainProviders } from "./type-extensions";
export declare function getProvider(networkName: string): JsonRpcProvider;
export declare function getMultichainProviders(): MultiChainProviders;
export { default as multichain } from "./chainManager";
export {};
//# sourceMappingURL=index.d.ts.map