import { readFileAsync } from './fsAsync'
import * as Mustache from 'mustache'
import * as path from 'path'

const TEMPLATE_FOLDER = path.join(__dirname, '..', '..', 'templates')

const SERVICE_TEMPLATE: string = path.join(TEMPLATE_FOLDER, 'service.mustache')
const INDEX_TEMPLATE: string = path.join(TEMPLATE_FOLDER, 'index.mustache')

const parsedTemplates: { [key: string]: string } = {}

const loadTemplate = async (templatefile: string, name: string) => {
  if (!parsedTemplates[name]) {
    parsedTemplates[name] = await readFileAsync(templatefile, 'utf8')
    Mustache.parse(parsedTemplates[name])
  }
  return parsedTemplates[name]
}

export const getServiceTemplate = async () => {
  return loadTemplate(SERVICE_TEMPLATE, 'service')
}

export const getIndexTemplate = async () => {
  return loadTemplate(INDEX_TEMPLATE, 'index')
}
