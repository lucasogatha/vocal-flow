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
      <p className="text-sm text-muted-foreground">
        Ningún homework con plazo próximo.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-4 py-3"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {item.homeworkName}
            </span>
            <span className="text-xs text-muted-foreground">{item.studentName}</span>
          </div>
          <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
            {new Date(item.dueDate + "T00:00:00").toLocaleDateString("es-419")}
          </span>
        </li>
      ))}
    </ul>
  );
}
