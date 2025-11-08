import React from "react"

type LegalRendererProps = {
  dict: any
  keyPath: string // e.g. 'legal.privacy' or 'legal.cookies' or 'legal.legalNotice'
  lang?: string
}

function getByPath(obj: any, path: string) {
  return path.split('.').reduce((acc: any, p: string) => (acc && acc[p] ? acc[p] : undefined), obj)
}

function renderValue(value: any, idx?: number) {
  if (typeof value === 'string') return <p key={idx} className="text-slate-600 leading-relaxed">{value}</p>
  if (Array.isArray(value))
    return (
      <ul key={idx} className="list-disc list-inside space-y-2 text-slate-600">
        {value.map((v, i) => (
          <li key={i} className="leading-relaxed">
            {v}
          </li>
        ))}
      </ul>
    )
  if (typeof value === 'object') return renderSection(value)
  return null
}

function renderSection(section: any, key?: string) {
  // section can be { title, content, list, ... } or nested groups
  if (!section) return null

  const title = section.title || key

  return (
    <div className="mb-8" key={key}>
      {title && <h2 className="text-2xl font-semibold text-slate-800 mb-4">{title}</h2>}

      {/* Known simple fields */}
      {section.content && <p className="text-slate-600 leading-relaxed mb-4">{section.content}</p>}

      {section.purposes && <p className="text-slate-700 mb-3">{section.purposes}</p>}

      {Array.isArray(section.list) && (
        <ul className="list-disc list-inside space-y-2 text-slate-600 mb-4">
          {section.list.map((item: any, i: number) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      )}

      {/* Render nested named parts */}
      {Object.entries(section)
        .filter(([k]) => !['title', 'content', 'list', 'purposes'].includes(k))
        .map(([k, v]) => {
          if (typeof v === 'string') return <p key={k} className="text-slate-600 leading-relaxed">{v}</p>
          if (Array.isArray(v))
            return (
              <ul key={k} className="list-disc list-inside space-y-2 text-slate-600">
                {v.map((it: any, i: number) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            )
          if (typeof v === 'object' && v) {
            const vv: any = v
            // If it's a small object with title/content
            if (vv.title || vv.content || vv.examples || vv.description) {
              return (
                <div key={k} className="mb-4">
                  {vv.title && <h3 className="text-xl font-medium text-slate-700 mb-2">{vv.title}</h3>}
                  {vv.description && <p className="text-slate-600 mb-2">{vv.description}</p>}
                  {vv.content && <p className="text-slate-600 mb-2">{vv.content}</p>}
                  {Array.isArray(vv.examples) && (
                    <ul className="list-disc list-inside text-slate-600">
                      {vv.examples.map((ex: any, i: number) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            }
            // Otherwise render nested section
            return renderSection(vv, k)
          }
          return null
        })}
    </div>
  )
}

export default function LegalRenderer({ dict, keyPath }: LegalRendererProps) {
  const node = getByPath(dict, keyPath)

  if (!node) return <div className="p-6 bg-red-50 text-red-800 rounded">Contenido no disponible</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">{node.title}</h1>
            {node.lastUpdated && <p className="text-sm text-slate-500">{node.lastUpdated}</p>}
          </div>

          {node.intro && <p className="text-slate-700 leading-relaxed mb-8">{node.intro}</p>}

          {/* Sections */}
          {node.sections &&
            Object.entries(node.sections).map(([key, section]) => renderSection(section, key))}

          {/* Fallback: if node has free-form content */}
          {!node.sections && node.content && <p className="text-slate-600">{node.content}</p>}
        </div>
      </div>
    </div>
  )
}
