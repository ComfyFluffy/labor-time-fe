import { Category, Class, Student, Teacher } from './model'
import { BaseService } from './base'
import fileDownload from 'js-file-download'

export interface RejectLaborItemRequest {
  id: number
  reason?: string
}

export interface PassLaborItemRequest {
  id: number
  reason?: string
  description?: string
  approved_hour: number
}

export interface TeacherClassRelation {
  teacher_id: number
  class_id: number
}

export type ClassesStatsResponse = {
  class: Class
  statistics: {
    total: number
    all_approved: number
    has_pending_item: number
    has_reject_item: number
    not_submitted: number
  }
}[]

export interface SchoolYearsResponse {
  school_years: string[]
  current_school_year: string
}

export type PassedClassesResponse = {
  class_id: number
  classname: string
  pass_hour: number
  pass_student: number
  total_student: number
}[]

export type PassedStudentsResponse = {
  student_id: number
  uid: string
  name: string
  total_hour: number
  is_passed: boolean
}[]

export class TeacherService extends BaseService {
  useManagedClasses = (schoolYear: string | null, schoolId: number | null) => {
    if (schoolYear === null || schoolId === null) {
      return this.useGet<Class[]>(null)
    }
    return this.useGet<Class[]>('/v2/teacher/class', {
      school_year: schoolYear,
      college_id: schoolId,
    })
  }

  useClassStudents = (classId: number) => {
    return this.useGet<Omit<Student, 'classname'>[]>('/v2/teacher/student', {
      class_id: classId,
    })
  }

  useStudentLaborItems = (studentId: number, schoolYear: string | null) => {
    if (schoolYear === null) {
      return this.useGet<Category[]>(null)
    }
    return this.useGet<Category[]>('/v2/teacher/labor', {
      student_id: studentId,
      school_year: schoolYear,
    })
  }

  rejectLaborItem = async (request: RejectLaborItemRequest) => {
    await this.axios.post('/v2/labor/teacher/reject', request)
  }

  passLaborItem = async (request: PassLaborItemRequest) => {
    await this.axios.post('/v2/labor/teacher/pass', request)
  }

  useSelfInfo = () => {
    return this.useGet<Teacher>('/v2/teacher/info/self')
  }

  useSchoolYears = () => {
    return this.useGet<SchoolYearsResponse>('/v2/teacher/school_year')
  }

  useStatistics = (schoolYear: string, schoolId: number) => {
    return this.useGet<ClassesStatsResponse>('/v2/teacher/statistics', {
      school_year: schoolYear,
      college_id: schoolId,
    })
  }

  usePassedClasses = (schoolYear: string, schoolId: number) => {
    return this.useGet<PassedClassesResponse>('/v2/teacher/statistics/passed', {
      school_year: schoolYear,
      college_id: schoolId,
    })
  }

  // FIXIT: remove schoolYear
  usePassedStudent = (classId: number, schoolYear: string) => {
    return this.useGet<PassedStudentsResponse>(
      '/v2/teacher/statistics/pass/student',
      {
        class_id: classId,
        school_year: schoolYear,
      }
    )
  }

  // FIXIT: update to v2
  downloadXlsxByClassIds = async (
    classIds: number[],
    schoolYear: string,
    schoolId: number
  ) => {
    if (!schoolYear) {
      throw new Error('schoolYear is required')
    }
    const r = await this.axios.post(
      `/v2/teacher/statistics?${new URLSearchParams({
        school_year: schoolYear,
        college_id: String(schoolId),
      })}`,
      classIds,
      {
        responseType: 'blob',
      }
    )
    fileDownload(
      r.data,
      `学生信息-${schoolYear}-${new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', '-')}.xlsx`
    )
  }
}
