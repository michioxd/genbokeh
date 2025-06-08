export const formatTime = (ms: number) => {
    if (ms <= 100) {
        return `${ms}ms`;
    } else {
        const seconds = ms / 1000;
        return `${seconds.toFixed(4)}s`;
    }
};