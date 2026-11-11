import React from 'react'
import QrCode from 'react-qr-code'
import InputColor from './components/inputColor/inputColor'
import InputForm from './components/inputForm/inputForm'
import metadata from './metadata.json'

const TITLE = 'QR Generate - ALFAM Services'

const App: React.FC = () => {
  const [content, setContent] = React.useState('')
  const [color, setColor] = React.useState('#000')
  const [generated, setGenerated] = React.useState<{ value: string; color: string } | null>(null)
  const [open, setOpen] = React.useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)
  const handleColor = React.useCallback((val: string) => setColor(val), [])

  const handleGenerate = () => {
    const value = content.trim()
    if (value) setGenerated({ value, color })
  }

  const handleClear = () => {
    setContent('')
    setGenerated(null)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#3b4151] font-sans">
      {/* Top bar estilo Swagger */}
      <header className="bg-[#1b1b1b] px-4 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#89bf04] text-sm font-bold text-[#1b1b1b]">
            {'{ }'}
          </span>
          <span className="text-xl font-bold text-white">swagger</span>
          <span className="ml-auto text-xs text-gray-400">QR · OpenAPI 3.0</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Título + versión */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold text-[#3b4151]">{TITLE}</h1>
            <span className="rounded-full bg-[#7d8492] px-2 py-0.5 text-xs font-bold text-white">
              v{metadata.version}
            </span>
            <span className="rounded-full bg-[#89bf04] px-2 py-0.5 text-xs font-bold text-white">
              OAS 3.0
            </span>
          </div>
          <p
            className="mt-1 text-xs text-[#6b7280]"
            title={`Compilado: ${metadata.builtAt}`}
            data-testid="build-info"
          >
            Versión {metadata.version} · {metadata.branch}@{metadata.commit} · {metadata.environment} ·{' '}
            {new Date(metadata.builtAt).toLocaleString()}
          </p>
          <p className="mt-3 text-sm">
            Genera un código QR a partir de una <b>URL</b> o un <b>texto</b>.
          </p>
        </div>

        <h2 className="mb-2 border-b border-[#3b415133] pb-2 text-xl font-semibold">QR</h2>

        {/* Operación */}
        <section className="rounded border border-[#49cc90] bg-[#49cc9019] shadow-sm">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex w-full items-center gap-3 p-1.5 text-left"
          >
            <span className="min-w-[70px] rounded bg-[#49cc90] px-3 py-1.5 text-center text-sm font-bold text-white">
              GENERATE
            </span>
            <span className="font-mono text-base font-semibold">/qr</span>
            <span className="text-sm text-[#3b4151]">Generar código QR</span>
            <span className="ml-auto pr-3 text-xs">{open ? '▲' : '▼'}</span>
          </button>

          {open && (
            <div className="border-t border-[#49cc90] bg-white">
              <div className="flex items-center justify-between bg-[#ebf7f1] px-4 py-2">
                <h4 className="text-sm font-bold">Parameters</h4>
              </div>

              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#3b415133]">
                    <th className="w-1/3 px-4 py-2 font-bold">Name</th>
                    <th className="px-4 py-2 font-bold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-top">
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold">
                        content<span className="text-xs text-red-500"> * required</span>
                      </div>
                      <div className="text-xs italic text-[#6b7280]">string (URL o TEXT)</div>
                    </td>
                    <td className="px-4 py-3">
                      <InputForm name="content" value={content} onChange={handleChange} />
                    </td>
                  </tr>
                  <tr className="align-top">
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold">color</div>
                      <div className="text-xs italic text-[#6b7280]">string (hex)</div>
                    </td>
                    <td className="px-4 py-3">
                      <InputColor name="color" onChange={handleColor} />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex gap-3 px-4 pb-4">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!content.trim()}
                  className="flex-1 rounded bg-[#4990e2] px-4 py-2 text-sm font-bold text-white hover:bg-[#3b7bc8] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Generate QR
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 rounded border-2 border-[#ff6060] bg-white px-4 py-2 text-sm font-bold text-[#ff6060] hover:bg-red-50"
                >
                  Clear
                </button>
              </div>

              {/* Responses */}
              <div className="flex items-center bg-[#ebf7f1] px-4 py-2">
                <h4 className="text-sm font-bold">Responses</h4>
              </div>
              <div className="px-4 py-4">
                <div className="mb-2 flex items-center gap-3 text-sm">
                  <span className="font-bold">Code</span>
                  <span className="font-mono">{generated ? '200' : '—'}</span>
                  <span className="text-[#6b7280]">
                    {generated ? 'QR generated' : 'Sin resultado todavía'}
                  </span>
                </div>
                <div className="flex min-h-[180px] items-center justify-center rounded bg-[#41444e] p-4">
                  {generated ? (
                    <div className="rounded bg-white p-3">
                      <QrCode
                        title="qrcode"
                        value={generated.value}
                        fgColor={generated.color}
                        size={150}
                      />
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-gray-300">
                      Completá "content" y presioná "Generate QR"
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
