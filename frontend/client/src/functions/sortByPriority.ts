interface objWithPriority {
  priority: number;
}

export const sortByPriority = (a: objWithPriority, b: objWithPriority) => a.priority - b.priority