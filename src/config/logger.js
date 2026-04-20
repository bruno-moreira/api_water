let logger;

try {
  const { default: pino } = await import("pino");

  logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport: {
      targets: [
        {
          target: "pino/file",
          options: { destination: "./logs/app.log", mkdir: true },
        },
      ],
    },
  });
} catch {
  logger = {
    info: (...args) => console.log(...args),
    debug: (...args) => console.debug(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
  };
}

export default logger;
