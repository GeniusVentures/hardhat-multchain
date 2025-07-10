import { JsonRpcProvider } from "@ethersproject/providers";
import { ChainConfigError, NetworkConnectionError, ProcessCleanupError } from "./chainManager";
import { MultiChainProviders } from "./type-extensions";
export declare function getProvider(networkName: string): JsonRpcProvider;
export declare function getMultichainProviders(): MultiChainProviders;
export { ChainConfigError, NetworkConnectionError, ProcessCleanupError };
export { default as multichain } from "./chainManager";
export {};
//# sourceMappingURL=index.d.ts.map