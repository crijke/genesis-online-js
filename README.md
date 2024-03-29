# GenesisOnline.js

## JS client for the Genesis Online SOAP API of regionalstatistik.de

GenesisOnline.js is a client to access the SOAP API of regionalstatistik.de with a familiar,
async/await compatible interface.

### User Guide

Import a service and directly call any of its methods. Note that the service methods are asynchronous
and return promises. 

Example with async/await:
```js
import { rechercheService2010 } from 'genesis-online-js'

const callService = async () => {
  const response = await rechercheService2010.merkmalsKatalog({
    kennung: '<userid>',
    passwort: '<password>',
    kriterium: 'Code',
    filter: '*',
    bereich: 'Alle',
    listenLaenge: '500',
    sprache: 'de',
    typ: 'Wert'
  })
  console.log('Recherche service returned:', response)
}

callService()
```

Services and input arguments have type definitions, so you can use auto-completion in your editor. 
The response is untyped currently.

### Developer Guide

Service wrappers are written in TypeScript and automatically generated from the WSDL descriptions
of the SOAP Services. 

Use ```yarn generate``` to generate the services in directory ```srcGen```

Use ```yarn build``` to generate the services and compile to JavaScript along with type
definitions. Output will be in directory ```dist```

Use ```yarn clean``` to delete generated services and build files.



