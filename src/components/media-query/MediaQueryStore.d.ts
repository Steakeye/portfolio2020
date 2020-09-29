export interface MediaQueryMap {
    [key: string]: string;
}

// export interface MediaQueryMatchMap<K> extends Record<K, boolean> {}
export type MediaQueryMatchMap<K = string> = Record<K, boolean>

// export type MediaQueryEventListener = (this: MediaQueryList, ev: MediaQueryListEvent) => any;
export type MediaQueryEventListener = Parameters<typeof MediaQueryList.prototype.addListener>[0];

export interface MediaQueryStore extends Readable<MediaQueryMatchMap> {
    set(value: MediaQueryMap): void;
}