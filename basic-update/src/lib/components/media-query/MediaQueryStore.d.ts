export interface MediaQueryMap {
  [key: string]: string;
}

export type MediaQueryMatchMap<K = string> = Record<K, boolean>;

export type MediaQueryEventListener = Parameters<typeof MediaQueryList.prototype.addListener>[0];

export interface MediaQueryStore extends Readable<MediaQueryMatchMap> {
  set(value: MediaQueryMap): void;
}
