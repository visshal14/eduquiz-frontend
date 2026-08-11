import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined'
import PanelSidebar from '../../Layout/PanelSidebar'
import { useShell } from '../../Layout/ShellContext'

// `entity` doubles as the route segment (/admin/CreateQuiz) and the label stem.
const crud = (entity, singular, plural) => [
    { id: `Create${entity}`, label: `Create ${singular}`, icon: <AddOutlinedIcon fontSize="small" /> },
    { id: `Edit${entity}`, label: `Edit ${singular}`, icon: <EditOutlinedIcon fontSize="small" /> },
    { id: `SeeAll${entity}`, label: `All ${plural}`, icon: <ViewListOutlinedIcon fontSize="small" /> },
]

const sections = [
    { label: 'Quizzes', items: crud('Quiz', 'quiz', 'quizzes') },
    { label: 'Teachers', items: crud('Teacher', 'teacher', 'teachers') },
    { label: 'Students', items: crud('Student', 'student', 'students') },
    { label: 'Rooms', items: crud('Room', 'room', 'rooms') },
]

const Sidebar = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { closeSidebar } = useShell()

    const select = (route) => {
        closeSidebar()
        navigate(`/admin/${route}`)
    }

    return <PanelSidebar sections={sections} activeId={id} onSelect={select} />
}

export default Sidebar
