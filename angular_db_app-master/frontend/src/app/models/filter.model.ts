export interface SearchFilter {
  name: string;
  value: string;
}

export interface FilterItem {
  title: string;
  name: string;
  value: string;
  items: { value: string, viewValue: string }[];
}
