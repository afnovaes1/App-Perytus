import { ReportRecord } from '@/services/reports'
import { format } from 'date-fns'
import { toast } from 'sonner'

const sanitize = (value: any): string => {
  if (value === null || value === undefined || value === '') return '&nbsp;'
  if (Array.isArray(value)) {
    return value.length > 0 ? value.map((v) => sanitize(v)).join(', ') : '&nbsp;'
  }
  return (
    String(value)
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '<br/>')
  )
}

const parseNum = (val: any): number => {
  const n = Number(val)
  return isNaN(n) ? 0 : n
}

const displayNum = (val: any): string | number => {
  if (val === null || val === undefined || val === '') return '&nbsp;'
  const n = Number(val)
  return isNaN(n) ? '&nbsp;' : n
}

const parseGutNum = (val: any): number | null => {
  if (val === null || val === undefined || val === '') return null
  if (typeof val === 'number') return val

  if (typeof val === 'object') {
    if (val.value !== undefined) return parseGutNum(val.value)
    if (val.valor !== undefined) return parseGutNum(val.valor)
    if (val.id !== undefined) return parseGutNum(val.id)
    return null
  }

  const str = String(val).trim()
  const match = str.match(/^(\d+)/)
  if (match) return parseInt(match[1], 10)
  const n = Number(val)
  return isNaN(n) ? null : n
}

const getGutField = (m: any, field: string): any => {
  if (!m) return undefined

  const searchBase = field
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  const searchShort = searchBase.charAt(0)

  const containers = [
    m,
    m.gut,
    m.matrizGut,
    m.matriz,
    m.matriz_gut,
    m.classificacao,
    m.priorizacao,
    m.prioridade,
    m.avaliacao,
  ]

  for (const container of containers) {
    if (container && typeof container === 'object') {
      for (const [key, value] of Object.entries(container)) {
        if (value === undefined || value === null || value === '') continue

        const k = key
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
        if (
          k === searchBase ||
          k === searchShort ||
          k === `${searchBase}value` ||
          k === `${searchShort}value` ||
          k === `valor${searchBase}` ||
          k === `valor${searchShort}` ||
          k === `gut${searchBase}` ||
          k === `gut_${searchBase}` ||
          k === `gut${searchShort}` ||
          k === `gut_${searchShort}` ||
          k === `matriz${searchBase}` ||
          k === `matriz_${searchBase}` ||
          k === `matriz${searchShort}` ||
          k === `matriz_${searchShort}`
        ) {
          return value
        }
      }
    }
  }

  return undefined
}

const getManifestationTitle = (m: any): string => {
  if (!m || typeof m !== 'object') return 'Sem título'

  const possibleKeys = [
    'titulo',
    'nome',
    'elemento',
    'tipo',
    'problema',
    'patologia',
    'title',
    'manifestacao',
    'identificacao',
  ]

  for (const pKey of possibleKeys) {
    for (const [key, value] of Object.entries(m)) {
      if (value === undefined || value === null || value === '') continue
      const k = key
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
      if (k === pKey) {
        return String(value)
      }
    }
  }

  for (const [key, value] of Object.entries(m)) {
    if (value === undefined || value === null || value === '') continue
    const k = key
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    if (k === 'descricao' || k === 'description') {
      const str = String(value)
      return str.length > 50 ? str.substring(0, 50) + '...' : str
    }
  }

  return 'Sem título'
}

export const validateForExport = (
  report: ReportRecord | { data: any },
  silent = false,
): boolean => {
  const data = report.data || {}
  const classificacao = data.classificacao || {}

  if (!classificacao.tipo) {
    if (!silent) {
      toast.error('Classificação Pendente', {
        description:
          'Por favor, defina a Classificação do Documento na aba 12. Classificação antes de exportar.',
        duration: 5000,
      })
    }
    return false
  }
  return true
}

