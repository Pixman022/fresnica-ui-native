export type UiLocale = Readonly<{
    close: string;
    loading: string;
}>;

export const enUS: UiLocale = {
    close: 'Close',
    loading: 'Loading',
};

export const zhCN: UiLocale = {
    close: '关闭',
    loading: '加载中',
};
