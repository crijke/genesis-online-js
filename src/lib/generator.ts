import { Client, createClient } from 'soap'
import * as Mustache from 'mustache'
import * as path from 'path'
import logger from './logger'
import { camelize, pascalize } from 'humps'

import { appendFileAsync, readFileAsync, writeFileAsync } from './fsAsync'
import { getIndexTemplate, getServiceTemplate } from './templates'

interface Input {
  name: string
  type: string
}

interface Method {
  name: string
  camelizedName: string
  pascalizedName: string
  input: Input[]
}

interface Service {
  name: string
  camelizedName: string
  pascalizedName: string
  methods: Method[]
}

interface ClientDescription {
  url: string
  name: string
  services: Service[]
}

const getWritePath = (filename: string): string => {
  return path.join(__dirname, '..', '..', 'srcGen', filename)
}

const mapXsdType = (type: string) => {
  switch (type) {
    case 'xsd:string':
      return 'string'
    case 'xsd:boolean':
      return 'boolean'
    case 'xsd:byte':
      return 'number'
    default:
      throw new Error(`unknown type ${type}`)
  }
}

const mapInputToView = (input: { [key: string]: string }) =>
  Object.entries(input).map(([key, value]) => ({
    name: key,
    type: mapXsdType(value)
  }))

const writeClientFile = async (clientName: string, clientDescription: ClientDescription) => {
  const template = await getServiceTemplate()
  const generatedCode = Mustache.render(template, clientDescription)
  await writeFileAsync(getWritePath( `${clientName}.ts`), generatedCode)
}

const appendToIndexFile = async (clientName: string) => {
  const template = await getIndexTemplate()
  const generatedCode = Mustache.render(template, { clientName })
  await appendFileAsync(getWritePath('index.ts'), generatedCode)
}

const describe = async (url: string, client: Client): Promise<ClientDescription> => {
  const clientDescription: ClientDescription = {
    name: '',
    services: [],
    url
  }

  const schema = await client.describe()

  const root = Object.keys(schema)[0]
  logger.info(`found root ${root}`)
  clientDescription.name = camelize(root)

  const services = schema[root]
  const serviceNames = Object.keys(services)
  logger.info(`found services ${serviceNames}`)

  serviceNames.map(s => {
    logger.info(`generating view for service ${s}`)
    const service = services[s]
    const methodNames = Object.keys(service)
    logger.info(`found methods ${methodNames}`)
    const methods = methodNames.map(m => {
      const method = service[m]
      return {
        name: m,
        camelizedName: camelize(m),
        pascalizedName: pascalize(m),
        input: mapInputToView(method.input)
      }
    })
    clientDescription.services.push({
      name: s,
      camelizedName: camelize(s),
      pascalizedName: pascalize(s),
      methods
    })
  })
  return clientDescription
}

export const generateClient = async (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    return createClient(url, async (clientErr, client) => {
      if (clientErr) {
        reject(clientErr)
      }
      const clientDescription = await describe(url, client)

      const { name } = clientDescription
      logger.info(`generating code for client ${name}`)

      await writeClientFile(name, clientDescription)
      await appendToIndexFile(name)
      resolve()
    })
  })
}
