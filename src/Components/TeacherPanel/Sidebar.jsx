import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined'
import PanelSidebar from '../Layout/PanelSidebar'
import { useShell } from '../Layout/ShellContext'

const sections = [
    {
        label: 'Quizzes',
        items: [
            { id: 'CreateQuiz', label: 'Create quiz', icon: <AddOutlinedIcon fontSize="small" /> },
            { id: 'EditQuiz', label: 'Edit quiz', icon: <EditOutlinedIcon fontSize="small" /> },
            { id: 'SeeAllQuiz', label: 'All quizzes', icon: <ViewListOutlinedIcon fontSize="small" /> },
        ],
    },
    {
        label: 'Rooms',
        items: [
            { id: 'CreateRoom', label: 'Create room', icon: <AddOutlinedIcon fontSize="small" /> },
            { id: 'EditRoom', label: 'Edit room', icon: <EditOutlinedIcon fontSize="small" /> },
            { id: 'SeeAllRoom', label: 'All rooms', icon: <ViewListOutlinedIcon fontSize="small" /> },
        ],
    },
]

const Sidebar = () => {
    const navigate = useNavigate()
    const { teacherId, id } = useParams()
    const { closeSidebar } = useShell()

    const select = (route) => {
        closeSidebar()
        navigate(`/teacher/${teacherId}/${route}`)
    }

    return <PanelSidebar sections={sections} activeId={id} onSelect={select} />
}

export default Sidebar
