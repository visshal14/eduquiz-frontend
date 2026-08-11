/**
 * Teachers and students are the same record with different endpoints, so the
 * create and edit screens are shared and parameterised from here.
 */
const personConfig = {
    teacher: {
        singular: 'teacher',
        list: '/getAllTeacher',
        create: '/addNewTeacher',
        edit: '/editTeacher',
        // Deleting a teacher orphans their quizzes and rooms, so it stays off
        // this screen (it was commented out in the original too).
        remove: null,
    },
    student: {
        singular: 'student',
        list: '/getAllStudent',
        create: '/addNewStudent',
        edit: '/editStudent',
        remove: '/deleteStudent',
    },
}

export default personConfig