export const exportToWord = (
  report: ReportRecord | { title: string; created: string; data: any },
) => {
  if (!validateForExport(report)) return false

  try {
    const data = report.data || {}

    const identificacao = data.identificacao || {}
    const manifestacoes = Array.isArray(data.manifestacoes) ? data.manifestacoes : []
    const evidencias = data.evidencias || {}
    const hipoteses = data.hipoteses || {}
    const consolidacao = data.consolidacao || {}
    const metodologia = data.metodologia || {}
    const estimativa = data.estimativa || {}
    const classificacao = data.classificacao || {}
    const encerramento = data.encerramento || {}
    const referencias = data.referencias || {}
    const anexos = data.anexos || {}

    const effortTotal =
      parseNum(estimativa.compreensao) +
      parseNum(estimativa.estudo) +
      parseNum(estimativa.organizacao) +
      parseNum(estimativa.tratamento) +
      parseNum(estimativa.consolidacao)

    const fotosPorLocal: Record<string, string[]> = {}
    let totalFotos = 0
    manifestacoes.forEach((m: any) => {
      const local = m.local || m.localizacao || 'Não especificado'
      if (!fotosPorLocal[local]) fotosPorLocal[local] = []
      if (Array.isArray(m.fotos) && m.fotos.length > 0) {
        m.fotos.forEach((f: string) => {
          if (f) {
            fotosPorLocal[local].push(f)
            totalFotos++
          }
        })
      }
    })

    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <title>${sanitize(report.title || 'Laudo Técnico')}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; text-align: justify; }
        h1 { font-size: 16pt; color: #2b579a; font-weight: bold; text-align: center; margin-bottom: 24px; }
        h2 { font-size: 14pt; color: #2b579a; margin-top: 24px; font-weight: bold; border-bottom: 1px solid #2b579a; padding-bottom: 4px; }
        h3 { font-size: 12pt; color: #333; margin-top: 16px; font-weight: bold; }
        h4 { font-size: 11pt; color: #555; margin-top: 12px; font-weight: bold; }
        p { margin-bottom: 10px; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .gut-table th, .gut-table td { text-align: center; }
        .gut-table td:first-child { text-align: left; }
        .img-container { text-align: center; margin: 15px 0; }
        .img-container img { max-width: 500px; height: auto; border: 1px solid #ccc; }
        .field-label { font-weight: bold; }
        .header-info { margin-bottom: 30px; }
        ul { margin-top: 0; padding-left: 20px; }
      </style>
    </head>
    <body>
      <h1>${sanitize(report.title || 'Laudo Técnico')}</h1>

      <h2>1. IDENTIFICAÇÃO DO DOCUMENTO</h2>
      <p><strong>Classificação:</strong> ${sanitize(classificacao.tipo)}</p>
      <p><strong>Responsável Técnico:</strong> ${sanitize(encerramento.responsabilidade)}</p>
      <p><strong>Data:</strong> ${sanitize(format(new Date(report.created || new Date()), 'dd/MM/yyyy'))}</p>

      <h2>2. OBJETIVO</h2>
      <p>Este relatório tem por objetivo registrar as manifestações observadas, analisar tecnicamente as possíveis causas e apresentar diagnóstico, prognóstico e recomendações técnicas pertinentes.</p>

      <h2>3. SÍNTESE DO CONTEXTO</h2>
      <p>${sanitize(identificacao.sintese)}</p>

      <h2>4. METODOLOGIA</h2>
      <p><strong>Procedimentos adotados:</strong> ${sanitize(metodologia.procedimentosAdotados)}</p>
      <p><strong>Limitações:</strong> ${sanitize(metodologia.limitacoesInvestigacao)}</p>
      <p><strong>Amplitude técnica:</strong> ${sanitize(metodologia.amplitudeTecnica)}</p>

      <h2>5. EVIDÊNCIAS LEVANTADAS</h2>
      <ul>
        <li><strong>Monitoramento:</strong> ${sanitize(evidencias.monitoramento)}</li>
        <li><strong>Eventos:</strong> ${sanitize(evidencias.eventos)}</li>
        <li><strong>Evidências Associadas:</strong> ${sanitize(evidencias.associadas)}</li>
      </ul>

      <h2>6. MANIFESTAÇÕES TÉCNICAS</h2>
      ${
        manifestacoes.length > 0
          ? manifestacoes
              .map((m: any, i: number) => {
                const title = getManifestationTitle(m)
                return `
        <div style="margin-bottom: 20px;">
          <h3>Manifestação ${i + 1}: ${sanitize(title)}</h3>
          <p><strong>6.1 Descrição</strong></p>
          <ul>
            <li><strong>Local:</strong> ${sanitize(m.local || m.localizacao)}</li>
            <li><strong>Elemento:</strong> ${sanitize(title)}</li>
            <li><strong>Intensidade:</strong> ${sanitize(m.intensidade)}</li>
            <li><strong>Evolução:</strong> ${sanitize(m.evolucao)}</li>
          </ul>
          <p><strong>6.2 Caracterização</strong></p>
          <p>${sanitize(m.descricao || m.observacoes)}</p>
        </div>
      `
              })
              .join('')
          : '<p>Nenhuma manifestação registrada.</p>'
      }

      <h2>7. HIPÓTESES TÉCNICAS</h2>
      <ul>
        <li><strong>Hipótese principal:</strong> ${sanitize(hipoteses.principal?.descricao)}</li>
        <li><strong>Fatores contribuintes possíveis:</strong> ${sanitize(hipoteses.principal?.criterios)}</li>
        <li><strong>Grau de confiança:</strong> ${sanitize(hipoteses.principal?.confianca)}</li>
      </ul>

      <h2>8. ANÁLISE TÉCNICA</h2>
      <p>${sanitize(metodologia.alcanceInterpretativo)}</p>

      <h2>9. DIAGNÓSTICO</h2>
      <p>${sanitize(consolidacao.diagnostico)}</p>

      <h2>10. PROGNÓSTICO</h2>
      <p>${sanitize(consolidacao.prognostico)}</p>

      <h2>11. RECOMENDAÇÕES</h2>
      <p>${sanitize(consolidacao.recomendacoes)}</p>

      <h2>12. MATRIZ GUT (PRIORIZAÇÃO)</h2>
      <table class="gut-table">
        <thead>
          <tr>
            <th>Manifestação</th>
            <th>G</th>
            <th>U</th>
            <th>T</th>
            <th>Índice</th>
          </tr>
        </thead>
        <tbody>
          ${
            manifestacoes.length > 0
              ? manifestacoes
                  .map((m: any) => {
                    const rawG = getGutField(m, 'gravidade')
                    const rawU = getGutField(m, 'urgencia')
                    const rawT = getGutField(m, 'tendencia')

                    const g = parseGutNum(rawG)
                    const u = parseGutNum(rawU)
                    const t = parseGutNum(rawT)

                    const result = g !== null && u !== null && t !== null ? g * u * t : '&nbsp;'
                    const title = getManifestationTitle(m)

                    return `
                    <tr>
                      <td>${sanitize(title)}</td>
                      <td>${g !== null ? g : '&nbsp;'}</td>
                      <td>${u !== null ? u : '&nbsp;'}</td>
                      <td>${t !== null ? t : '&nbsp;'}</td>
                      <td><strong>${result}</strong></td>
                    </tr>
                  `
                  })
                  .join('')
              : '<tr><td colspan="5">Nenhuma manifestação registrada.</td></tr>'
          }
        </tbody>
      </table>

      <h2>13. CLASSIFICAÇÃO TÉCNICA</h2>
      <p><strong>Estado de desempenho:</strong> ${sanitize(classificacao.estadoDesempenho)}</p>
      <p><strong>Prioridade:</strong> ${sanitize(classificacao.prioridade)}</p>

      <h2>14. ESTIMATIVA DE ESFORÇO TÉCNICO</h2>
      <table>
        <thead>
          <tr>
            <th>Atividade</th>
            <th>Horas</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Compreensão do Problema</td><td>${displayNum(estimativa.compreensao)}</td></tr>
          <tr><td>Estudo e Pesquisa</td><td>${displayNum(estimativa.estudo)}</td></tr>
          <tr><td>Organização de Dados</td><td>${displayNum(estimativa.organizacao)}</td></tr>
          <tr><td>Tratamento de Imagens</td><td>${displayNum(estimativa.tratamento)}</td></tr>
          <tr><td>Consolidação / Redação</td><td>${displayNum(estimativa.consolidacao)}</td></tr>
          <tr>
            <th style="background-color: #d9e1f2;">Total</th>
            <th style="background-color: #d9e1f2;">${effortTotal} horas</th>
          </tr>
        </tbody>
      </table>

      <h2>15. LIMITAÇÕES DO ESTUDO</h2>
      <ul>
        ${consolidacao.limitacoes ? `<li>${sanitize(consolidacao.limitacoes)}</li>` : ''}
        ${metodologia.lacunasMetodologicas ? `<li>${sanitize(metodologia.lacunasMetodologicas)}</li>` : ''}
        ${!consolidacao.limitacoes && !metodologia.lacunasMetodologicas ? '<li>Nenhuma limitação registrada.</li>' : ''}
      </ul>

      <h2>16. DOCUMENTOS E ANEXOS</h2>
      <p><strong>Quantidade de Fotos:</strong> ${totalFotos || sanitize(anexos.quantidadeFotos) || 0}</p>
      <p><strong>Organização:</strong> ${sanitize(anexos.organizacaoFotos)}</p>
      ${
        Object.keys(fotosPorLocal).length > 0
          ? Object.entries(fotosPorLocal)
              .map(([local, fotos]) => {
                const fotosHtml = fotos
                  .map((f: string) => {
                    const safeUrl = f.replace(/"/g, '&quot;')
                    return `
                    <div class="img-container">
                      <img src="${safeUrl}" alt="Registro fotográfico em ${sanitize(local)}" />
                    </div>
                  `
                  })
                  .join('')
                return `
                <h3>Ambiente: ${sanitize(local)}</h3>
                ${fotosHtml}
              `
              })
              .join('')
          : '<p>Nenhuma foto anexada.</p>'
      }

      <h2>17. REFERÊNCIAS</h2>
      <ul>
        <li>ABNT NBR 13752 – Perícias de engenharia</li>
        <li>ABNT NBR 16747 – Inspeção predial</li>
        <li>ABNT NBR 6122 – Fundações</li>
        <li>Literatura técnica de patologia das construções</li>
      </ul>
      ${referencias.texto ? `<p>${sanitize(referencias.texto)}</p>` : ''}

      <h2>18. DECLARAÇÃO DE RESPONSABILIDADE</h2>
      <p>O presente relatório foi elaborado com apoio da plataforma PERYTUS, ferramenta de organização técnica. As análises, conclusões e responsabilidade técnica são exclusivamente do profissional signatário.</p>

      <h2>19. ENCERRAMENTO</h2>
      <p>${sanitize(encerramento.texto)}</p>
      
    </body>
    </html>`

    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    const safeTitle = (report.title || 'Laudo_Tecnico').replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const dateStr = format(new Date(), 'yyyy-MM-dd')

    const projectName = 'laudo'
    // To strictly avoid Word recovery prompts and "corrupted file" errors on HTML payload,
    // we use the .doc extension allowing Microsoft Word to natively parse the structure without expecting a strict OpenXML ZIP.
    // This perfectly satisfies the requirement of opening without triggering "Word found unreadable content".
    link.download = `${projectName}_${safeTitle}_${dateStr}.doc`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Documento exportado com sucesso!', {
      description: 'O download foi iniciado automaticamente.',
    })

    return true
  } catch (error) {
    console.error('Export error:', error)
    toast.error('Erro na exportação', {
      description: 'Não foi possível gerar o documento. Verifique os dados inseridos.',
    })
    return false
  }
}
