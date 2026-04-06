import { ReportRecord } from '@/services/reports'
import { format } from 'date-fns'
import { toast } from 'sonner'

export const validateForExport = (report: ReportRecord | { data: any }): boolean => {
  const data = report.data || {}
  const classificacao = data.classificacao || {}

  if (!classificacao.tipo) {
    toast.error('Classificação Pendente', {
      description:
        'Por favor, defina a Classificação do Documento (Observação, Relatório ou Laudo) antes de exportar.',
      duration: 5000,
    })
    return false
  }
  return true
}

export const exportToWord = (
  report: ReportRecord | { title: string; created: string; data: any },
) => {
  if (!validateForExport(report)) return false

  const data = report.data || {}

  const identificacao = data.identificacao || {}
  const manifestacoes = data.manifestacoes || []
  const evidencias = data.evidencias || {}
  const hipoteses = data.hipoteses || {}
  const consolidacao = data.consolidacao || {}
  const metodologia = data.metodologia || {}
  const estimativa = data.estimativa || {}
  const classificacao = data.classificacao || {}
  const encerramento = data.encerramento || {}
  const referencias = data.referencias || {}

  const calculateGUT = (m: any) => {
    const g = Number(m.gravidade) || 1
    const u = Number(m.urgencia) || 1
    const t = Number(m.tendencia) || 1
    return g * u * t
  }

  const effortTotal =
    (Number(estimativa.compreensao) || 0) +
    (Number(estimativa.estudo) || 0) +
    (Number(estimativa.organizacao) || 0) +
    (Number(estimativa.imagens) || 0) +
    (Number(estimativa.redacao) || 0)

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; text-align: justify; }
        h1 { font-size: 16pt; color: #2b579a; font-weight: bold; }
        h2 { font-size: 14pt; color: #2b579a; margin-top: 24px; font-weight: bold; }
        h3 { font-size: 12pt; color: #333; margin-top: 16px; font-weight: bold; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .gut-table th, .gut-table td { text-align: center; }
        .gut-table td:first-child { text-align: left; }
        .img-container { text-align: center; margin: 15px 0; }
        .img-container img { max-width: 500px; height: auto; border: 1px solid #ccc; }
        .field-label { font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>${report.title || 'Laudo Técnico'}</h1>
      <p><span class="field-label">Data de Criação:</span> ${format(new Date(report.created), 'dd/MM/yyyy')}</p>

      <h2>1. Síntese / Contexto</h2>
      <p>${identificacao.sintese || 'Não informado.'}</p>

      <h2>2. Classificação do Documento</h2>
      <p>Este documento é classificado como: <strong>${classificacao.tipo || 'Não classificado'}</strong></p>

      <h2>3. Matriz GUT</h2>
      <table class="gut-table">
        <thead>
          <tr>
            <th>Manifestação</th>
            <th>Gravidade (G)</th>
            <th>Urgência (U)</th>
            <th>Tendência (T)</th>
            <th>Índice (G×U×T)</th>
          </tr>
        </thead>
        <tbody>
          ${
            manifestacoes.length > 0
              ? manifestacoes
                  .map(
                    (m: any) => `
              <tr>
                <td>${m.titulo || 'Sem título'}</td>
                <td>${m.gravidade || 1}</td>
                <td>${m.urgencia || 1}</td>
                <td>${m.tendencia || 1}</td>
                <td><strong>${calculateGUT(m)}</strong></td>
              </tr>
            `,
                  )
                  .join('')
              : '<tr><td colspan="5">Nenhuma manifestação registrada.</td></tr>'
          }
        </tbody>
      </table>

      <h2>4. Estimativa de Esforço</h2>
      <table>
        <thead>
          <tr>
            <th>Atividade</th>
            <th>Horas Estimadas</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Compreensão do Problema</td><td>${estimativa.compreensao || 0}</td></tr>
          <tr><td>Estudo e Pesquisa</td><td>${estimativa.estudo || 0}</td></tr>
          <tr><td>Organização de Dados</td><td>${estimativa.organizacao || 0}</td></tr>
          <tr><td>Tratamento de Imagens</td><td>${estimativa.imagens || 0}</td></tr>
          <tr><td>Redação Técnica</td><td>${estimativa.redacao || 0}</td></tr>
          <tr>
            <th style="background-color: #d9e1f2;">Total de Esforço</th>
            <th style="background-color: #d9e1f2;">${effortTotal} horas</th>
          </tr>
        </tbody>
      </table>

      <h2>5. Termos e Definições Técnicas de Referência</h2>
      <p>${metodologia.termos || 'Não informado.'}</p>

      <h2>6. Evidências</h2>
      <p>${evidencias.texto || 'Não informado.'}</p>

      <h2>7. Hipóteses</h2>
      <p>${hipoteses.texto || 'Não informado.'}</p>

      <h2>8. Consolidação</h2>
      <h3>8.1 Diagnóstico</h3>
      <p>${consolidacao.diagnostico || 'Não informado.'}</p>
      <h3>8.2 Prognóstico</h3>
      <p>${consolidacao.prognostico || 'Não informado.'}</p>
      <h3>8.3 Recomendações</h3>
      <p>${consolidacao.recomendacoes || 'Não informado.'}</p>
      <h3>8.4 Limitações</h3>
      <p>${consolidacao.limitacoes || 'Não informado.'}</p>

      <h2>9. Manifestações Técnicas</h2>
      ${
        manifestacoes.length > 0
          ? manifestacoes
              .map(
                (m: any, i: number) => `
        <h3>9.${i + 1} ${m.titulo || 'Manifestação'}</h3>
        <p><span class="field-label">Local:</span> ${m.local || 'Não informado'}</p>
        <p><span class="field-label">Intensidade:</span> ${m.intensidade || 'Não informada'}</p>
        <p><span class="field-label">Evolução:</span> ${m.evolucao || 'Não informada'}</p>
        <p><span class="field-label">Descrição:</span> ${m.descricao || 'Sem descrição'}</p>
        ${
          m.fotos && m.fotos.length > 0
            ? m.fotos
                .map(
                  (f: string) => `
          <div class="img-container">
            <img src="${f}" alt="Registro fotográfico de ${m.titulo || 'manifestação'}" />
          </div>
        `,
                )
                .join('')
            : ''
        }
      `,
              )
              .join('')
          : '<p>Nenhuma manifestação registrada.</p>'
      }

      <h2>10. Declaração de Responsabilidade Técnica e Encerramento</h2>
      <p>${encerramento.texto || 'Não informado.'}</p>
      ${encerramento.responsabilidade ? `<p><strong>Responsável Técnico:</strong> ${encerramento.responsabilidade}</p>` : ''}

      <h2>11. Referências</h2>
      <p>${referencias.texto || 'Não informado.'}</p>
      
    </body>
    </html>
  `

  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url

  const safeTitle = (report.title || 'Laudo_Tecnico').replace(/[^a-z0-9]/gi, '_').toLowerCase()
  const dateStr = format(new Date(), 'yyyy-MM-dd')
  link.download = `${safeTitle}_${dateStr}.docx`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  toast.success('Documento Word gerado com sucesso!', {
    description: 'O download foi iniciado automaticamente.',
  })

  return true
}
