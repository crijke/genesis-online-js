import { generateClient } from './lib/generator'
import logger from './lib/logger'

const regionalStatistikWsdl = [
  'https://www.regionalstatistik.de/genesisws/services/RechercheService_2010?wsdl',
  'https://www.regionalstatistik.de/genesisws/services/DownloadService_2010?wsdl',
  'https://www.regionalstatistik.de/genesisws/services/ExportService_2010?wsdl'
]

const generateServiceClient = async (url: string) => {
  logger.info(`generating client for ${url}`)
  await generateClient(url)
}

Promise.all(regionalStatistikWsdl.map(url => generateServiceClient(url)))
