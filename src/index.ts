import * as path from 'path'
import { camelize } from 'humps'

import { generateClient } from './lib/generator'
import { writeFileAsync } from './lib/fsAsync'
import logger from './lib/logger'

const regionalStatistikWsdl = [
  'https://www.regionalstatistik.de/genesisws/services/RechercheService_2010?wsdl',
  'https://www.regionalstatistik.de/genesisws/services/DownloadService_2010?wsdl',
  'https://www.regionalstatistik.de/genesisws/services/ExportService_2010?wsdl'
]

const generateServiceClient = async (url: string) => {
  logger.info(`generating client for ${url}`)
  const { view, generatedCode } = await generateClient(url)
  const filename = `${camelize(view.rootName)}.ts`
  logger.info(`writing file ${filename}`)
  writeFileAsync(path.join(__dirname, '..', 'srcGen', filename), generatedCode)
  logger.info('SOAP client generated')
}

Promise.all(regionalStatistikWsdl.map(url => generateServiceClient(url)))
