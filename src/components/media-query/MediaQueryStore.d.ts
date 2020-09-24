export interface MediaQueryMap {
    [key: string]: string;
}

//export type MediaQueryEventListener = (this: MediaQueryList, ev: MediaQueryListEvent) => any;
export type MediaQueryEventListener = Parameters<typeof MediaQueryList.prototype.addListener>[0];