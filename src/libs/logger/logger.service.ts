import { Injectable, Logger, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  constructor(context?: string) {
    super(context);
  }

  log(message: any, context?: string) {
    super.log(message, context);
    this.pushToExternal('log', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.pushToExternal('error', message, context, trace);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    this.pushToExternal('warn', message, context);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    this.pushToExternal('debug', message, context);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
    this.pushToExternal('verbose', message, context);
  }

  private async pushToExternal(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ) {
    // TODO: integrate with CloudWatch, Datadog, or another log aggregator
    // Example: send JSON payload to an external logging service

    const payload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      trace,
      service: process.env.SERVICE_NAME || 'notification-service',
      env: process.env.NODE_ENV || 'development',
    };

    if (process.env.ENABLE_REMOTE_LOGGING === 'true') {
      try {
        // Example for CloudWatch/Datadog (replace with actual SDK/API calls)
        // await someLogClient.send(payload);
        console.log('[REMOTE LOG]', JSON.stringify(payload));
      } catch (err) {
        super.error(
          `Failed to push logs to external provider: ${err.message}`,
          err.stack,
          'LoggerService',
        );
      }
    }
  }
}
