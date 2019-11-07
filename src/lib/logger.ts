import { createLogger, transports, format } from 'winston'

export default createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(format.colorize(), format.simple())
    })
  ]
})
