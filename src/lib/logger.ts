import { createLogger, transports, format, Logger } from 'winston'

const logger: Logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(format.colorize(), format.simple())
    })
  ]
})

export default logger
