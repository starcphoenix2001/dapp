import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Check, Trash2, Calendar } from 'lucide-react';
import { getRelativeTime } from '../utils/dateHelpers';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <Card className={`transition-all duration-200 ${task.completed ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'}`}>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onToggle(task.id)}
            className={`h-10 w-10 rounded-full flex-shrink-0 ${
              task.completed 
                ? 'bg-emerald-100 text-emerald-600 border-emerald-200 hover:bg-emerald-200' 
                : 'hover:bg-slate-100'
            }`}
          >
            <Check className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-col min-w-0">
            <span className={`font-medium truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
              {task.title}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              {getRelativeTime(task.createdAt)}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-9 w-9"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}