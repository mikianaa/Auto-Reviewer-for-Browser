import type { Annotation } from "./anotation";

export interface Review {
    id: string;
    selectedText: string;
    summary: string;
    detail: string;
    createdAt: string;
    annotations?: Annotation[];
} 