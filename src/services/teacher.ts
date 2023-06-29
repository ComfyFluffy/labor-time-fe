import { Category, Class, Student, Teacher } from './model'
import { BaseService } from './base'
import fileDownload from 'js-file-download'

export interface RejectLaborItemRequest {
  id: number
  reason?: string
}

export interface PassLaborItemRequest {
  id: number
  reason: string
  description: string
  approved_hour: number
}

export interface TeacherClassRelation {
  teacher_id: number
  class_id: number
}

export type ClassesStatsDetailResponse = {
  class: Class
  statistics: {
    total: number
    all_approved: number
    has_pending_item: number
    has_reject_item: number
    not_submitted: number
  }
}[]
export type ClassesStatsResponse = {
  class_id: number
  classname: string
  pass_hour: number
  pass_student: number
  total_student: number
}[]

export interface SchoolYearsResponse {
  school_years: string[]
  current_school_year: string
}

// export type PassedClassesResponse = {
//   class_id: number
//   classname: string
//   pass_hour: number
//   pass_student: number
//   total_student: number
// }[]

// export type PassedStudentsResponse = {
//   student_id: number
//   uid: string
//   name: string
//   total_hour: number
//   is_passed: boolean
// }[]

export type StudentWithoutClass = Omit<Student, 'classname' | 'class_id'>

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
    return this.useGet<StudentWithoutClass[]>('/v2/teacher/student', {
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
    await this.axios.post('/v2/teacher/labor/reject', request)
  }

  passLaborItem = async (request: PassLaborItemRequest) => {
    await this.axios.post('/v2/teacher/labor/pass', request)
  }

  useSelfInfo = () => {
    return {
      data: {
        college_id: 1,
        college_name: '计算机学院',
        id: 1,
        name: '张三',
        phone: '12345678910',
        role_id: 2,
      } as Teacher,
    }
    return this.useGet<Teacher>('/v2/teacher/info/self')
  }

  useSchoolYears = () => {
    return {
      data: {
        current_school_year: '2020-2021',
        school_years: ['2020-2021', '2019-2020'],
      } as SchoolYearsResponse,
    }
    return this.useGet<SchoolYearsResponse>('/v2/teacher/school_year')
  }

  // FIXIT: remove schoolYear
  // usePassedStudent = (classId: number, schoolYear: string) => {
  //   return this.useGet<PassedStudentsResponse>(
  //     '/v2/teacher/statistics/pass/student',
  //     {
  //       class_id: classId,
  //       school_year: schoolYear,
  //     }
  //   )
  // }

  // FIXIT: remove schoolId
  useClassesStats = (schoolYear: string, schoolId: number) => {
    return {
      data: [
        {
          class_id: 1,
          classname: '计算机科学与技术1班',
          pass_hour: 100,
          pass_student: 10,
          total_student: 20,
        },
        {
          class_id: 2,
          classname: '计算机科学与技术2班',
          pass_hour: 100,
          pass_student: 10,
          total_student: 25,
        },
      ] as ClassesStatsResponse,
    }
    return this.useGet<ClassesStatsResponse>(
      '/v2/teacher/statistics/pass/class',
      {
        school_year: schoolYear,
        college_id: schoolId,
      }
    )
  }

  useStatsDetail = (schoolYear: string, schoolId: number) => {
    return this.useGet<ClassesStatsDetailResponse>('/v2/teacher/statistics', {
      school_year: schoolYear,
      college_id: schoolId,
    })
  }

  usePassHourThreshold = () => {
    return {
      data: {
        pass_hour: 100,
      },
    }
    return this.useGet<{
      pass_hour: number
    }>('/v2/teacher/statistics/pass/hour')
  }

  downloadXlsx = async (schoolYear: string) => {
    const r = await this.axios.get(
      `/v2/teacher/statistics/excel/class?${new URLSearchParams({
        school_year: schoolYear,
      })}`,
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
