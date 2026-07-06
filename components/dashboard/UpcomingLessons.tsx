type UpcomingLesson = {
  id: string;
  studentName: string;
  lessonTitle: string;
  dueDate: string;
};

type UpcomingLessonsProps = {
  items: UpcomingLesson[];
};

export function UpcomingLessons({ items }: UpcomingLessonsProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500">Nenhuma aula com prazo próximo.</p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-gray-100">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-4 py-3"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {item.lessonTitle}
            </span>
            <span className="text-xs text-gray-500">{item.studentName}</span>
          </div>
          <span className="whitespace-nowrap text-xs font-medium text-gray-500">
            {new Date(item.dueDate + "T00:00:00").toLocaleDateString("pt-BR")}
          </span>
        </li>
      ))}
    </ul>
  );
}
