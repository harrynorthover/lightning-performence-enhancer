const isObjectLiteral = (value) => {
  return typeof value === 'object' && value && value.constructor === Object
}

const isUcChar = (charcode) => {
  return charcode >= 65 && charcode <= 90
}

const isObject = (value) => {
  const type = typeof value
  return !!value && (type === 'object' || type === 'function')
}

const isFunction = (value) => {
  return typeof value === 'function'
}

const isNumber = (value) => {
  return typeof value === 'number'
}

const isInteger = (value) => {
  return (typeof value === 'number' && (value % 1) === 0)
}

const isBoolean = (value) => {
  return value === true || value === false
}

const isString = (value) => {
  return typeof value === 'string'
}

export const getTemplateFunc = (template, ctx = {}) => {
  return parseTemplate(template)
}

const parseTemplate = (obj) => {
  const context = {
    loc: [],
    store: [],
    rid: 0
  }

  parseTemplateRec(obj, context, 'element')

  return context.loc.join(';\n')
}

const parseTemplateRec = (obj, context, cursor) => {
  const store = context.store
  const loc = context.loc
  const keys = Object.keys(obj)

  keys.forEach(key => {
    const value = obj[key]
    if (isUcChar(key.charCodeAt(0))) {
      // Value must be expanded as well.
      if (isObjectLiteral(value)) {
        // Ref.
        const childCursor = `r${key.replace(/[^a-z0-9]/gi, '') + context.rid}`
        const type = value.type ? value.type : 'Element'
        if (type === 'Element') {
          loc.push(`var ${childCursor} = new Lightning.Element(stage)`)
        } else {
          store.push(type)
          loc.push(`var ${childCursor} = new Lightning.Element(stage)`)
        }
        loc.push(`${childCursor}.ref = "${key}"`)
        context.rid++

        // Enter sub.
        parseTemplateRec(value, context, childCursor)

        loc.push(`\nthis.childList.add(${childCursor})\n`)
      } else if (isObject(value)) {
        // Dynamic assignment.
        store.push(value)
        loc.push(`${cursor}.childList.add(store[${store.length - 1}])`)
      }
    } else {
      if (key === 'text') {
        const propKey = cursor + '__textTexture'
        loc.push(`var ${propKey} = new TextTexture()`)
        if (value.__propertyBinding === true) {
          // Allow binding entire objects to text property
          store.push(value)
          loc.push(`element.__bindProperty(store[${store.length - 1}], ${cursor}, "${key}")`)
        } else {
          parseTemplatePropRec(value, context, propKey)
        }
      } else if (key === 'shader' && isObjectLiteral(value)) {
        const shaderCursor = `${cursor}["shader"]`
        store.push(value)
        loc.push(`${cursor}["${key}"] = store[${store.length - 1}]`)
        parsePropertyBindings(value, context, shaderCursor)
      } else if (key === 'texture' && isObjectLiteral(value)) {
        const propKey = cursor + '__texture'
        const type = value.type
        if (type) {
          store.push(type)
          loc.push(`var ${propKey} = new store[${store.length - 1}](${cursor}.stage)`)
          parseTemplatePropRec(value, context, propKey)
          loc.push(`${cursor}["${key}"] = ${propKey}`)
        } else {
          loc.push(`${propKey} = ${cursor}.texture`)
          parseTemplatePropRec(value, context, propKey)
        }
      } else if (isObjectLiteral(value) && value.__propertyBinding === true) {
        store.push(value)
        loc.push(`element.__bindProperty(store[${store.length - 1}], ${cursor}, "${key}")`)
      } else {
        // Property;
        if (isNumber(value)) {
          loc.push(`${cursor}.${key} = ${value}`)
        } else if (isBoolean(value)) {
          loc.push(`${cursor}.${key} = ${value ? 'true' : 'false'}`)
        } else if (isObject(value) || Array.isArray(value)) {
          // Dynamic assignment.
          // Because literal objects may contain dynamics, we store the full object.
          store.push(value)
          loc.push(`${cursor}.${key} = store[${store.length - 1}]`)
        } else {
          // String etc.
          loc.push(`${cursor}.${key} = ${JSON.stringify(value)}`)
        }
      }
    }
  })
}

const parseTemplatePropRec = (obj, context, cursor) => {
  const store = context.store
  const loc = context.loc
  const keys = Object.keys(obj)
  keys.forEach(key => {
    if (key !== 'type') {
      const value = obj[key]
      if (isNumber(value)) {
        loc.push(`${cursor}.${key} = ${value}`)
      } else if (isBoolean(value)) {
        loc.push(`${cursor}.${key} = ${value ? 'true' : 'false'}`)
      } else if (isObject(value) && value.__propertyBinding === true) {
        store.push(value)
        loc.push(`element.__bindProperty(store[${store.length - 1}], ${cursor}, "${key}")`)
      } else if (isObject(value) || Array.isArray(value)) {
        // Dynamic assignment.
        // Because literal objects may contain dynamics, we store the full object.
        store.push(value)
        loc.push(`${cursor}.${key} = store[${store.length - 1}]`)
      } else {
        // String etc.
        loc.push(`${cursor}.${key} = ${JSON.stringify(value)}`)
      }
    }
  })
}

const parsePropertyBindings = (obj, context, cursor) => {
  const store = context.store
  const loc = context.loc
  const keys = Object.keys(obj)
  keys.forEach(key => {
    if (key !== 'type') {
      const value = obj[key]
      if (isObjectLiteral(value) && value.__propertyBinding === true) {
        store.push(value)
        loc.push(`element.__bindProperty(store[${store.length - 1}], ${cursor}, "${key}")`)
      }
    }
  })
}
