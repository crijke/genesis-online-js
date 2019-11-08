import { createClient } from 'soap'
import * as Mustache from 'mustache'
import * as path from 'path'
import logger from './logger'
import { camelize, pascalize } from 'humps'

import { readFileAsync } from './fsAsync'

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

interface View {
  url: string
  rootName: string
  services: Service[]
}

interface CodeGenerationResult {
  view: View
  generatedCode: string
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

export const generateClient = async (url: string): Promise<CodeGenerationResult> => {
  return new Promise((resolve, reject) => {
    return createClient(url, async (clientErr, client) => {
      if (clientErr) {
        reject(clientErr)
      }

      const template = await readFileAsync(path.join(__dirname, '..', '..', 'templates', 'service.mustache'), 'utf8')
      Mustache.parse(template)

      const view: View = {
        rootName: '',
        services: [],
        url
      }

      const schema = await client.describe()
      const root = Object.keys(schema)[0]
      logger.info(`found root ${root}`)
      view.rootName = root

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
        view.services.push({
          name: s,
          camelizedName: camelize(s),
          pascalizedName: pascalize(s),
          methods
        })
      })

      resolve({
        view,
        generatedCode: Mustache.render(template, view)
      })
    })
  })
}
