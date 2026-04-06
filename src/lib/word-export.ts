import { ReportRecord } from '@/services/reports'
import { format } from 'date-fns'
import { toast } from 'sonner'

export const validateForExport = (report: ReportRecord | { data: any }): boolean => {
  const data = report.data || {}
  const classificacao = data.classificacao || {}

  if (!classificacao.tipo) {
    toast.error('Classificação Pendente', {
      description:
        'Por favor, defina a Classificação do Documento (Observação, Relatório ou Laudo) na aba 12. Classificação antes de exportar.',
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
  const anexos = data.anexos || {}

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
    (Number(estimativa.tratamento) || 0) +
    (Number(estimativa.consolidacao) || 0)

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; text-align: justify; }
        h1 { font-size: 16pt; color: #2b579a; font-weight: bold; text-align: center; margin-bottom: 24px; }
        h2 { font-size: 14pt; color: #2b579a; margin-top: 24px; font-weight: bold; border-bottom: 1px solid #2b579a; padding-bottom: 4px; }
        h3 { font-size: 12pt; color: #333; margin-top: 16px; font-weight: bold; }
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
      <h1>${report.title || 'Laudo Técnico'}</h1>
      <div class="header-info">
        <p><span class="field-label">Data de Criação:</span> ${format(new Date(report.created), 'dd/MM/yyyy')}</p>
      </div>

      <h2>1. Síntese / Contexto</h2>
      <p>${identificacao.sintese || 'Não informado.'}</p>

      <h2>2. Matriz GUT</h2>
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

      <h2>3. Classificação do Documento</h2>
      <p>Este documento é classificado como: <strong>${classificacao.tipo || 'Não classificado'}</strong></p>

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
          <tr><td>Tratamento de Imagens</td><td>${estimativa.tratamento || 0}</td></tr>
          <tr><td>Consolidação / Redação</td><td>${estimativa.consolidacao || 0}</td></tr>
          <tr>
            <th style="background-color: #d9e1f2;">Total de Esforço</th>
            <th style="background-color: #d9e1f2;">${effortTotal} horas</th>
          </tr>
        </tbody>
      </table>

      <h2>5. Termos e Definições Técnicas de Referência</h2>
      <p>${metodologia.alcanceInterpretativo || 'Não informado.'}</p>

      <h2>6. Evidências</h2>
      <p><strong>Monitoramento:</strong> ${evidencias.monitoramento || 'Não informado.'}</p>
      <p><strong>Eventos:</strong> ${evidencias.eventos || 'Não informado.'}</p>
      <p><strong>Evidências Associadas:</strong> ${evidencias.associadas || 'Não informado.'}</p>

      <h2>7. Hipóteses</h2>
      <p><strong>Descrição:</strong> ${hipoteses.principal?.descricao || 'Não informada.'}</p>
      <p><strong>Critérios:</strong> ${hipoteses.principal?.criterios || 'Não informados.'}</p>
      <p><strong>Grau de Confiança:</strong> ${hipoteses.principal?.confianca || 'Não informado.'}</p>

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
        <p><span class="field-label">Local:</span> ${m.local || m.localizacao || 'Não informado'}</p>
        <p><span class="field-label">Intensidade:</span> ${m.intensidade || 'Não informada'}</p>
        <p><span class="field-label">Evolução:</span> ${m.evolucao || 'Não informada'}</p>
        <p><span class="field-label">Descrição:</span> ${m.descricao || m.observacoes || 'Sem descrição'}</p>
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

      <h2>10. Encerramento</h2>
      <p>${encerramento.texto || 'Não informado.'}</p>

      <h2>11. Declaração de Responsabilidade Técnica</h2>
      <p>${
        encerramento.responsabilidade
          ? `<strong>Responsável Técnico:</strong> ${encerramento.responsabilidade}`
          : 'Não informado.'
      }</p>

      <h2>12. Metodologia / Classificação Metodológica</h2>
      <p><strong>Procedimentos Adotados:</strong> ${metodologia.procedimentosAdotados?.join(', ') || 'Não informados'}</p>
      <p><strong>Limitações da Investigação:</strong> ${metodologia.limitacoesInvestigacao?.join(', ') || 'Não informadas'}</p>
      <p><strong>Lacunas Metodológicas:</strong> ${metodologia.lacunasMetodologicas || 'Não informadas'}</p>
      <p><strong>Amplitude Técnica:</strong> ${metodologia.amplitudeTecnica || 'Não informada'}</p>
      <p><strong>Estado Aparente de Desempenho:</strong> ${classificacao.estadoDesempenho || 'Não informado'}</p>
      <p><strong>Classificação de Prioridade:</strong> ${classificacao.prioridade || 'Não informada'}</p>

      <h2>13. Documentos e Anexos</h2>
      ${
        anexos.tipos && anexos.tipos.length > 0
          ? '<p><strong>Tipos de Anexo:</strong> ' + anexos.tipos.join(', ') + '</p>'
          : '<p>Nenhum anexo registrado.</p>'
      }
      <p><strong>Quantidade de Fotos:</strong> ${anexos.quantidadeFotos || 'Não informada'}</p>
      <p><strong>Organização:</strong> ${anexos.organizacaoFotos || 'Não informada'}</p>

      <h2>14. Referências</h2>
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
