type UpcomingHomework = {
  id: string;
  studentName: string;
  homeworkName: string;
  dueDate: string;
};

type UpcomingHomeworksProps = {
  items: UpcomingHomework[];
};

export function UpcomingHomeworks({ items }: UpcomingHomeworksProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Ningún homework con plazo próximo.
      </p>
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
              {item.homeworkName}
            </span>
            <span className="text-xs text-gray-500">{item.studentName}</span>
          </div>
          <span className="whitespace-nowrap text-xs font-medium text-gray-500">
            {new Date(item.dueDate + "T00:00:00").toLocaleDateString("es-419")}
          </span>
        </li>
      ))}
    </ul>
  );
}
