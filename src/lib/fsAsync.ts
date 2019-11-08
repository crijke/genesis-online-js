import { promisify } from 'util'
import * as fs from 'fs';

export const readFileAsync = promisify(fs.readFile)
export const writeFileAsync = promisify(fs.writeFile)
export const appendFileAsync = promisify(fs.appendFile)
