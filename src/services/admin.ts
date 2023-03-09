import { BaseService } from './base'
import { Category, Class, Student, Teacher } from './model'
import { TeacherClassRelation } from './teacher'
import { UserType } from './model'

export interface AddStudentRequest {
  student: Pick<Student, 'uid' | 'name'>
  class_id: number
}

export class SchoolAdminService extends BaseService {
  resetPassword = async (account: string, userType: UserType) => {
    this.axios.post(`/v2/teacher/${userType}/reset`, { account })
  }

  addTeacherClassRelations = async (relations: TeacherClassRelation[]) => {
    await this.axios.post('/v2/teacher/class2teacher', relations)
  }

  addLaborCategories = async (categories: Category[]) => {
    await this.axios.post('/v2/teacher/labor/type', categories)
  }

  useLaborCategories = () => {
    return this.useGet<Category[]>('/v2/teacher/labor/type')
  }

  modifyLaborCategory = async (category: Category) => {
    await this.axios.put('/v2/teacher/labor/type', category)
  }

  deleteLaborCategory = async (id: number) => {
    await this.axios.delete(`/v2/teacher/labor/type?id=${id}`)
  }

  addTeacher = async (teacher: Omit<Teacher, 'id' | 'college_id'>) => {
    return await this.axios.post<{
      id: number
    }>('/v2/teacher/info', teacher)
  }

  modifyTeacher = async (teacher: Omit<Teacher, 'college_id'>) => {
    await this.axios.put('/v2/teacher/info', teacher)
  }

  useTeachers = () => {
    return this.useGet<
      Teacher & {
        classes: Class[]
      }
    >('/v2/teacher/class2teacher')
  }

  addStudent = async (request: AddStudentRequest) => {
    await this.axios.post('/v2/teacher/student', request)
  }

  deleteStudent = async (studentId: number) => {
    await this.axios.delete(`/v2/teacher/student?id=${studentId}`)
  }

  setPassHourThreshold = async (threshold: number) => {
    await this.axios.post('/v2/teacher/statistics/pass/hour', {
      pass_hour: threshold,
    })
  }
}

export type SchoolPassDataResponse = {
  college_id: number
  college_name: string
  pass_hour: number
  pass_student: number
  total_student: number
}[]

export class SuperAdminService extends BaseService {
  useTeachers = (schoolId: number, schoolYear: string) => {
    return this.useGet<(Teacher & { classes: Class[] })[]>('/v2/teacher/info', {
      college_id: schoolId,
      school_year: schoolYear,
    })
  }

  useSchoolPassedData = (schoolYear: string) => {
    return this.useGet<SchoolAdminService>(
      '/v2/teacher/statistics/pass/college',
      {
        school_year: schoolYear,
      }
    )
  }

  addSchool = async (schoolName: string) => {
    await this.axios.post('/v2/college', { college_name: schoolName })
  }

  addAdmin = async (teacherId: number) => {
    await this.axios.post('/v2/teacaher/admin', {
      teacher_id: teacherId,
    })
  }

  removeAdmin = async (teacherId: number) => {
    await this.axios.post('/v2/teacaher/admin/delete', {
      teacher_id: teacherId,
    })
  }
}
