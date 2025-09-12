export const PAGE_SIZES = [5, 10, 20] as const;

export type PageSize = (typeof PAGE_SIZES)[number];

export const DEFAULT_PAGE_SIZE: PageSize = 10;
export const DEFAULT_CURRENT_PAGE = 1;
