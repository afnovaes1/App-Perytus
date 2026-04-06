import pb from '@/lib/pocketbase/client'

export interface ReportRecord {
  id: string
  user_id: string
  title: string
  data: any
  created: string
  updated: string
}

export const getReports = () =>
  pb.collection('reports').getFullList<ReportRecord>({ sort: '-created' })
export const getReport = (id: string) => pb.collection('reports').getOne<ReportRecord>(id)
export const createReport = (data: { user_id: string; title: string; data: any }) =>
  pb.collection('reports').create<ReportRecord>(data)
export const updateReport = (id: string, data: Partial<{ title: string; data: any }>) =>
  pb.collection('reports').update<ReportRecord>(id, data)
export const deleteReport = (id: string) => pb.collection('reports').delete(id)
