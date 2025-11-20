export type Lesson = {
  id: string;
  title: string;
  summary: string;
  duration: string;
};

export type Course = {
  id: string;
  flag: string;
  name: string;
  subtitle: string;
  lessons: Lesson[];
};
