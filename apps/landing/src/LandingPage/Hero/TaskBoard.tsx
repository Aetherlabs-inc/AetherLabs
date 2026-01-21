import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import TaskColumn, { Column } from './TaskColumn';
import { Task } from './TaskCard';

// AetherLabs-flavored seed data
const initialColumns: Column[] = [
    {
        id: 'todo',
        title: 'Backlog',
        color: 'muted',
        tasks: [
            {
                id: 't1',
                title: "Attach NFC tag to 'Seascape #12'",
                description: "Link tag UID to artwork record and validate tap-to-verify flow.",
                tag: { color: 'blue', label: 'NFC' },
                dueDate: 'Sep 25',
                assignees: 1,
                progress: { completed: 1, total: 3 }
            },
            {
                id: 't2',
                title: "Mint authenticity certificate",
                description: "Create secure digital certificate for 'Lotus Study – RK-017'.",
                tag: { color: 'purple', label: 'Certificate' },
                dueDate: 'Sep 26',
                assignees: 2,
                progress: { completed: 0, total: 4 }
            },
            {
                id: 't3',
                title: "Import 'Axis Gallery' collection (18 works)",
                description: "Bulk import CSV, map fields, attach images & tags.",
                tag: { color: 'accent', label: 'Onboarding' },
                dueDate: 'Sep 28',
                assignees: 2,
                progress: { completed: 0, total: 6 }
            },
            {
                id: 't4',
                title: "Design portfolio template v2",
                description: "Minimal layout with artwork hero, provenance timeline, share link.",
                tag: { color: 'purple', label: 'Design' },
                dueDate: 'Sep 29',
                assignees: 1,
                progress: { completed: 0, total: 3 }
            }
        ]
    },
    {
        id: 'in-progress',
        title: 'In Progress',
        color: 'blue',
        tasks: [
            {
                id: 't5',
                title: "Amplify Gen 2 env: prod split",
                description: "Separate web (Next.js) & mobile (React Native) frontends; configure CI.",
                tag: { color: 'blue', label: 'DevOps' },
                dueDate: 'Sep 24',
                assignees: 1,
                progress: { completed: 2, total: 4 }
            },
            {
                id: 't6',
                title: "Provenance timeline component",
                description: "Show ownership changes, exhibition history, and transfers.",
                tag: { color: 'purple', label: 'UI' },
                dueDate: 'Sep 27',
                assignees: 2,
                progress: { completed: 3, total: 6 }
            },
            {
                id: 't7',
                title: "NFC scan modal demo",
                description: "CTA from hero → modal → simulated scan → certificate preview.",
                tag: { color: 'accent', label: 'Growth' },
                dueDate: 'Sep 23',
                assignees: 1,
                progress: { completed: 1, total: 3 }
            }
        ]
    },
    {
        id: 'in-review',
        title: 'Review',
        color: 'amber',
        tasks: [
            {
                id: 't8',
                title: "Exhibition linking: 'Blue Rooms – Oct'",
                description: "QA linking artworks to exhibition, verify public view.",
                tag: { color: 'blue', label: 'Curation' },
                dueDate: 'Sep 23',
                assignees: 1,
                progress: { completed: 4, total: 5 }
            },
            {
                id: 't9',
                title: "Ownership transfer flow",
                description: "Review transfer request, email verification, and certificate re-issue.",
                tag: { color: 'purple', label: 'Certificate' },
                dueDate: 'Sep 22',
                assignees: 2,
                progress: { completed: 5, total: 6 }
            },
            {
                id: 't10',
                title: "GDPR/PDPA copy & consent",
                description: "Check legal copy for sharing certificates & owner identifiers.",
                tag: { color: 'accent', label: 'Compliance' },
                dueDate: 'Sep 22',
                assignees: 1,
                progress: { completed: 3, total: 3 }
            }
        ]
    },
    {
        id: 'completed',
        title: 'Done',
        color: 'accent',
        tasks: [
            {
                id: 't11',
                title: "Collections ↔ Artworks schema",
                description: "One artwork in many exhibitions; collections contain many artworks.",
                tag: { color: 'blue', label: 'Data' },
                dueDate: 'Sep 18',
                assignees: 1,
                progress: { completed: 5, total: 5 }
            },
            {
                id: 't12',
                title: "NFC chip UID parser",
                description: "Normalize UIDs, prevent duplicates, add checksum validation.",
                tag: { color: 'blue', label: 'Platform' },
                dueDate: 'Sep 17',
                assignees: 1,
                progress: { completed: 4, total: 4 }
            },
            {
                id: 't13',
                title: "Artist onboarding email series",
                description: "Welcome, tag guide, certificate walkthrough.",
                tag: { color: 'accent', label: 'Lifecycle' },
                dueDate: 'Sep 16',
                assignees: 2,
                progress: { completed: 7, total: 7 }
            }
        ]
    }
];

interface TaskBoardProps {
    className?: string;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ className }) => {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    // const [dragSourceColumn, setDragSourceColumn] = useState<string | null>(null);
    const { toast } = useToast();

    const handleTaskDragStart = (e: React.DragEvent, task: Task) => {
        e.dataTransfer.setData('taskId', task.id);
        setDraggedTask(task);

        const sourceColumn = columns.find(col => col.tasks.some(t => t.id === task.id));
        if (sourceColumn) {
            // setDragSourceColumn(sourceColumn.id);
            e.dataTransfer.setData('sourceColumnId', sourceColumn.id);
        }
    };

    const handleTaskDragEnd = () => {
        setDraggedTask(null);
        // setDragSourceColumn(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDragLeave = (_e: React.DragEvent) => { console.log(_e) };

    const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
        e.preventDefault();

        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
        if (!taskId || !sourceColumnId || sourceColumnId === targetColumnId) return;

        const newColumns = columns.map(column => {
            if (column.id === sourceColumnId) {
                return { ...column, tasks: column.tasks.filter(task => task.id !== taskId) };
            }
            if (column.id === targetColumnId) {
                const taskToMove = columns.find(col => col.id === sourceColumnId)?.tasks.find(t => t.id === taskId);
                if (taskToMove) {
                    return { ...column, tasks: [...column.tasks, taskToMove] };
                }
            }
            return column;
        });

        setColumns(newColumns);

        const targetColumn = columns.find(col => col.id === targetColumnId);
        if (targetColumn && draggedTask) {
            toast({
                title: "Task moved",
                description: `${draggedTask.title} → ${targetColumn.title}`,
            });
        }
    };

    const handleStatusChange = (_taskId: string, _newStatus: string) => {

        console.log(_taskId, _newStatus);
    };

    return (
        <div className={`flex gap-4 overflow-x-auto pb-4 ${className || ''}`}>
            {columns.map(column => (
                <TaskColumn
                    key={column.id}
                    column={column}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onTaskDragStart={handleTaskDragStart}
                    onTaskDragEnd={handleTaskDragEnd}
                    onStatusChange={handleStatusChange}
                />
            ))}
        </div>
    );
};

export default TaskBoard;
