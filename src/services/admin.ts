import { BaseService } from './base'
import { Category, Class, School, Student, Teacher } from './model'
import { UserType } from './model'

export interface AddStudentRequest {
  student: Pick<Student, 'uid' | 'name'>
  class_id: number
}

export type TeacherWithClasses = Omit<
  Teacher,
  'college_id' | 'college_name'
> & {
  classes: Class[]
}

export type AddTeacherRequest = Pick<Teacher, 'name' | 'phone' | 'role_id'>

export type ModifyTeacherRequest = Pick<
  Teacher,
  'id' | 'name' | 'phone' | 'role_id'
>

export class SchoolAdminService extends BaseService {
  resetPassword = async (account: string, userType: UserType) => {
    this.axios.post(`/v2/teacher/${userType}/reset`, { account })
  }

  private relationsFromIds(teacherId: number, classIds: number[]) {
    return classIds.map((classId) => ({
      teacher_id: teacherId,
      class_id: classId,
    }))
  }

  addTeacherClassRelations = async (teacherId: number, classIds: number[]) => {
    if (classIds.length === 0) {
      return
    }
    const relations = this.relationsFromIds(teacherId, classIds)
    await this.axios.post('/v2/teacher/class/teacher', relations)
  }

  deleteTeacherClassRelations = async (
    teacherId: number,
    classIds: number[]
  ) => {
    if (classIds.length === 0) {
      return
    }
    const relations = this.relationsFromIds(teacherId, classIds)
    await this.axios.post('/v2/teacher/class/teacher/delete', relations)
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

  addTeacher = async (teacher: AddTeacherRequest) => {
    return (
      await this.axios.post<{
        id: number
      }>('/v2/teacher/info', teacher)
    ).data.id
  }

  modifyTeacher = async (teacher: ModifyTeacherRequest) => {
    await this.axios.put('/v2/teacher/info', teacher)
  }

  deleteTeacher = async (teacherId: number) => {
    await this.axios.delete(`/v2/teacher/info?id=${teacherId}`)
  }

  useTeachers = () => {
    const { data, ...rest } = this.useGet<TeacherWithClasses[]>(
      '/v2/teacher/class/teacher'
    )
    return {
      data: data?.map((teacher) => ({
        ...teacher,
        classes: teacher.classes ? teacher.classes : [],
      })),
      ...rest,
    }
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
  useTeachers = (schoolId: number) => {
    return this.useGet<(Teacher & { classes: Class[] })[]>('/v2/teacher/info', {
      college_id: schoolId,
    })
  }

  useSchools = () => {
    return this.useGet<School[]>('/v2/teacher/admin/college')
  }

  useSchoolPassedData = (schoolYear: string) => {
    return this.useGet<SchoolPassDataResponse>(
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
    await this.axios.post('/v2/teacher/admin', {
      teacher_id: teacherId,
    })
  }

  removeAdmin = async (teacherId: number) => {
    await this.axios.post('/v2/teacher/admin/delete', {
      teacher_id: teacherId,
    })
  }
}
